/*

    Given a network of pipes, simulate fluid moving through them.

    Pipe object:
        va
        vb
            vertex A, and vertex B objects, eg {x: 0, y: 10}
        ca
        cb
            array of indexes for pipes that share vertex A and vertex B respectively

    Initialise with an object containing:
        pipes
            array of Pipe objects
        gravity
            float defaults to 0.1

    Returns the an object with the methods:
        addFluid
            add a volume of fluid to any pipe
        update
            update the simulation

*/

var vd = vd || {};

vd.createFluidPipeNetwork = function(spec) {
    var that = {},
        MINIMUM_FLUID_VOLUME = 0.00001;

    that.pipes = spec.pipes;
    that.gravity = spec.hasOwnProperty('gravity') ? spec.gravity : 0.1;

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

    that.setMetrics = function() {
        var pipeCount = that.pipes.length,
            pipe,
            angle,
            resistance;

        while (pipeCount--) {
            pipe = that.pipes[pipeCount];
            angle = that.getAngle(pipe, pipe.va);
            pipe.incline = that.calculateIncline(angle);
            pipe.capacity = that.getLength(pipe);
            resistance = (pipe.incline + 1) / 2;
            pipe.ra = (1 - resistance) * that.gravity;
            pipe.rb = resistance * that.gravity;
        }
    };

    that.getFluidVelocity = function(pipe) {
        return pipe.incline * that.gravity;
    };

    that.moveFluids = function() {
        var pipeCount = that.pipes.length,
            pipe,
            velocity,
            fluidCount,
            fluid;

        while (pipeCount--) {
            pipe = that.pipes[pipeCount];
            velocity = that.getFluidVelocity(pipe);
            fluidCount = pipe.fluids ? pipe.fluids.length : 0;

            if ( ! velocity || ! fluidCount) {
                continue;
            }

            while (fluidCount--) {
                fluid = pipe.fluids[fluidCount];
                fluid.position += velocity;
                fluid.movedBy = 0;
            }

            if (velocity < 0) {
                // Fluid moved towards vertex A
                that.solvePressureForPipeAtVertex(pipe, pipe.va);
            } else {
                // Fluid moved towards vertex B
                that.solvePressureForPipeAtVertex(pipe, pipe.vb);
            }
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
                that.pointsMatch(pipe.va, vertex)
                && fluid.position < 0
            ) {
                totalWidthFromB = pipe.capacity - fluid.position;
                maxMask = Math.max(pipe.capacity, pipe.capacity - (fluid.volume + fluid.position));
                overlap = totalWidthFromB - maxMask;

                if (overlap > MINIMUM_FLUID_VOLUME) {
                    fluid.position = 0;
                    fluid.volume -= overlap;
                    if (fluid.volume <= MINIMUM_FLUID_VOLUME) {
                        pipe.fluids.splice(fluidCount, 1);
                    }
                    pressure += overlap;
                }
            }

            if (
                that.pointsMatch(pipe.vb, vertex)
                && fluid.volume + fluid.position > pipe.capacity
            ) {
                totalWidthFromA = fluid.volume + fluid.position;
                maxMask = Math.max(pipe.capacity, fluid.position);
                overlap = totalWidthFromA - maxMask;

                if (overlap > MINIMUM_FLUID_VOLUME) {
                    fluid.volume -= overlap;
                    if (fluid.volume <= MINIMUM_FLUID_VOLUME) {
                        pipe.fluids.splice(fluidCount, 1);
                    }
                    pressure += overlap;
                }
            }
        }

        return pressure;
    };

    that.getOverlap = function(fluidA, fluidB) {
        var startA = fluidA.position,
            startB = fluidB.position,
            endA = fluidA.volume + fluidA.position,
            endB = fluidB.volume + fluidB.position,
            latestStart = Math.max(startA, startB),
            earliestEnd = Math.min(endA, endB);
        return earliestEnd - latestStart;
    };

    that.solveFluidOverlaps = function(pipe) {

        var updated = false,
            fluidCountA = pipe.fluids.length,
            fluidCountB,
            fluidA,
            fluidB,
            overlap,
            movementTotal,
            movementA,
            movementB,
            movement,
            resistance,
            minPosition;

        while (fluidCountA--) {
            fluidA = pipe.fluids[fluidCountA];
            fluidCountB = pipe.fluids.length;
            while (fluidCountB--) {
                fluidB = pipe.fluids[fluidCountB];
                if (fluidB == fluidA) {
                    continue;
                }
                overlap = that.getOverlap(fluidA, fluidB);
                if (overlap > 0) {
                    fluidA.movedBy = fluidA.movedBy || 0;
                    fluidB.movedBy = fluidA.movedBy || 0;
                    movementTotal = Math.abs(fluidA.movedBy) + Math.abs(fluidB.movedBy);
                    movementA = fluidA.movedBy / movementTotal;
                    movementB = fluidB.movedBy / movementTotal;
                    movement = overlap * (movementA + movementB);
                    minPosition = Math.min(fluidA.position, fluidB.position);
                    pipe.fluids[fluidCountA] = {
                        volume: fluidA.volume + fluidB.volume,
                        position: movement > 0 ? minPosition : minPosition + movement,
                        movedBy: movement
                    }
                    pipe.fluids.splice(fluidCountB, 1);
                    updated = true;
                    break;
                }
            }
            if (updated) {
                break;
            }
        }

        if (updated == true) {
            that.solveFluidOverlaps(pipe);
        } else {
            fluidCountA = pipe.fluids.length;
            while (fluidCountA--) {
                fluid = pipe.fluids[fluidCountA];
                delete fluid.movedBy;
            }
        }
    };

    that.addFluid = function(pipe, point, volume) {
        if (volume < MINIMUM_FLUID_VOLUME) {
            return;
        }

        var fluids = pipe.fluids = pipe.fluids || [];

        fluids.push({
            volume: volume,
            position: that.pointsMatch(point, pipe.va) ? 0 : pipe.capacity - volume,
            movedBy: that.pointsMatch(point, pipe.va) ? volume : volume * -1
        });

        that.solveFluidOverlaps(pipe);
    };

    that.getFluidAtVertex = function(pipe, vertex) {
        var fluidCount = pipe.fluids ? pipe.fluids.length : 0,
            fluid;

        while (fluidCount--) {
            fluid = pipe.fluids[fluidCount];

            if (
                that.pointsMatch(pipe.va, vertex)
                && fluid.position <= MINIMUM_FLUID_VOLUME
            ) {
                return fluid;
            }

            if (
                that.pointsMatch(pipe.vb, vertex)
                && fluid.volume + fluid.position >= pipe.capacity - MINIMUM_FLUID_VOLUME
            ) {
                return fluid;
            }
        }
    };

    that.getConnectedPipes = function(pipe, vertex) {
        var pipeIndexes = that.getConnectedPipeIndexes(that.pipes.indexOf(pipe), vertex);
        var pipes = pipeIndexes.map(function(index) {
            return that.pipes[index];
        });
        return pipes;
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

    that.getFluidLevel = function(pipe, vertex) {
        var fluid = that.getFluidAtVertex(pipe, vertex),
            heightFromVertex = that.pointsMatch(pipe.va, vertex) ? pipe.vb.y - pipe.va.y : pipe.va.y - pipe.vb.y,
            fluidHeight = fluid ? (fluid.volume / pipe.capacity) * heightFromVertex : 0;
        return vertex.y + fluidHeight;
    };

    that.getResistance = function(pipe, vertex) {
        return that.pointsMatch(pipe.va, vertex) ? pipe.ra : pipe.rb;
    };

    that.connectedPipesChecked = [];

    that.getAvaliableConnectedPipesWithLowestFluidLevel = function(pipeIndex, vertex) {
        var targetHash = pipeIndex + ':' + vertex.x + ':' + vertex.y;
        if (that.connectedPipesChecked.indexOf(targetHash) !== -1) {
            return false;
        }
        that.connectedPipesChecked.push(targetHash);

        var pipe = that.pipes[pipeIndex],
            otherVertex = that.pointsMatch(pipe.va, vertex) ? pipe.vb : pipe.va,
            fluid = that.getFluidAtVertex(pipe, otherVertex),
            connectedIndexes = that.getConnectedPipeIndexes(pipeIndex, otherVertex),
            connectedCount = connectedIndexes.length;

        that.connectedCount = connectedCount;

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
            fluid = that.getFluidAtVertex(result.pipe, result.vertex);
            if (
                lastResult
                && ! fluid
                && that.pointsMatch(result.vertex, lastResult.vertex)
            ) {
                resistance = that.getResistance(result.pipe, result.vertex);
                if (lowestResistance == null) {
                    lastResistance = that.getResistance(lastResult.pipe, lastResult.vertex);
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
    }

    that.getPipesToDistributePressureIntoX = function(pipes, vertex) {
        var pipeIndexes = pipes.map(function(pipe) {
            return that.pipes.indexOf(pipe);
        });
        return that.getPipesToDistributePressureInto(pipeIndexes, vertex);
    };

    that.getPipesToDistributePressureInto = function(pipeIndexes, vertex) {
        var results = pipeIndexes.map(function(pipeIndex) {
            return {
                pipe: that.pipes[pipeIndex],
                vertex: vertex
            };
        });

        var excludePipesWithFluidAtVertex = function(result) {
            var fluid = that.getFluidAtVertex(result.pipe, result.vertex);
            return ! fluid;
        };

        var resistanceLowToHigh = function(resultA, resultB) {
            var resistanceA = that.getResistance(resultA.pipe, resultA.vertex),
                resistanceB = that.getResistance(resultB.pipe, resultB.vertex);
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

    that.getAvailableCapacity = function(pipe) {
        if ( ! pipe.fluids || pipe.fluids.length == 0) {
            return pipe.capacity;
        }

        var fluidCount = pipe.fluids.length,
            fluid,
            totalVolume = 0;

        while(fluidCount--) {
            fluid = pipe.fluids[fluidCount];

            var overlapsA = fluid.position + fluid.volume > pipe.capacity;
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

    that.getVolumeNeededToReachLevel = function(pipe, vertex, level) {
        var targetLevel = that.getFluidLevel(pipe, vertex),
            heightFromVertex = that.pointsMatch(pipe.va, vertex) ? pipe.vb.y - pipe.va.y : pipe.va.y - pipe.vb.y;

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
            that.addFluid(targetPipe.pipe, targetPipe.vertex, pressure);
            return;
        }

        var addFluidLevels = function(target) {
            target.level = that.getFluidLevel(target.pipe, target.vertex);
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
            otherVertex = that.pointsMatch(sameLevelTargets[0].vertex, sameLevelTargets[0].pipe.va) ? sameLevelTargets[0].pipe.vb : sameLevelTargets[0].pipe.va,
            direction = (otherVertex.y - sameLevelTargets[0].vertex.y) > 0 ? 1 : -1,
            highestPossibleLevel = sameLevelTargets[0].level + (pressure * direction);
            highestPossibleLevel = nextHighestLevel !== null ? nextHighestLevel : highestPossibleLevel;

        while (targetCount--) {
            var target = sameLevelTargets[targetCount],
                volumeNeededToReachLevel = that.getVolumeNeededToReachLevel(target.pipe, target.vertex, highestPossibleLevel);
            target.volumeToAdd = volumeNeededToReachLevel !== false && volumeNeededToReachLevel > 0 ? volumeNeededToReachLevel : target.pipe.capacity;
            totalVolume += target.volumeToAdd;

            var availableCapacity = that.getAvailableCapacity(target.pipe);
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

            if (target.volumeToAdd > MINIMUM_FLUID_VOLUME) {
                that.addFluid(target.pipe, target.vertex, target.volumeToAdd);
                pressure -= target.volumeToAdd;
            }
        }

        if (pressure > MINIMUM_FLUID_VOLUME && pressure !== availablePressure) {
            that.redistributePressure(pipes, vertex, pressure);
        }
    };

    that.solvePressureForPipeAtVertex = function(pipe, vertex) {
        var pipes = that.getConnectedPipes(pipe, vertex);
        pipes.push(pipe);
        var pressure = that.removePressureInPipeAtVertex(pipe, vertex);
        if (pressure) {
            that.redistributePressure(pipes, vertex, pressure);
        }
    };

    that.start = function() {
        that.setMetrics();
    };

    that.update = function() {
        that.moveFluids();
    };

    return that;
};