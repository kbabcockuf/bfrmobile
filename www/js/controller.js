angular.module("BFRMobile.controllers", ["BFRMobile.api"])
    .controller("BfrAppCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.signOut = bfrApi.signOut;
    }])

    .controller("UpcomingCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.upcoming = bfrApi.call("/logs/mine_upcoming.json")
            .map(bfrApi.logById)
            .then(function(result) {
                $scope.upcomingShifts = result.pick('data', 'log');
            }, function(result) {
                console.log("API call failed:", result);
                $scope.errorMsg = result.statusText || "Failed to load shifts.";
            });
    }])

    .controller("PickUpCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.open = bfrApi.call("/logs/open.json")
            .map(bfrApi.logById)
            .then(function(result) {
                $scope.openShifts = result.pick('data', 'log');
            }, function(result) {
                console.log("API call failed:", result);
                $scope.errorMsg = result.statusText || "Failed to load shifts.";
            });
    }])

    .controller("ReportCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        bfrApi.call("/logs/mine_past.json")
            .map(bfrApi.logById)
            .then(function(result) {
                $scope.pastShifts = result.pick('data', 'log');
            }, function(result) {
                console.log("API call failed:", result);
                $scope.errorMsg = result.statusText || "Failed to load shifts.";
            });
    }]);
