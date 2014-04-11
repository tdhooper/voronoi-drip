define(['app/voronoi-drip', 'app/display'], function(VoronoiDrip, Display) {

    var DebugVoronoiDrip = VoronoiDrip;

    var createSuper = VoronoiDrip.create;

    DebugVoronoiDrip.create = function(spec) {
        var that = createSuper(spec);

        var drawCacheGroup = function(group) {
            group.fullPipes.forEach(function(pipe) {
                that.debugDisplay.drawLine(pipe.va, pipe.vb, 'rgba(255, 0, 0, 0.8)');
            });
            group.targets.forEach(function(target) {
                var otherVertex = that.fluidNetworkSimulation.metrics.pointsMatch(target.pipe.va, target.vertex) ? target.pipe.vb : target.pipe.va,
                    va = target.vertex,
                    vb = {
                        x: target.vertex.x + (otherVertex.x - target.vertex.x) * 0.1,
                        y: target.vertex.y + (otherVertex.y - target.vertex.y) * 0.1
                    };

                that.debugDisplay.drawLine(va, vb, 'rgba(0, 0, 255, 0.8)');
            });
        };

        var drawCacheGroups = function() {
            that.debugDisplay.clear();
            that.fluidNetworkSimulation.targetCalculator.cache.forEach(function(group) {
                drawCacheGroup(group);
            });
        };

        var startSuper = that.start;

        that.start = function() {
            that.debugDisplay = Display.create({
                width: spec.width,
                height: spec.height,
                container: spec.container
            });
            that.debugDisplay.start();
            that.debugDisplay.canvas.setAttribute('class', 'sandbox-debug-display');

            startSuper();
        };

        var updateSuper = that.update;

        that.update = function() {
            updateSuper();
            drawCacheGroups();
        };

        return that;
    };

    return DebugVoronoiDrip;
});