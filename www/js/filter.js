var HOUR = 3600000;
var DAY = 24*HOUR;
var WEEK = 7*DAY;

var WEEKDAY_FORMAT = new Intl.DateTimeFormat('en', {
    weekday: 'long'
});

var TIME_FORMAT = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric'
});

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

    var datesec = date.getTime();
    var nowsec = Date.now();
    var dayDelta = Math.floor(date / DAY) - Math.floor(nowsec / DAY);

    if (dayDelta < -7) {
        return date.toLocaleDateString() + " at "
            + TIME_FORMAT.format(date);
    } else if (dayDelta < -1) {
        return "Last " + WEEKDAY_FORMAT.format(date) + " at "
            + TIME_FORMAT.format(date);
    } else if (dayDelta < 0) {
        return "Yesterday at " + TIME_FORMAT.format(date);
    } else if (dayDelta < 1) {
        return "Today at " + TIME_FORMAT.format(date);
    } else if (dayDelta < 2) {
        return "Tomorrow at " + TIME_FORMAT.format(date);
    } else if (dayDelta < 7) {
        return WEEKDAY_FORMAT.format(date) + " at "
            + TIME_FORMAT.format(date);
    } else {
        return date.toLocaleDateString() + " at "
            + TIME_FORMAT.format(date);
    }
}

/**
 * Return a date in the future representing a particular day of the week.
 * @param day {number} Day number (0-6)
 * @returns {Date}
 */
function nextDayOfWeek(day) {
    var date = new Date();
    date.setDate(date.getDate() + (7 + day - date.getDay()) % 7);
    return date;
}

angular.module("BFRMobile.filters", [])
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
            switch (schedule.frequency) {
                case "weekly":
                    summary += "Pickup every " + WEEKDAY_FORMAT.format(
                        nextDayOfWeek(schedule.day_of_week-1));
                    break;
                default:
                    console.log("Unrecognized frequency:", schedule.frequency);
                    summary += "Pickup " + schedule.frequency;
            }

            var start = new Date(schedule.detailed_start_time);
            var end = new Date(schedule.detailed_stop_time);

            summary += " between " + TIME_FORMAT.format(start)
                + " and " + TIME_FORMAT.format(end);

            return summary;
        }
    }])
    .filter('nextDate', [function() {
        return function(schedule) {
            if (!schedule) {
                return "";
            }

            var nextStart = new Date();

            switch (schedule.frequency) {
                case "weekly":
                    break;
                default:
                    console.log("Unrecognized frequency:", schedule.frequency);
                    return "";
            }

            return fuzzyTime(nextStart);
        }
    }]);
