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
                controller: 'UpcomingCtrl',
                tab: 'upcoming'
            })
            .when('/pickup', {
                templateUrl: 'partials/pickup.html',
                controller: 'PickUpCtrl',
                tab: 'pickup'
            })
            .when('/report', {
                templateUrl: 'partials/past.html',
                controller: 'PastCtrl',
                tab: 'past'
            })
            .when('/report/:logId', {
                templateUrl: 'partials/report.html',
                controller: 'ReportCtrl',
                tab: 'past'
            })
            .when('/detail/:logId', {
                templateUrl: 'partials/detail.html',
                controller: 'DetailCtrl',
                tab: 'detail'
            })
            .when('/settings', {
                templateUrl: 'partials/settings_new.html',
                controller: 'SettingsCtrl',
                tab: 'settings'
            })
            .otherwise({
                redirectTo: '/upcoming'
            });
    }
]);
