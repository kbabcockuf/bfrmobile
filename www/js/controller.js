/**
 * Return a function that stores it's first argument in obj[key].
 *
 * @param obj {object} Target
 * @param key {string} Property of obj
 * @return {function}
 */
function storeIn(obj, key) {
    return function(result) {
        return obj[key] = result;
    }
}

/**
 * Return a function that stores an error in the given property of obj.
 *
 * @param obj {object} Target
 * @param key {string} Property of obj
 * @param message {string} Optional message describing the error
 * @return {function}
 */
function storeErrorIn(obj, key, message) {
    return function(result) {
        console.log("Error:", message, result);
        return obj[key] = result.statusText || message
            || "Failed to load shifts.";
    }
}

angular.module("BFRMobile.controllers", ["BFRMobile.api"])
    .controller("BfrAppCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.signOut = bfrApi.signOut;
    }])

    .controller("UpcomingCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.upcoming = bfrApi.call("/logs/mine_upcoming.json")
            .map(bfrApi.logById)
            .then(storeIn($scope, 'upcomingShifts'))
            .catch(storeErrorIn($scope, 'errorMsg'));
    }])

    .controller("PickUpCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        $scope.open = bfrApi.call("/logs/open.json")
            .map(bfrApi.logById)
            .then(storeIn($scope, 'openShifts'))
            .catch(storeErrorIn($scope, 'errorMsg'));
    }])

    .controller("ReportCtrl", ['$scope', 'bfrApi', function($scope, bfrApi) {
        bfrApi.call("/food_types.json")
            .then(storeIn($scope, 'foodTypes'));
        bfrApi.call("/scale_types.json")
            .then(storeIn($scope, 'scaleTypes'));
        bfrApi.call("/transport_types.json")
            .then(storeIn($scope, 'transportTypes'));

        bfrApi.call("/logs/mine_past.json")
            .map(bfrApi.logById)
            .then(storeIn($scope, 'pastShifts'))
            .catch(storeErrorIn($scope, 'errorMsg'));
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