var app = angular.module('BFRMobile', [
    'ngRoute',
    'BFRMobile-controllers',
    'BFRMobile-api'
]);

app.config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
        
        $routeProvider
            .when('/upcoming', {
                templateUrl: '/partials/upcoming.html',
                controller: 'UpcomingCtrl'
            })
            .otherwise({
                redirectTo: '/upcoming'
            });
    }
]);