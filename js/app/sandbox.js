define(['app/voronoi-drip', 'app/display'], function(VoronoiDrip, Display) {

    var Sandbox = {};

    Sandbox.create = function(spec) {
        var that = {};

        that.container = spec.container;
        that.tests = [];

        var createDebugVoronoiDrip = function(spec) {
            var that = VoronoiDrip.create(spec);

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
            }

            return that;
        };

        that.start = function() {
            var startAllLink = document.createElement('a');
            startAllLink.setAttribute('class', 'sandbox-start-all');
            startAllLink.setAttribute('href', '#');
            startAllLink.innerHTML = 'Start all';
            startAllLink.onclick = function(e) {
                e.preventDefault();
                that.tests.forEach(function(test) {
                    test.voronoiDrip.addFluid(
                        test.spec.addFluid.volume,
                        test.spec.addFluid.pipe,
                        test.spec.addFluid.vertex
                    );
                    test.voronoiDrip.play();
                });
            };
            that.container.appendChild(startAllLink);
        };

        that.createStartLink = function() {
            var startLink = document.createElement('a');
            startLink.setAttribute('class', 'sandbox-start');
            startLink.setAttribute('href', '#');
            startLink.innerHTML = 'Start';
            return startLink;
        };

        that.createContainer = function() {
            var dripContainer = document.createElement('div');
            dripContainer.setAttribute('class', 'sandbox-voronoi-drip');
            return dripContainer;
        };

        that.add = function(testSpec) {
            var dripContainer = that.createContainer(),
                startLink = that.createStartLink();
            dripContainer.appendChild(startLink);
            that.container.appendChild(dripContainer);

            testSpec.voronoiDrip.container = dripContainer;
            var voronoiDrip = createDebugVoronoiDrip(testSpec.voronoiDrip);
            voronoiDrip.start();
            voronoiDrip.draw();

            startLink.onclick = function(e) {
                e.preventDefault();
                voronoiDrip.addFluid(
                    testSpec.addFluid.volume,
                    testSpec.addFluid.pipe,
                    testSpec.addFluid.vertex
                );
                voronoiDrip.play();
            };

            that.tests.push({
                voronoiDrip: voronoiDrip,
                spec: testSpec
            })
        };

        return that;
    };

    return Sandbox;
});