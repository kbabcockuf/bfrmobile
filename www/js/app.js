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
                templateUrl: 'partials/pickup.html',
                controller: 'PickUpCtrl'
            })
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
            /*.when('/detail', {
                templateUrl: 'partials/detail.html',
                controller: 'DetailCtrl'
            })*/
            /*.when('/info_new', {
                templateUrl: 'partials/info_new.html',
                controller: 'InfoCtrl'
            })*/
            .otherwise({
                redirectTo: '/upcoming'
            });
    }
]);
