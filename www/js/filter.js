var HOUR = 3600000;
var DAY = 24*HOUR;
var WEEK = 7*DAY;

var WEEKDAY_FORMAT = new Intl.DateTimeFormat('en', {
    weekday: 'long'
});

// The API reports that times are in UTC (i.e '2000-01-01T14:00:00Z'), but they
// are actually in local time. Format all times as UTC to match the desktop
// website.
var TIME_FORMAT = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC'
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
 * Return a date representing `time` on the next `day` where day is a
 * day-of-the-week number from 0-6.
 * @param day {number} Day number (0-6)
 * @param time {Date} Date representing the time of occurrence
 * @returns {Date}
 */
function nextWeekly(day, time) {
    var date = new Date();
    console.log(date, " -- ", day);

    date.setDate(date.getDate() + (7 + day - date.getDay()) % 7);
    date.setHours(time.getHours(), time.getMinutes());

    console.log(date);
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
            var start = new Date(schedule.detailed_start_time);
            var end = new Date(schedule.detailed_stop_time);

            switch (schedule.frequency) {
                case "weekly":
                    summary += "Pickup every " + WEEKDAY_FORMAT.format(
                        nextWeekly(schedule.day_of_week, start));
                    break;
                default:
                    console.log("Unrecognized frequency:", schedule.frequency);
                    summary += "Pickup " + schedule.frequency;
            }

            summary += " between " + TIME_FORMAT.format(start)
                + " and " + TIME_FORMAT.format(end);

            return summary;
        }
    }])
    .filter('nextDate', [function() {
        return function(schedule) {
            console.log(schedule);
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

            return fuzzyTime(nextStart);
        }
    }]);
