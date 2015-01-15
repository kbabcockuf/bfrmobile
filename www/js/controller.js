angular.module("BFRMobile-controllers", ["BFRMobile-api"])
    .controller("UpcomingCtrl", [
        '$q', 'bfrApi',
        function($q, bfrApi) {
            bfrApi.call("/logs/mine_past.json")
                .map(function(i) {
                    return bfrApi.call("/logs/" + i.id + ".json");
                })
                .then(console.log.bind(console));
        }
    ])

    .controller("PickUpCtrl", function() {})

    .controller("ReportCtrl", function() {});
