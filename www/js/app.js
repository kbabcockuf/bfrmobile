/**
 * Extract properties from each element in an Array of objects.
 *
 * @param * {string} Key(s) to extract
 * @return {Array} The extracted values for each input element
 */
Array.prototype.pick = function() {
    var keys = arguments;

    return this.map(function(item) {
        for (var i = 0; i < keys.length; i++) {
            item = item[keys[i]];
        };
        return item;
    });
}

// String.prototype.startsWith polyfill
if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function(searchString, position) {
      position = position || 0;
      return this.lastIndexOf(searchString, position) === position;
    }
  });
}

var app = angular.module('BFRMobile', [
    'ngRoute',
    'ngTouch',
    'ngAnimate',
    'BFRMobile.controllers',
    'BFRMobile.api',
    'BFRMobile.directives',
    'BFRMobile.animation',
    'BFRMobile.filters'
]);

app.config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);

        $routeProvider
            .when('/upcoming', {
                templateUrl: 'partials/upcoming.html',
                controller: 'UpcomingCtrl'
            })
            .when('/pickup', {
                redirectTo: '/pickup/onetime'
            })
            .when('/pickup/onetime', {
                templateUrl: 'partials/pickup_onetime.html',
                controller: 'PickUpOneTimeCtrl'
            })
            /*.when('/pickup/recurring', {
                templateUrl: 'partials/pickup_recurring.html',
                controller: 'PickUpRecurringCtrl'
            })*/
            .when('/report', {
                templateUrl: 'partials/past.html',
                controller: 'PastCtrl'
            })
            .when('/report/:logId', {
                templateUrl: 'partials/report.html',
                controller: 'ReportCtrl'
            })
            .when('/detail/:logId', {
                templateUrl: 'partials/detail.html',
                controller: 'DetailCtrl'
            })
            .when('/settings', {
                templateUrl: 'partials/settings_new.html',
                controller: 'SettingsCtrl'
            })
            .otherwise({
                redirectTo: '/upcoming'
            });
    }
]);
