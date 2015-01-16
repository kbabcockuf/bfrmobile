/**
 * Extract properties from each element in an Array of objects.
 *
 * @param * Key(s) to extract
 * @return An array containing the extracted value for each input element
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

var app = angular.module('BFRMobile', [
    'ngRoute',
    'ngTouch',
    'BFRMobile.controllers',
    'BFRMobile.api',
    'BFRMobile.directives'
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
                templateUrl: 'partials/pickup.html',
                controller: 'PickUpCtrl'
            })
            .when('/report', {
                templateUrl: 'partials/report.html',
                controller: 'ReportCtrl'
            })
            .when('/detail/:logId', {
                templateUrl: 'partials/detail.html',
                controller: 'DetailCtrl'
            })
            .when('/settings', {
                templateUrl: 'partials/settings.html',
                controller: 'SettingsCtrl'
            })
            .otherwise({
                redirectTo: '/upcoming'
            });
    }
]);