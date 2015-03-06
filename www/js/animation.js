angular.module("BFRMobile.animation", [])
    /**
     * Grow from zero height.
     */
    .animation('.bfr-animate-grow', function() {
        return {
            enter: function(el, done) {
                el.css('opacity', 0);
                var autoHeight = el.outerHeight();
                el.css('height', 0);
                el.animate({
                    opacity: 1,
                    height: autoHeight
                }, 300, 'swing', function() {
                    el.css('height', 'auto');
                    done();
                });
            },
            leave: function(el, done) {
                el.animate({opacity: 0, height: 0}, 300, 'swing', done);
            }
        };
    });