var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.UpdateLoop = VoronoiDrip.UpdateLoop || {};

VoronoiDrip.UpdateLoop.create = function(spec) {
    var that = {};

    that.start = function() {
        that.tick();
    };

    that.tick = function() {
        spec.update();
        tickerTimeout = setTimeout(that.tick, spec.timeout);
    };

    that.stop = function() {
        clearTimeout(tickerTimeout);
    };

    return that;
};