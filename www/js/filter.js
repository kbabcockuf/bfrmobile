var HOUR = 3600000;
var DAY = 24*HOUR;
var WEEK = 7*DAY;

angular.module("BFRMobile.filters", [])
    .filter('fuzzyTime', [function() {
        var weekdayFormat = new Intl.DateTimeFormat('en', {
            weekday: 'long'
        });

        var timeFormat = new Intl.DateTimeFormat('en', {
            hour: 'numeric',
            minute: 'numeric'
        });

        /**
         * Convert a date to a friendly representation ("Tomorrow at 2:00 PM")
         *
         * @param date {String|Date} Date to convert.
         * @return A formatted string
         */
        return function(date) {
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
    }]);