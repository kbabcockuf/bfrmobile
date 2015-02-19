angular.module("BFRMobile.api", [])
    .value("loginRedirect", "index.html")

    /**
     * API endpoint to be prepended to API calls (excludes trailing '/').
     */
    .value("apiEndpoint", "http://dev.boulderfoodrescue.org")

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
                 * Send an updated log item to the API.
                 *
                 * @param log {object} Object with .log and .log_parts
                 * @return {Promise}
                 */
                updateLog: function(log) {
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
                 * @param item {object} The log item
                 * @return {Promise} The log item with location information
                 * added
                 */
                loadLocationDetail: function(item) {
                    item.donor = api.locationById(item.donor_id);
                    item.recipients = $q.all(
                        item.recipient_ids.map(api.locationById));

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
                    volunteer_email: window.sessionStorage.email,
                    volunteer_token: window.sessionStorage.token
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
