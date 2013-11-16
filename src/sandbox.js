var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.Sandbox = VoronoiDrip.Sandbox || {};

VoronoiDrip.Sandbox.create = function(spec) {
    var that = {};

    that.container = spec.container;
    that.drips = [];

    that.start = function() {
        var startAllLink = document.createElement('a');
        startAllLink.setAttribute('class', 'sandbox-start-all');
        startAllLink.setAttribute('href', '#');
        startAllLink.innerHTML = 'Start all';
        startAllLink.onclick = function() {
            that.drips.forEach(function(drip) {
                drip.voronoiDrip.addFluid(drip.spec.startVolume);
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

    that.add = function(dripSpec) {
        var dripContainer = that.createContainer(),
            startLink = that.createStartLink();
        dripContainer.appendChild(startLink);
        that.container.appendChild(dripContainer);

        dripSpec.container = dripContainer;
        var voronoiDrip = VoronoiDrip.create(dripSpec);
        voronoiDrip.start();

        startLink.onclick = function() {
            voronoiDrip.addFluid(dripSpec.startVolume);
        };

        that.drips.push({
            voronoiDrip: voronoiDrip,
            spec: dripSpec
        })
    };

    return that;
};