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
    });