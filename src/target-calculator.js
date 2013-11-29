var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.FluidNetworkSimulation = VoronoiDrip.FluidNetworkSimulation || {};
VoronoiDrip.FluidNetworkSimulation.TargetCalculator = VoronoiDrip.FluidNetworkSimulation.TargetCalculator || {};

VoronoiDrip.FluidNetworkSimulation.TargetCalculator.create = function(spec) {
    var that = {};

    that.pipes = spec.pipes;
    that.metrics = spec.metrics;
    that.cache = [];

    that.getTargetHash = function(pipeIndex, vertex) {
        return pipeIndex + ':' + vertex.x + ':' + vertex.y;
    };

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
                }],
                fullPipes: []
            };
        }

        if (otherVertex.y < that.highestVertex.y) {
            that.highestVertex = otherVertex;
        }

        var group = {
            targets: [],
            fullPipes: [pipe]
        };

        if ( ! connectedCount) {
            return group;
        }

        var connectedIndex,
            connectedGroup;
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

    that.cacheGroup = function(group) {
        that.cache.push(group);
    };

    that.uncacheGroup = function(group) {
        that.cache.splice(that.cache.indexOf(group), 1);
    };

    that.getCachedGroupContainingFullPipe = function(pipe) {
        var cacheCount = that.cache.length,
            group;
        while (cacheCount--) {
            group = that.cache[cacheCount];
            if (group.fullPipes.indexOf(pipe) !== -1) {
                return group;
            }
        }
    };

    that.mergeGroups = function(groupA, groupB) {
        var targets = groupA.targets.concat(groupB.targets),
            fullPipes = groupA.fullPipes.concat(groupB.fullPipes);

        var uniqueTargets = [],
            uniqueFullPipes = [];

        var match;
        targets.forEach(function(target) {
            match = false;
            uniqueTargets.forEach(function(uniqueTarget) {
                if (
                    target.pipe == uniqueTarget.pipe
                    && target.vertex == uniqueTarget.vertex
                ) {
                    match = true;
                }
            });
            if ( ! match) {
                uniqueTargets.push(target);
            }
        });

        fullPipes.forEach(function(pipe) {
            if (uniqueFullPipes.indexOf(pipe) == -1) {
                uniqueFullPipes.push(pipe);
            }
        });

        return {
            targets: uniqueTargets,
            fullPipes: uniqueFullPipes
        };
    };

    that.getForVertex = function(pipe, vertex) {
        var cachedGroup = that.getCachedGroupContainingFullPipe(pipe);
        if (cachedGroup) {
            return cachedGroup.targets;
        }

        var pipes = that.metrics.getVertexPipes(pipe, vertex);

        var pipeCount = pipes.length,
            pipeIndex,
            group = {
                targets: [],
                fullPipes: []
            },
            pipeGroup,
            targets = [];
        while(pipeCount--) {
            pipeIndex = that.pipes.indexOf(pipes[pipeCount]);
            pipeGroup = that.getGroupForPipe(pipeIndex, vertex);
            group = that.mergeGroups(group, pipeGroup);
        }

        that.cacheGroup(group);

        return group.targets;
    };

    that.getCachedGroupsContainingTargetPipe = function(pipe) {
        var cacheCount = that.cache.length,
            targetCount,
            group,
            groups = [];
        while (cacheCount--) {
            group = that.cache[cacheCount];
            targetCount = group.targets.length;
            while (targetCount--) {
                target = group.targets[targetCount];
                if (target.pipe == pipe) {
                    groups.push(group);
                    continue;
                }
            }
        }

        if (groups.length) {
            return groups;
        }
    };

    that.pipeFull = function(pipe) {
        var groups = that.getCachedGroupsContainingTargetPipe(pipe);

        if ( ! groups) {
            return;
        }

        if (groups.length == 2) {
            var mergedGroup = that.mergeGroups(groups[0], groups[1]),
                targetCount = mergedGroup.targets.length,
                target;
            // Count backwards so we can remove items as we go
            while (targetCount--) {
                target = mergedGroup.targets[targetCount];
                if (target.pipe == pipe) {
                    mergedGroup.targets.splice(targetCount, 1);
                }
            }
            mergedGroup.fullPipes.push(pipe);
            that.cacheGroup(mergedGroup);
            that.uncacheGroup(groups[0]);
            that.uncacheGroup(groups[1]);
        }

        if (groups.length == 1) {
            var targetCount = groups[0].targets.length,
                target;
            while (targetCount--) {
                target = groups[0].targets[targetCount];
                if (target.pipe == pipe) {
                    groups[0].targets.splice(targetCount, 1);
                    break;
                }
            }
            var pipeGroup = that.getGroupForPipe(target.pipe, target.vertex),
                mergedGroup = that.mergeGroups(groups[0], pipeGroup);
            that.cacheGroup(mergedGroup);
            that.uncacheGroup(groups[0]);
        }
    };

    that.pipeEmpty = function(pipe) {
        var group = that.getCachedGroupContainingFullPipe(pipe);
        if (group) {
            that.uncacheGroup(group);
        }
    };

    return that;
};