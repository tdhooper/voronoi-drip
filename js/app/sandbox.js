define(['app/debug-voronoi-drip'], function(DebugVoronoiDrip) {

    var Sandbox = {};

    Sandbox.create = function(spec) {
        var that = {};

        that.container = spec.container;
        that.tests = [];

        that.start = function() {
            var startAllLink = document.createElement('a');
            startAllLink.setAttribute('class', 'sandbox-start-all');
            startAllLink.setAttribute('href', '#');
            startAllLink.innerHTML = 'Start all';
            startAllLink.onclick = function(e) {
                e.preventDefault();
                that.tests.forEach(function(test) {
                    if (test.spec.hasOwnProperty('addFluid')) {
                        test.voronoiDrip.addFluid(
                            test.spec.addFluid.volume,
                            test.spec.addFluid.pipe,
                            test.spec.addFluid.vertex
                        );
                    }
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
            var voronoiDrip = DebugVoronoiDrip.create(testSpec.voronoiDrip);
            voronoiDrip.start();
            voronoiDrip.draw();

            startLink.onclick = function(e) {
                e.preventDefault();
                if (testSpec.hasOwnProperty('addFluid')) {
                    voronoiDrip.addFluid(
                        testSpec.addFluid.volume,
                        testSpec.addFluid.pipe,
                        testSpec.addFluid.vertex
                    );
                }
                voronoiDrip.play();
            };

            that.tests.push({
                voronoiDrip: voronoiDrip,
                spec: testSpec
            });
        };

        return that;
    };

    return Sandbox;
});