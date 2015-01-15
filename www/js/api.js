angular.module("BFRMobile-api", [])
    .value("loginRedirect", "index.html")
    .value("apiEndpoint", "http://dev.boulderfoodrescue.org")

    // Boulder Food Rescue API client
    .factory("bfrApi", [
        "$http", "apiEndpoint",
        function bfrApiFactory($http, apiEndpoint) {
            return {
                call: function(url) {
                    var config = {
                        url: apiEndpoint + url,
                        method: "GET"
                    };

                    return $http(config);
                }
            };
        }
    ])

    .factory("bfrCredentials", [
        "$location", "loginRedirect",
        function bfrCredentialsFactory($location, loginRedirect) {
            return function() {
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
                        }
                        return config;
                    }
                };
            });
        }
    ]);