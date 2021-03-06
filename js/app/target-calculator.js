define(function() {

    var TargetCalculator = {};

    TargetCalculator.create = function(spec) {
        var that = {};

        that.pipes = spec.pipes;
        that.metrics = spec.metrics;
        that.cache = [];

        that.getGroupForPipe = function(pipe, entryVertex, isRecursive) {
            if ( ! isRecursive) {
                that.highestVertex = entryVertex;
                that.connectedPipesChecked = [];
            }
            if (that.connectedPipesChecked.indexOf(pipe) !== -1) {
                return false;
            }
            that.connectedPipesChecked.push(pipe);

            var hasCapacity = that.metrics.hasCapacity(pipe);

            if (hasCapacity) {
                return {
                    targets: [{
                        pipe: pipe,
                        vertex: entryVertex,
                        highestVertex: that.highestVertex
                    }],
                    fullPipes: []
                };
            }

            var convertToTarget = function(vertex) {
                return function(pipe) {
                    return {
                        pipe: pipe,
                        vertex: vertex
                    };
                };
            };

            var notYetChecked = function(connectedTarget) {
                return that.connectedPipesChecked.indexOf(connectedTarget.pipe) == -1;
            }

            var otherVertex = that.metrics.pointsMatch(pipe.va, entryVertex) ? pipe.vb : pipe.va,
                connectedTargetsOther = that.metrics.getConnectedPipes(pipe, otherVertex).map(convertToTarget(otherVertex)),
                connectedTargetsEntry = that.metrics.getConnectedPipes(pipe, entryVertex).map(convertToTarget(entryVertex)),
                connectedTargets = connectedTargetsOther.concat(connectedTargetsEntry).filter(notYetChecked),
                connectedCount = connectedTargets.length;

            if (that.metrics.getVertexLevel(otherVertex) < that.metrics.getVertexLevel(that.highestVertex)) {
                that.highestVertex = otherVertex;
            }

            var group = {
                targets: [],
                fullPipes: [pipe]
            };

            if ( ! connectedCount) {
                return group;
            }

            var connectedTarget,
                connectedGroup;
            while (connectedCount--) {
                connectedTarget = connectedTargets[connectedCount];
                connectedGroup = that.getGroupForPipe(connectedTarget.pipe, connectedTarget.vertex, true);
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
                        && that.metrics.pointsMatch(target.vertex, uniqueTarget.vertex)
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
            var vertexPipes = that.metrics.getVertexPipes(pipe, vertex),
                pipeCount = vertexPipes.length,
                cachedGroup;
            while(pipeCount--) {
                pipe = vertexPipes[pipeCount];
                cachedGroup = that.getCachedGroupContainingFullPipe(pipe);
                if (cachedGroup) {
                    return cachedGroup.targets;
                }
            }

            pipeCount = vertexPipes.length;
            var group = {
                    targets: [],
                    fullPipes: []
                },
                pipeGroup;
            while(pipeCount--) {
                pipe = vertexPipes[pipeCount];
                pipeGroup = that.getGroupForPipe(pipe, vertex);
                group = that.mergeGroups(group, pipeGroup);
            }

            if (group.fullPipes.length) {
                that.cacheGroup(group);
            }

            return group.targets;
        };

        that.getCachedGroupsContainingTargetPipe = function(pipe) {
            var cacheCount = that.cache.length,
                targetCount,
                group,
                groups = [],
                target;
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
            var groups = that.getCachedGroupsContainingTargetPipe(pipe),
                targetCount,
                target,
                mergedGroup;

            if ( ! groups) {
                return;
            }

            if (groups.length == 2) {
                mergedGroup = that.mergeGroups(groups[0], groups[1]);
                targetCount = mergedGroup.targets.length;
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
                targetCount = groups[0].targets.length;
                while (targetCount--) {
                    target = groups[0].targets[targetCount];
                    if (target.pipe == pipe) {
                        groups[0].targets.splice(targetCount, 1);
                        break;
                    }
                }
                var pipeGroup = that.getGroupForPipe(target.pipe, target.vertex);
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

    return TargetCalculator;
});