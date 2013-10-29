var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.FluidNetworkSimulation = VoronoiDrip.FluidNetworkSimulation || {};
VoronoiDrip.FluidNetworkSimulation.PressureSolver = VoronoiDrip.FluidNetworkSimulation.PressureSolver || {};

VoronoiDrip.FluidNetworkSimulation.PressureSolver.create = function(spec) {
    var that = {};

    that.pipes = spec.pipes;
    that.metrics = spec.metrics;
    that.fluidAdder = spec.fluidAdder;

    that.connectedPipesChecked = [];

    that.getAvaliableConnectedPipesWithLowestFluidLevel = function(pipeIndex, vertex) {
        var targetHash = pipeIndex + ':' + vertex.x + ':' + vertex.y;
        if (that.connectedPipesChecked.indexOf(targetHash) !== -1) {
            return false;
        }
        that.connectedPipesChecked.push(targetHash);

        var pipe = that.pipes[pipeIndex],
            otherVertex = that.metrics.pointsMatch(pipe.va, vertex) ? pipe.vb : pipe.va,
            fluid = that.metrics.getFluidAtVertex(pipe, otherVertex),
            connectedIndexes = that.metrics.getConnectedPipeIndexes(pipeIndex, otherVertex),
            connectedCount = connectedIndexes.length;

        if ( ! connectedCount && fluid && fluid.volume >= pipe.capacity) {
            return false;
        }

        if ( ! fluid || ! connectedCount) {
            return [{
                pipe: pipe,
                vertex: vertex
            }];
        }

        var connectedIndex,
            connectedPipe,
            results,
            lowestFluidResults = [];
        while (connectedCount--) {
            connectedIndex = connectedIndexes[connectedCount];
            results = that.getAvaliableConnectedPipesWithLowestFluidLevel(connectedIndex, otherVertex);
            if (results) {
                lowestFluidResults = lowestFluidResults.concat(results);
            }
        }

        var lowestResultCount = lowestFluidResults.length,
            result,
            resistance,
            lowestResistance = null,
            lowestResistanceResult,
            lastResult;
        while (lowestResultCount--) {
            result = lowestFluidResults[lowestResultCount];
            fluid = that.metrics.getFluidAtVertex(result.pipe, result.vertex);
            if (
                lastResult
                && ! fluid
                && that.metrics.pointsMatch(result.vertex, lastResult.vertex)
            ) {
                resistance = that.metrics.getResistance(result.pipe, result.vertex);
                if (lowestResistance == null) {
                    lastResistance = that.metrics.getResistance(lastResult.pipe, lastResult.vertex);
                    if (resistance < lastResistance) {
                        lowestResistanceResult = result;
                    } else {
                        lowestResistanceResult = lastResult;
                    }
                } else if (resistance < lowestResistance) {
                    lowestResistanceResult = result;
                }
            }
            lastResult = result;
        }

        if (lowestResistanceResult) {
            return [lowestResistanceResult];
        }

        return lowestFluidResults;
    };

    that.getPipesToDistributePressureInto = function(pipeIndexes, vertex) {
        var results = pipeIndexes.map(function(pipeIndex) {
            return {
                pipe: that.pipes[pipeIndex],
                vertex: vertex
            };
        });

        var excludePipesWithFluidAtVertex = function(result) {
            var fluid = that.metrics.getFluidAtVertex(result.pipe, result.vertex);
            return ! fluid;
        };

        var resistanceLowToHigh = function(resultA, resultB) {
            var resistanceA = that.metrics.getResistance(resultA.pipe, resultA.vertex),
                resistanceB = that.metrics.getResistance(resultB.pipe, resultB.vertex);
            return resistanceA - resistanceB;
        };

        resultsWithoutFluid = results.filter(excludePipesWithFluidAtVertex);

        if (resultsWithoutFluid.length) {
            resultsWithoutFluid = resultsWithoutFluid.sort(resistanceLowToHigh);
            return [resultsWithoutFluid[0]];
        } else {
            var pipeCount = pipeIndexes.length,
                results = [];
            that.pipeCount = pipeCount;
            while(pipeCount--) {

                that.connectedPipesChecked = [];
                var availablePipes = that.getAvaliableConnectedPipesWithLowestFluidLevel(pipeIndexes[pipeCount], vertex);
                if (availablePipes) {
                    results = results.concat(availablePipes);
                }
            }
        }

        return results;
    };

    that.getPipesToDistributePressureIntoX = function(pipes, vertex) {
        var pipeIndexes = pipes.map(function(pipe) {
            return that.pipes.indexOf(pipe);
        });
        return that.getPipesToDistributePressureInto(pipeIndexes, vertex);
    };

    that.getVolumeNeededToReachLevel = function(pipe, vertex, level) {
        var targetLevel = that.metrics.getFluidLevel(pipe, vertex),
            heightFromVertex = that.metrics.pointsMatch(pipe.va, vertex) ? pipe.vb.y - pipe.va.y : pipe.va.y - pipe.vb.y;

        if (heightFromVertex == 0) {
            return false;
        }

        var heightToCapicity = pipe.capacity / heightFromVertex;
        return (level - targetLevel) * heightToCapicity;
    };

    that.redistributePressure = function(pipes, vertex, pressure) {
        var targets = that.getPipesToDistributePressureIntoX(pipes, vertex),
            availablePressure = pressure;

        if (targets.length == 1) {
            var targetPipe = targets[0];
            that.fluidAdder.add(targetPipe.pipe, targetPipe.vertex, pressure);
            return;
        }

        var addFluidLevels = function(target) {
            target.level = that.metrics.getFluidLevel(target.pipe, target.vertex);
            return target;
        };

        var fluidLevelLowToHigh = function(targetA, targetB) {
            return targetB.level - targetA.level;
        };

        var targets = targets.map(addFluidLevels);
            targets = targets.sort(fluidLevelLowToHigh);
            sameLevelTargets = [],
            nextHighestLevel = null,
            targetCount = 0;

        while (targetCount < targets.length) {
            var target = targets[targetCount];
            previousLevel = target.level;

            if (targetCount > 0) {
                var previousTarget = targets[targetCount - 1];
                previousLevel = previousTarget.level;
            }

            if (previousLevel == target.level) {
                sameLevelTargets.push(target);
            } else {
                nextHighestLevel = target.level;
            }

            targetCount += 1;
        }

        var targetCount = sameLevelTargets.length,
            totalVolume = 0,
            minCapacityScale = null;
            otherVertex = that.metrics.pointsMatch(sameLevelTargets[0].vertex, sameLevelTargets[0].pipe.va) ? sameLevelTargets[0].pipe.vb : sameLevelTargets[0].pipe.va,
            direction = (otherVertex.y - sameLevelTargets[0].vertex.y) > 0 ? 1 : -1,
            highestPossibleLevel = sameLevelTargets[0].level + (pressure * direction);
            highestPossibleLevel = nextHighestLevel !== null ? nextHighestLevel : highestPossibleLevel;

        while (targetCount--) {
            var target = sameLevelTargets[targetCount],
                volumeNeededToReachLevel = that.getVolumeNeededToReachLevel(target.pipe, target.vertex, highestPossibleLevel);
            target.volumeToAdd = volumeNeededToReachLevel !== false && volumeNeededToReachLevel > 0 ? volumeNeededToReachLevel : target.pipe.capacity;
            totalVolume += target.volumeToAdd;

            var availableCapacity = that.metrics.getAvailableCapacity(target.pipe);
            if (availableCapacity < target.volumeToAdd) {
                var capacityScale = availableCapacity / target.volumeToAdd;
                if (minCapacityScale == null) {
                    minCapacityScale = capacityScale;
                } else {
                    minCapacityScale = Math.min(minCapacityScale, capacityScale);
                }
            }
        }

        var volumeToAdd = Math.min(totalVolume, pressure),
            pressureScale = volumeToAdd / totalVolume,
            scale = minCapacityScale !== null ? Math.min(minCapacityScale, pressureScale) : pressureScale,
            targetCount = sameLevelTargets.length;

        while (targetCount--) {
            var target = sameLevelTargets[targetCount];
            target.volumeToAdd *= scale;

            if (target.volumeToAdd > VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME) {
                that.fluidAdder.add(target.pipe, target.vertex, target.volumeToAdd);
                pressure -= target.volumeToAdd;
            }
        }

        if (pressure > VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME && pressure !== availablePressure) {
            that.redistributePressure(pipes, vertex, pressure);
        }
    };

    that.removePressureInPipeAtVertex = function(pipe, vertex) {
        var fluidCount = pipe.fluids ? pipe.fluids.length : 0,
            fluid,
            overlap,
            pressure = 0,
            totalWidthFromB,
            totalWidthFromA,
            maxMask;

        while (fluidCount--) {
            fluid = pipe.fluids[fluidCount];

            if (
                that.metrics.pointsMatch(pipe.va, vertex)
                && fluid.position < 0
            ) {
                totalWidthFromB = pipe.capacity - fluid.position;
                maxMask = Math.max(pipe.capacity, pipe.capacity - (fluid.volume + fluid.position));
                overlap = totalWidthFromB - maxMask;

                if (overlap > VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME) {
                    fluid.position = 0;
                    fluid.volume -= overlap;
                    if (fluid.volume <= VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME) {
                        pipe.fluids.splice(fluidCount, 1);
                    }
                    pressure += overlap;
                }
            }

            if (
                that.metrics.pointsMatch(pipe.vb, vertex)
                && fluid.volume + fluid.position > pipe.capacity
            ) {
                totalWidthFromA = fluid.volume + fluid.position;
                maxMask = Math.max(pipe.capacity, fluid.position);
                overlap = totalWidthFromA - maxMask;

                if (overlap > VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME) {
                    fluid.volume -= overlap;
                    if (fluid.volume <= VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME) {
                        pipe.fluids.splice(fluidCount, 1);
                    }
                    pressure += overlap;
                }
            }
        }

        return pressure;
    };

    that.solve = function(pipe, vertex) {
        var pipes = that.metrics.getConnectedPipes(pipe, vertex);
        pipes.push(pipe);
        var pressure = that.removePressureInPipeAtVertex(pipe, vertex);
        if (pressure) {
            that.redistributePressure(pipes, vertex, pressure);
        }
    };

    return that;
};