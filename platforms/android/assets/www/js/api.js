angular.module("BFRMobile.api", [])
    .value("loginRedirect", "login.html")

    /**
     * API endpoint to be prepended to API calls (excludes trailing '/').
     */
    .value("apiEndpoint", "http://boulderfoodrescue.org")

    /**
     * Boulder Food Rescue API client
     */
    .factory("bfrApi", [
        "$http", "$q", "$location", "apiEndpoint", "loginRedirect",
        function bfrApiFactory($http, $q, $location, apiEndpoint,
                               loginRedirect) {
            // Used to extend promises returned from API calls.
            var apiPromise = {
                /**
                 * Map results from an API request.
                 *
                 * @param fn {function} Map function for elements that returns a
                 * Promise
                 * @returns {Promise} The result of all fn() falls
                 */
                map: function(fn) {
                    return this.then(function(result) {
                        return $q.all(result.map(fn));
                    });
                }
            }

            var api = {
                /**
                 * Call the BFR API.
                 *
                 * @param url {string} Destination URL
                 * @param config {object} Optional $http config
                 * @param raw {boolean} Include response code in result callback
                 * @return {Promise} Promise augmented with .map()
                 */
                call: function(url, config, raw) {
                    config = config || {};
                    config.url = apiEndpoint + url;
                    config.method = config.method || "GET";

                    var promise = $http(config)
                        .catch(function(result) {
                            if (result.status == 401) {
                                // Request failed because used was logged out
                                api.signOut();
                            }
                            return $q.reject(result);
                        })

                    if (!raw) {
                        promise = promise.then(function(result) {
                            return result.data;
                        });
                    }

                    return angular.extend(promise, apiPromise);
                },

                /**
                 * Get details about a log item (useful with .map()).
                 *
                 * @param item {object|Number} Id, or an object with an id
                 * property
                 * @return {object} Object representing the log entry
                 */
                logById: function(item) {
                    var id = (item.id || item);
                    return api.call("/logs/" + id + ".json");
                },

                /**
                 * Get detauls about a schedule chain
                 *
                 * @param item {object|Number} Id, or an object with an id
                 * property
                 * @return {Promise} Promise for the schedule chain details
                 */
                /*chainById: function(item) {
                    var id = (item.id || item);
                    return api.call("/schedule_chains/" + id + ".json");
                },*/

                /**
                 * Send an updated log item to .then(function(result) {
                    $scope.log_parts = result.log_parts;
                    return bfrApi.loadLocationDetail(result.log);
                })the API.
                 *
                 * @param log {object} Object with .log and .log_parts
                 * @return {Promise}
                 */
                updateLog: function(log) {
                    // Don't modify the caller's object
                    log = angular.copy(log);

                    // Log parts are returned with 'count' as a string, but
                    // expect a number when updating
                    for (var id in log.log_parts) {
                        log.log_parts[id].count =
                            String(log.log_parts[id].count);
                    }

                    // Remove read-only properties from the log object.
                    var read_only_properties =
                        ['volunteer_names', 'donor','recipients'];
                    read_only_properties.forEach(function(key) {
                        delete log.log[key];
                    });

                    return api.call("/logs/" + log.log.id + ".json", {
                        method: 'PUT',
                        data: log
                    });
                },

                /**
                 * Convenience method for loading locations.
                 *
                 * @param id {Number} A location ID
                 * @return {object} Details about the location
                 */
                locationById: function(id) {
                    return api.call('/locations/' + id + '.json');
                },

                /**
                 * Load details about locations in a log item.
                 *
                 * @param item {object} The log item (from /logs/id.json)
                 * @return {Promise} The log item with location information
                 * added
                 */
                loadLocationDetail: function(item) {
                    item.log.donor = api.locationById(item.log.donor_id);
                    item.log.recipients = $q.all(
                        item.log.recipient_ids.map(api.locationById));
                    item.log = $q.all(item.log);
                    return $q.all(item);
                },

                /**
                 * End the user's session and redirect to the login page.
                 *
                 * @return {Promise} The result of the sign out API call
                 */
                signOut: function() {
                    return api.call("/volunteers/sign_out.json",
                                    {method: 'DELETE'})
                        .then(function(result) {
                            window.location = loginRedirect;
                            return result;
                        });
                }
            };
            return api;
        }
    ])

    .factory("bfrCredentials", [
        "loginRedirect",
        function bfrCredentialsFactory(loginRedirect) {
            /**
             * Return credentials, or redirect to the login page.
             *
             * @return {object} Authentication parameters for API requests
             */
            return function bfrCredentials() {
                var auth = {
                    volunteer_email: window.localStorage.email,
                    volunteer_token: window.localStorage.token
                };

                if (!auth.volunteer_email || !auth.volunteer_token) {
                    window.location = loginRedirect;
                }

                return auth;
            };
        }
    ])

    .config([
        "$httpProvider",
        function bfrApiConfig($httpProvider) {
            // Improve performance when making groups of requests
            $httpProvider.useApplyAsync(true);

            // Add authentication information to each API request.
            $httpProvider.interceptors.push(function($location, bfrCredentials,
                                                     apiEndpoint) {
                return {
                    'request': function(config) {
                        if (config.url.indexOf(apiEndpoint) == 0) {
                            var auth = bfrCredentials();
                            config.params = config.params || {};
                            for (var key in auth) {
                                config.params[key] = auth[key];
                            }

                            //console.log("Transformed request:", config,
                            //            config.url.indexOf(apiEndpoint));
                        } // Else this was not an API request.
                        return config;
                    }
                };
            });
        }
    ]);
