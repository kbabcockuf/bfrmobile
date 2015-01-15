angular.module("BFRMobile-controllers", ["BFRMobile-api"])
    .controller("UpcomingCtrl", ['bfrApi', function(bfrApi) {
        console.log("UpcomingCtrl loaded");

        if (window.testCall) return;

        window.testCall = bfrApi.call("/logs/mine_upcoming.json");

        window.testCall.then(console.log.bind(console));
    }])

    .controller("PickUpCtrl", function() {})

    .controller("ReportCtrl", function() {});
