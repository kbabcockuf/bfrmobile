angular.module("BFRMobile.directives", [])
    /**
     * Collapsing drawer directive.
     *
     * @param bfrShow Bound variable indicating drawer content visibility
     * @param bfrTitle Drawer title
     */
    .directive("bfrDrawer", function() {
        return {
            templateUrl: 'partials/drawer.html',
            transclude: true,
            scope: {show: '=?bfrShow', title: '=bfrTitle'},
            //link: function(scope, element, attrs, controller, transcludeFn) {}
        };
    })

    .directive("bfrMap", function() {
        return {
            template: '<iframe ng-src="{{url}}"></iframe>',
            scope: {route: '=bfrRoute'},
            controller: function($scope, $sce) {
                function setSrc() {} {
                    var url = 'https://www.google.com/maps/embed/v1/' +
                        'directions?key=AIzaSyD8c6OCF67BCrCMbgBNrcdEEuDnCNqWlk4'
                        + '&origin=' + encodeURIComponent($scope.route[0]);

                    if ($scope.route.length > 2) {
                        url += '&waypoints=' + encodeURIComponent($scope.route.slice(1, -1).join('|'));
                    }

                    url += '&destination=' + encodeURIComponent($scope.route[$scope.route.length - 1])
                        + '&mode=bicycling';

                    $scope.url = $sce.trustAs($sce.RESOURCE_URL, url);
                }

                $scope.$watch('origin', setSrc);
                $scope.$watch('destination', setSrc);
            }
        }
    });