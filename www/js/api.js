angular.module("BFRMobile.api", [])
    .value("loginRedirect", "index.html")
    .value("apiEndpoint", "http://dev.boulderfoodrescue.org")

    // Boulder Food Rescue API client
    .factory("bfrApi", [
        "$http", "$q", "apiEndpoint",
        function bfrApiFactory($http, $q, apiEndpoint) {
            /**
             * Map results from an API request.
             *
             * @param fn Map function for elements. Returns a new promise.
             * @return Promise for resolution of all fn() results.
             */
            function map(fn) {
                return this.then(function(result) {
                    return $q.all(result.data.map(fn));
                });
            }

            var api = {
                /**
                 * Call the BFR API.
                 *
                 * @param url Destination URL
                 * @param config Optional $http config
                 * @return Promise augmented with .map()
                 */
                call: function(url, config) {
                    config = config || {};

                    config.url = apiEndpoint + url;
                    config.method = config.method || "GET";

                    // Add .map() before returning the promise.
                    var promise = $http(config)
                    promise.map = map;
                    return promise;
                },

                /**
                 * Convenience method for accessing logs.
                 *
                 * Equivalent to:
                 * bfrApi.call("/logs/" + id + ".json");
                 *
                 * @param item Id, or an object with an id property.
                 * @return Object representing the log entry
                 */
                logById: function(item) {
                    var id = item.id || item;
                    return api.call("/logs/" + id + ".json");
                }
            };

            return api;
        }
    ])

    .factory("bfrCredentials", [
        "$location", "loginRedirect",
        function bfrCredentialsFactory($location, loginRedirect) {
            /**
             * Return credentials, or redirect to the login page.
             *
             * @return An object containing authentication parameters for an
             *         API request.
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