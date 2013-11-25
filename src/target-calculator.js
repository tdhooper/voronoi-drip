var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.FluidNetworkSimulation = VoronoiDrip.FluidNetworkSimulation || {};
VoronoiDrip.FluidNetworkSimulation.TargetCalculator = VoronoiDrip.FluidNetworkSimulation.TargetCalculator || {};

VoronoiDrip.FluidNetworkSimulation.TargetCalculator.create = function(spec) {
    var that = {};

    that.pipes = spec.pipes;
    that.metrics = spec.metrics;

    that.getTargetHash = function(pipeIndex, vertex) {
        return pipeIndex + ':' + vertex.x + ':' + vertex.y;
    }

    that.getAvailableTargetsForPipe = function(pipeIndex, vertex, isRecursive) {
        if ( ! isRecursive) {
            that.highestVertex = vertex;
            that.connectedPipesChecked = [];
        }
        var targetHash = that.getTargetHash(pipeIndex, vertex);
        if (that.connectedPipesChecked.indexOf(targetHash) !== -1) {
            return false;
        }
        that.connectedPipesChecked.push(targetHash);

        var pipe = that.pipes[pipeIndex],
            hasCapacity = that.metrics.hasCapacity(pipe),
            otherVertex = that.metrics.pointsMatch(pipe.va, vertex) ? pipe.vb : pipe.va,
            connectedIndexes = that.metrics.getConnectedPipeIndexes(pipeIndex, otherVertex),
            connectedCount = connectedIndexes.length;

        if (hasCapacity) {
            return [{
                pipe: pipe,
                vertex: vertex,
                highestVertex: that.highestVertex
            }];
        }

        if (otherVertex.y < that.highestVertex.y) {
            that.highestVertex = otherVertex;
        }

        if ( ! connectedCount) {
            return false;
        }

        var connectedIndex,
            connectedTargets,
            targets = [];
        while (connectedCount--) {
            connectedIndex = connectedIndexes[connectedCount];
            connectedTargets = that.getAvailableTargetsForPipe(connectedIndex, otherVertex, true);
            if (connectedTargets) {
                targets = targets.concat(connectedTargets);
            }
        }

        targets = targets.map(function(target) {
            target.highestVertex = that.highestVertex;
            return target;
        });

        return targets;
    };

    that.getForVertex = function(pipe, vertex) {
        var pipes = that.metrics.getVertexPipes(pipe, vertex);

        var pipeCount = pipes.length,
            pipeIndex,
            pipeTargets,
            targets = [];
        while(pipeCount--) {
            pipeIndex = that.pipes.indexOf(pipes[pipeCount]);
            pipeTargets = that.getAvailableTargetsForPipe(pipeIndex, vertex);
            if (pipeTargets) {
                targets = targets.concat(pipeTargets);
            }
        }

        return targets;
    };

    return that;
};