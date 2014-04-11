require(['global.config'], function() {
    require(['app/voronoi-network-generator', 'app/voronoi-drip'], function(VoronoiNetworkGenerator, VoronoiDrip) {
        var networkGenerator = VoronoiNetworkGenerator.create();

        var width = 100,
            height = 500;

        var voronoiDrip = VoronoiDrip.create({
            width: width,
            height: height,
            pipeColour: '#eee',
            fluidColour: '#000',
            gravity: 10,
            timeout: 5,
            network: networkGenerator.generate(300, width, height)
        });

        voronoiDrip.start();
        voronoiDrip.play();

        document.body.onclick = function() {
            voronoiDrip.addFluid(150);
        };

        /*
        var autoAdd = setInterval(function() {
            var pipe = Math.floor(Math.random() * voronoiDrip.network.length);
            // voronoiDrip.fpn.addFluid(voronoiDrip.fpn.pipes[pipe], voronoiDrip.fpn.pipes[pipe].va, 30);
            voronoiDrip.addFluid(5);
        }, 100);

        var stop = function() {
            clearInterval(autoAdd);
            voronoiDrip.stop();
        };
        */
    });
});