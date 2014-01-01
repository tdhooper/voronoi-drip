define(function() {

    var Metrics = {};

    Metrics.create = function(spec) {
        var that = {};

        that.MINIMUM_FLUID_VOLUME = 0.00001;
        that.GRAVITY = 5;

        that.pipes = spec.pipes;
        that.gravity = spec.hasOwnProperty('gravity') && spec.gravity ? spec.gravity : that.GRAVITY;

        that.pointsMatch = function(pointA, pointB) {
            return (pointA.x == pointB.x) && (pointA.y == pointB.y);
        };

        that.getAngle = function(pipe, point) {
            var up = {x: 0, y: -1},
                atanA = Math.atan2(up.x, up.y),
                atanB;

            if (that.pointsMatch(pipe.vb, point)) {
                atanB = Math.atan2(pipe.va.x - pipe.vb.x, pipe.va.y - pipe.vb.y);

            } else if (that.pointsMatch(pipe.va, point)) {
                atanB = Math.atan2(pipe.vb.x - pipe.va.x, pipe.vb.y - pipe.va.y);
            }

            return atanA - atanB;
        };

        that.getLength = function(pipe) {
            var xs = Math.pow(pipe.va.x - pipe.vb.x, 2),
                ys = Math.pow(pipe.va.y - pipe.vb.y, 2);
            return Math.sqrt(xs + ys);
        };

        that.calculateIncline = function(angle) {
            var half = Math.PI,
                quater = half * 0.5;
            return (angle <= half) ? (angle - quater) / quater : 1 - ((angle - half) / quater);
        };

        that.getFluidVelocity = function(pipe) {
            return pipe.incline * that.gravity;
        };

        that.getIncline = function(pipe, vertex) {
            return that.pointsMatch(pipe.va, vertex) ? pipe.incline : pipe.incline * -1;
        };

        that.getFluidAtVertex = function(pipe, vertex) {
            var fluidCount = pipe.fluids ? pipe.fluids.length : 0,
                fluid;

            while (fluidCount--) {
                fluid = pipe.fluids[fluidCount];

                if (
                    that.pointsMatch(pipe.va, vertex)
                    && fluid.position <= that.MINIMUM_FLUID_VOLUME
                ) {
                    return fluid;
                }

                if (
                    that.pointsMatch(pipe.vb, vertex)
                    && fluid.volume + fluid.position >= pipe.capacity - that.MINIMUM_FLUID_VOLUME
                ) {
                    return fluid;
                }
            }
        };

        that.getConnectedPipeIndexes = function(pipeIndex, vertex) {
            var pipes = [],
                pipe = that.pipes[pipeIndex],
                connectedPipes = (pipe.va == vertex) ? pipe.ca : pipe.cb,
                connectedPipeCount = connectedPipes ? connectedPipes.length : 0;
            while (connectedPipeCount--) {
                pipes.push(connectedPipes[connectedPipeCount]);
            }
            return pipes;
        };

        that.getConnectedPipes = function(pipe, vertex) {
            var pipeIndexes = that.getConnectedPipeIndexes(that.pipes.indexOf(pipe), vertex);
            var pipes = pipeIndexes.map(function(index) {
                return that.pipes[index];
            });
            return pipes;
        };

        that.getVertexPipes = function(pipe, vertex) {
            var pipes = that.getConnectedPipes(pipe, vertex);
            pipes.push(pipe);
            return pipes;
        };

        that.getAvailableCapacity = function(pipe) {
            if ( ! pipe.fluids || pipe.fluids.length === 0) {
                return pipe.capacity;
            }

            var fluidCount = pipe.fluids.length,
                fluid,
                totalVolume = 0;

            while(fluidCount--) {
                fluid = pipe.fluids[fluidCount];

                var overlapsA = fluid.position + fluid.volume > pipe.capacity,
                    overlapsB = fluid.position < 0;

                if (overlapsA && overlapsB) {
                    return 0;
                }

                if (overlapsA) {
                    totalVolume += pipe.capacity - fluid.position;
                } else if (overlapsB) {
                    totalVolume += fluid.volume - fluid.position;
                } else {
                    totalVolume += fluid.volume;
                }
            }

            return pipe.capacity - totalVolume;
        };

        that.hasCapacity = function(pipe) {
            return that.getAvailableCapacity(pipe) >= that.MINIMUM_FLUID_VOLUME;
        };

        that.getFluidLevel = function(pipe, vertex) {
            var fluid = that.getFluidAtVertex(pipe, vertex),
                heightFromVertex = that.getHeightFromVertex(pipe, vertex),
                fluidHeight = fluid ? (fluid.volume / pipe.capacity) * heightFromVertex : 0;
            return that.getVertexLevel(vertex) + fluidHeight;
        };

        that.getVertexLevel = function(vertex) {
            return vertex.y;
        };

        that.getHeightFromVertex = function(pipe, vertex) {
            var vertexALevel = that.getVertexLevel(pipe.va),
                vertexBLevel = that.getVertexLevel(pipe.vb);
            return that.pointsMatch(pipe.va, vertex) ? vertexBLevel - vertexALevel : vertexALevel - vertexBLevel;
        };

        that.start = function() {
            var pipeCount = that.pipes.length,
                pipe,
                angle;

            while (pipeCount--) {
                pipe = that.pipes[pipeCount];
                angle = that.getAngle(pipe, pipe.va);
                pipe.incline = that.calculateIncline(angle);
                pipe.capacity = that.getLength(pipe);
            }
        };

        return that;
    };

    return Metrics;
});