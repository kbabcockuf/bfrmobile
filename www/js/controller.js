angular.module("BFRMobile.controllers", ["BFRMobile.api"])
    .controller("BfrAppCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.signOut = bfrApi.signOut;
    }])

    .controller("UpcomingCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.upcoming = bfrApi.call("/logs/mine_upcoming.json")
            .map(bfrApi.logById)
            .then(function(result) {
                $scope.upcomingShifts = result.pick('log');
            }, function(result) {
                console.log("API call failed:", result);
                $scope.errorMsg = result.statusText || "Failed to load shifts.";
            });
    }])

    .controller("PickUpCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.open = bfrApi.call("/logs/open.json")
            .map(bfrApi.logById)
            .then(function(result) {
                $scope.openShifts = result.pick('log');
            }, function(result) {
                console.log("API call failed:", result);
                $scope.errorMsg = result.statusText || "Failed to load shifts.";
            });
    }])

    .controller("ReportCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        bfrApi.call("/logs/mine_past.json")
            .map(bfrApi.logById)
            .then(function(result) {
                $scope.pastShifts = result.pick('log');
            }, function(result) {
                console.log("API call failed:", result);
                $scope.errorMsg = result.statusText || "Failed to load shifts.";
            });
    }])

    .controller("SettingsCtrl", ['$scope', function($scope) {

    }])

    .controller("DetailCtrl", [
        '$scope', '$routeParams', 'bfrApi',
        function($scope, $routeParams, bfrApi) {
            bfrApi.logById($routeParams.logId)
                .then(function(result) {
                    $scope.shift = result.log;
                    return bfrApi.loadLocationDetail($scope.shift);
                })
                .then(function(result) {
                    var points = [result.donor];
                    Array.prototype.push.apply(points, result.recipients);
                    $scope.mapUrl = "https://www.google.com/maps/dir/" + points
                        .map(function(i) {
                                return encodeURIComponent(i.lat + ',' + i.lng);
                            })
                        .join('/');
                }, function(result) {
                    console.log("API call failed:", result);
                    $scope.errorMsg = result.statusText
                        || "Failed to load shift details.";
                });
        }]);