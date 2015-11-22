var HOUR = 3600000;
var DAY = 24*HOUR;
var WEEK = 7*DAY;

/**
 * Convert a date to a friendly representation ("Tomorrow at 2:00 PM")
 *
 * @param date {String|Date} Date to convert.
 * @return A formatted string
 */
function fuzzyTime(date) {
    if (date === undefined) {
        return "Invalid Date";
    } else if (!(date instanceof Date)) {
        // Convert string arguments to dates
        date = new Date(date);
    }

	date = convertDate(date);
	
	var weekdayFormat = new Intl.DateTimeFormat('en', {
		weekday: 'long'
	});

	var timeFormat = new Intl.DateTimeFormat('en', {
		hour: 'numeric',
		minute: 'numeric'
	});

    var datesec = date.getTime();
    var nowsec = Date.now();
    var dayDelta = Math.floor(date / DAY) - Math.floor(nowsec / DAY);

    if (dayDelta < -7) {
        return date.toLocaleDateString() + " at "
            + timeFormat.format(date);
    } else if (dayDelta < -1) {
        return "Last " + weekdayFormat.format(date) + " at "
            + timeFormat.format(date);
    } else if (dayDelta < 0) {
        return "Yesterday at " + timeFormat.format(date);
    } else if (dayDelta < 1) {
        return "Today at " + timeFormat.format(date);
    } else if (dayDelta < 2) {
        return "Tomorrow at " + timeFormat.format(date);
    } else if (dayDelta < 7) {
        return weekdayFormat.format(date) + " at "
            + timeFormat.format(date);
    } else {
        return date.toLocaleDateString() + " at "
            + timeFormat.format(date);
    }
}

/**
 * Return a date representing `time` on the next `day` where day is a
 * day-of-the-week number from 0-6.
 * @param day {number} Day number (0-6)
 * @param time {Date} Date representing the time of occurrence
 * @param from {Date} Return the next occurrence after this date (optional)
 * @returns {Date}
 */
function nextWeekly(day, time, from) {
    var date = from || new Date();
    date.setDate(date.getDate() + (7 + day - date.getDay()) % 7);
    date.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    return date;
}

function convertDate(date) {
    var newDate = new Date();

    var offset = date.getTimezoneOffset()*60*1000;
    newDate.setTime(date.getTime() + offset);

    return newDate;   
}

/**
 * Return the next date when this shift will take place.
 */
function nextDate(schedule) {
    if (!schedule) {
        return "";
    }

    var startTime = new Date(schedule.detailed_start_time);

    var nextStart;
    switch (schedule.frequency) {
        case "weekly":
            nextStart = nextWeekly(schedule.day_of_week, startTime);
            break;
        default:
            console.log("Unrecognized frequency:", schedule.frequency);
            return "";
    }

    return nextStart;
}

angular.module("BFRMobile.filters", [])
    .factory('bfrLogUtils', function() {
        return {
            nextWeekly: nextWeekly,
            nextDate: nextDate,
            fuzzyTime: fuzzyTime
        }
    })

    .filter('describeFrequency', [function() {
        /**
         * Generate a human-readable summary for a recurring schedule.
         *
         * @param schedule {object} A schedule object as returned by the API
         * @return {String}
         */
        return function describeFrequency(schedule) {
            if (!schedule) {
                return "";
            }

            var summary = "";
            var start = new Date(schedule.detailed_start_time);
            var end = new Date(schedule.detailed_stop_time);

            switch (schedule.frequency) {
                case "weekly":
                    summary += "Pickup every " + weekdayFormat.format(
                        nextWeekly(schedule.day_of_week, start));
                    break;
                default:
                    console.log("Unrecognized frequency:", schedule.frequency);
                    summary += "Pickup " + schedule.frequency;
            }

            summary += " between " + timeFormat.format(start)
                + " and " + timeFormat.format(end);

            return summary;
        }
    }])
    .filter('describeNextDate', [function() {
        return function(log) {
            return fuzzyTime(nextDate(log));
        }
    }])
    .filter('describeLog', ['$filter', function($filter) {
        return function(item) {
            var summary = "";

            if (item.schedule) {
                summary += $filter('describeNextDate')(item.schedule)
                    + " from ";
            }

            return summary + item.log.donor.name;
        }
    }]);
