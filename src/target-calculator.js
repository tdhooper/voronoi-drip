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

    that.getGroupForPipe = function(pipeIndex, vertex, isRecursive) {
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
            return {
                targets: [{
                    pipe: pipe,
                    vertex: vertex,
                    highestVertex: that.highestVertex
                }]
            };
        }

        if (otherVertex.y < that.highestVertex.y) {
            that.highestVertex = otherVertex;
        }

        if ( ! connectedCount) {
            return {
                fullPipes: [pipe]
            };
        }

        var connectedIndex,
            connectedGroup,
            group = {
                targets: [],
                fullPipes: [pipe]
            };
        while (connectedCount--) {
            connectedIndex = connectedIndexes[connectedCount];
            connectedGroup = that.getGroupForPipe(connectedIndex, otherVertex, true);
            if (connectedGroup.targets) {
                group.targets = group.targets.concat(connectedGroup.targets);
            }
            if (connectedGroup.fullPipes) {
                group.fullPipes = group.fullPipes.concat(connectedGroup.fullPipes);
            }
        }

        group.targets = group.targets.map(function(target) {
            target.highestVertex = that.highestVertex;
            return target;
        });

        return group;
    };

    that.getForVertex = function(pipe, vertex) {
        var pipes = that.metrics.getVertexPipes(pipe, vertex);

        var pipeCount = pipes.length,
            pipeIndex,
            group,
            targets = [];
        while(pipeCount--) {
            pipeIndex = that.pipes.indexOf(pipes[pipeCount]);
            group = that.getGroupForPipe(pipeIndex, vertex);
            if (group && group.targets) {
                targets = targets.concat(group.targets);
            }
        }

        return targets;
    };

    return that;
};