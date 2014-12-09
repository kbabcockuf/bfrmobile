var app = angular.module('logApp', []);

function homeCtrl($scope) {
    $scope.log = exampleLog;

    


}

function locationCtrl($scope) { 
    $scope.location = exampleLocation;

}

var exampleLog = { log:
	{ id: 15363,
	    when: "2014-09-27",
	    notes: "",
	    num_reminders: 12,
	    flag_for_admin: false,
	    created_at: "2014-09-26T18:07:58-06:00",
	    updated_at: "2014-10-05T17:33:19-06:00",
	    donor_id: 245,
	    transport_type_id: 1,
	    region_id: 1,
	    complete: true,
	    scale_type_id: 31,
	    weight_unit: "lb",
	    schedule_chain_id: 3,
	    recipient_ids:
			[
				29
			],
	    volunteer_ids:
			[
				928
			]
	},
    schedule:
	{
	    id: 3,
	    detailed_start_time: "2000-01-01T17:00:00Z",
	    detailed_stop_time: "2000-01-01T18:00:00Z",
	    detailed_date: "2013-10-30",
	    transport_type_id: 1,
	    backup: false,
	    temporary: false,
	    irregular: false,
	    difficulty_rating: 1,
	    hilliness: 2,
	    scale_type_id: null,
	    region_id: 1,
	    frequency: "weekly",
	    day_of_week: 6,
	    expected_weight: 80,
	    public_notes: "At least you get to go down the big hill with the load!",
	    admin_notes: ""
	},
    log_parts:
	{
	    18895:
		{
		    id: 18895,
		    log_id: 15363,
		    food_type_id: 59,
		    required: null,
		    weight: "5.0",
		    created_at: "2014-09-26T18:07:58-06:00",
		    updated_at: "2014-10-05T17:32:50-06:00",
		    count: null,
		    description: ""
		}
	}
};


//var exampleLocation = {
//	id: 1,
//	is_donor: true,
//	recip_category: null,
//	donor_type: "Grocer",
//	address: "1275 Alpine Avenue Boulder, CO 80304",
//	name: "Whole Foods Alpine Ideal Market",
//	lat: "40.0259783",
//	lng: "-105.2808558",
//	contact: "Tammy Thomas",
//	website: "http://wholefoodsmarket.com/stores/alpineideal/",
//	admin_notes: "",
//	public_notes: "Prefer us to arrive around 10, so the prepped food people can pick through first. Not a 100% necessary thing though.",
//	hours: "Receiving: 0700-1100 ",
//	created_at: "2012-06-22T15:41:07-06:00",
//	updated_at: "2014-05-29T12:22:26-06:00",
//	region_id: 1,
//	twitter_handle: "IdealMarket",
//	receipt_key: "",
//	detailed_hours_json: "{"0":{"status":"0","start":"Thu, 29 May 2014 00:00:00 -0600","end":"Thu, 29 May 2014 00:00:00 -0600"},"1":{"status":"0","start":"Thu, 29 May 2014 00:00:00 -0600","end":"Thu, 29 May 2014 00:00:00 -0600"},"2":{"status":"0","start":"Thu, 29 May 2014 00:00:00 -0600","end":"Thu, 29 May 2014 00:00:00 -0600"},"3":{"status":"0","start":"Thu, 29 May 2014 00:00:00 -0600","end":"Thu, 29 May 2014 00:00:00 -0600"},"4":{"status":"0","start":"Thu, 29 May 2014 00:00:00 -0600","end":"Thu, 29 May 2014 00:00:00 -0600"},"5":{"status":"0","start":"Thu, 29 May 2014 00:00:00 -0600","end":"Thu, 29 May 2014 00:00:00 -0600"},"6":{"status":"0","start":"Thu, 29 May 2014 00:00:00 -0600","end":"Thu, 29 May 2014 00:00:00 -0600"}}",
//	email: "",
//	phone: "",
//	equipment_storage_info: "Our trailer is kept at the bike parking area to the right of the store front. This is a bike/trailer combo, so you can park your bike and use ours!",
//	food_storage_info: "Our food is kept in boxes on a cart on the dock. Ask the head receiver to point you in the right direction. ",
//	entry_info: "The dock is even farther right than the bike parking! After hitching up, open the slatted fence door and walk up the ramp. (Leave your bike below, silly!) ",
//	exit_info: "Back down the ramp!",
//	onsite_contact_info: "Ask for the head receiver!"
//};