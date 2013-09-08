/*

    Visualise fluid flowing through a network of pipes

    Pipe object:
        va
        vb
            vertex A, and vertex B objects, eg {x: 0, y: 10}
        ca
        cb
            array of indexes for edges that share vertex A and vertex B respectively

    Initialise with an object containing:
        width
        height
            size of the canvas
        pipeColour
            colour the network of pipes, eg '#eee'
        fluidColour
            colour of the fluid, eg '#000'
        gravity
            ammount of gravity force, the higher the gravity,
            the faster the fluid moves
        timeout
            time between iterations
        network
            an array of Pipes, can be generated with a
            VoronoiNetworkGenerator

    Returns the an object with the methods:
        start
            creates a canvas and starts the visualisation
        addFluid
            add a volume of fluid to any pipe
        stop
            pauses the visualisation
        update
            update the visualisation

*/

var vd = vd || {};

vd.createVoronoiDrip = function(spec) {
    var that = {},
        tickerTimeout;

    that.network = spec.network;

    that.getHighestEdgeAndVertex = function() {
        var edgeCount = that.network.length,
            highestEdge,
            highestVertex;

        while (edgeCount--) {
            var edge = that.network[edgeCount];

            if ( ! highestVertex || edge.va.y < highestVertex.y) {
                highestEdge = edge;
                highestVertex = edge.va;
            }

            if (edge.vb.y < highestVertex.y) {
                highestEdge = edge;
                highestVertex = edge.vb;
            }
        }

        return {
            edge: highestEdge,
            vertex: highestVertex
        };
    }

    that.drawNetwork = function() {
        var edgeCount = that.network.length,
            edge;

        while (edgeCount--) {
            edge = that.network[edgeCount];
            that.display.drawLine(
                {x: edge.va.x, y: edge.va.y},
                {x: edge.vb.x, y: edge.vb.y},
                spec.pipeColour
            )
        }
    };

    that.drawFluids = function() {
        var pipeCount = that.fpn.pipes.length,
            pipe,
            fluidCount,
            fluids,
            start,
            end,
            xDiff,
            yDiff;

        while (pipeCount--) {
            pipe = that.fpn.pipes[pipeCount];
            if ( ! pipe.hasOwnProperty('fluids')) {
                continue;
            }
            fluidCount = pipe.fluids.length;
            while (fluidCount--) {
                fluid = pipe.fluids[fluidCount];
                start = fluid.position / pipe.capacity;
                end = (fluid.position + fluid.volume) / pipe.capacity;
                xDiff = pipe.vb.x - pipe.va.x;
                yDiff = pipe.vb.y - pipe.va.y;
                that.display.drawLine(
                    {
                        x: pipe.va.x + (xDiff * start),
                        y: pipe.va.y + (yDiff * start),
                    },{
                        x: pipe.va.x + (xDiff * end),
                        y: pipe.va.y + (yDiff * end),
                    },
                    spec.fluidColour
                );
            }
        }
    };

    that.tick = function() {
        that.update();
        tickerTimeout = setTimeout(that.tick, spec.timeout);
    };

    that.start = function() {
        that.fpn = vd.createFluidPipeNetwork({
            pipes: that.network,
            gravity: spec.gravity
        });
        that.fpn.start();

        that.display = vd.createDisplay({
            width: spec.width,
            height: spec.height
        });
        that.display.start();

        that.drawNetwork();
        that.tick();
    };

    that.addFluid = function(volume, edge, vertex) {
        if ( ! vertex || ! edge) {
            highestEdgeAndVertex = that.getHighestEdgeAndVertex();
            edge = highestEdgeAndVertex.edge;
            vertex = highestEdgeAndVertex.vertex;
        }
        that.fpn.addFluid(edge, vertex, volume);
    };

    that.stop = function() {
        clearTimeout(tickerTimeout);
    };

    that.update = function() {
        that.fpn.update();
        that.display.clear();
        that.drawNetwork();
        that.drawFluids();
    };

    return that;
};