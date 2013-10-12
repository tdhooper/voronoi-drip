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
        MINIMUM_FLUID_VOLUME = 0.000001;

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

    that.getFluidVelocity = function(pipe, fluid) {
        return pipe.incline * that.gravity;
    };

    that.moveFluids = function() {
        var pipeCount = that.pipes.length,
            pipe,
            fluidCount,
            fluid,
            velocity;

        while (pipeCount--) {
            pipe = that.pipes[pipeCount];

            if ( ! pipe.fluids) {
                continue;
            }
            fluidCount = pipe.fluids.length;
            while (fluidCount--) {
                fluid = pipe.fluids[fluidCount];
                velocity = that.getFluidVelocity(pipe, fluid);
                fluid.position += velocity;
                fluid.movedBy = 0;
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

                fluid.position = 0;
                fluid.volume -= overlap;
                if (fluid.volume <= MINIMUM_FLUID_VOLUME) {
                    pipe.fluids.splice(fluidCount, 1);
                }
                pressure += overlap;
            }

            if (
                that.pointsMatch(pipe.vb, vertex)
                && fluid.volume + fluid.position > pipe.capacity
            ) {
                totalWidthFromA = fluid.volume + fluid.position;
                maxMask = Math.max(pipe.capacity, fluid.position);
                overlap = totalWidthFromA - maxMask;
                fluid.volume -= overlap;
                if (fluid.volume <= MINIMUM_FLUID_VOLUME) {
                    pipe.fluids.splice(fluidCount, 1);
                }
                pressure += overlap;
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

    that.hasCapacityAvailable = function(pipeIndex, vertex, level) {
        var pipe = that.pipes[pipeIndex],
            oppositeVertex = that.pointsMatch(pipe.va, vertex) ? pipe.vb : pipe.va,
            conectedPipesAtTheOtherEnd = that.pointsMatch(pipe.va, vertex) ? pipe.cb : pipe.ca,
            connectedPipeCount,
            connectedPipeIndex,
            level = level || 0;

        if ( ! pipe.fluids || pipe.fluids.length == 0) {
            return true;
        }

        if (pipe.fluids[0].volume < pipe.capacity) {
            return true;
        };

        if (level++ > 10) {
            return false;
        }

        if (conectedPipesAtTheOtherEnd && conectedPipesAtTheOtherEnd.length > 0) {
            connectedPipeCount = conectedPipesAtTheOtherEnd.length;
            while (connectedPipeCount--) {
                connectedPipeIndex = conectedPipesAtTheOtherEnd[connectedPipeCount];
                if (that.hasCapacityAvailable(connectedPipeIndex, oppositeVertex, level)) {
                    return true;
                }
            }
            return false;
        }
    };

    that.equalisePressuresForPipesAtVertex = function(pipeIndexes, vertex) {
        var pipeCount = pipeIndexes.length,
            totalPressure = 0;

        while (pipeCount--) {
            pipe = that.pipes[pipeIndexes[pipeCount]];
            totalPressure += that.removePressureInPipeAtVertex(pipe, vertex);
        }

        var targetPipes = that.getPipesToDistributePressureInto(pipeIndexes, vertex),
            targetPipe = targetPipes[0];

        that.addFluid(targetPipe.pipe, targetPipe.vertex, totalPressure);
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

    that.equalisePressures = function() {
        var vertices = {},
            pipeCount = that.pipes.length,
            pipe;

        var processPipeAndVertex = function(pipeIndex, vertex) {
            var pipes,
                pipe = that.pipes[pipeIndex],
                connectedPipes,
                connectedPipeCount;

            vertices[vertex.x] = vertices.hasOwnProperty(vertex.x) ? vertices[vertex.x] : {};
            if ( ! vertices[vertex.x].hasOwnProperty(vertex.y)) {
                vertices[vertex.x][vertex.y] = true;

                pipes = that.getConnectedPipeIndexes(pipeIndex, vertex);
                pipes.push(pipeIndex);
                that.equalisePressuresForPipesAtVertex(pipes, vertex)
            }
        }

        while (pipeCount--) {
            pipe = that.pipes[pipeCount];
            processPipeAndVertex(pipeCount, pipe.va);
            processPipeAndVertex(pipeCount, pipe.vb);
        }
    };

    that.getFluidAtVertex = function(pipe, vertex) {
        var fluidCount = pipe.fluids ? pipe.fluids.length : 0,
            fluid;

        while (fluidCount--) {
            fluid = pipe.fluids[fluidCount];

            if (
                that.pointsMatch(pipe.va, vertex)
                && fluid.position <= 0
            ) {
                return fluid;
            }

            if (
                that.pointsMatch(pipe.vb, vertex)
                && fluid.volume + fluid.position >= pipe.capacity
            ) {
                return fluid;
            }
        }
    };

    that.getResistance = function(pipe, vertex) {
        return that.pointsMatch(pipe.va, vertex) ? pipe.ra : pipe.rb;
    };

    that.getFluidLevel = function(pipe, vertex) {
        var fluid = that.getFluidAtVertex(pipe, vertex),
            vertexA = that.pointsMatch(pipe.va, vertex) ? pipe.va : pipe.vb,
            vertexB = that.pointsMatch(pipe.va, vertex) ? pipe.vb : pipe.va,
            pipeHeight = vertexA.y - vertexB.y,
            fluidHeight = fluid ? (fluid.volume / pipe.capacity) * pipeHeight : 0;

        return (vertexA.y * -1) + fluidHeight;
    };

    that.getAvaliableConnectedPipesWithLowestFluidLevel = function(pipeIndex, vertex) {
        var pipe = that.pipes[pipeIndex],
            otherVertex = that.pointsMatch(pipe.va, vertex) ? pipe.vb : pipe.va,
            fluid = that.getFluidAtVertex(pipe, otherVertex),
            connectedIndexes = that.getConnectedPipeIndexes(pipeIndex, otherVertex),
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

        var lowestFluidResultCount = lowestFluidResults.length,
            level,
            lowestLevel = null,
            lowestResults;
        while (lowestFluidResultCount--) {
            result = lowestFluidResults[lowestFluidResultCount];
            level = that.getFluidLevel(result.pipe, result.vertex);
            if (lowestLevel == null || level < lowestLevel) {
                lowestLevel = level;
                lowestResults = [result];
            } else {
                lowestResults.push(result);
            }
        }

        var lowestResult = lowestResults[0];

        var lowestResultCount = lowestResults.length,
            result,
            resistance,
            lowestResistance = null,
            lastResult;
        while (lowestResultCount--) {
            result = lowestResults[lowestResultCount];
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
                        lowestResult = result;
                    } else {
                        lowestResult = lastResult;
                    }
                } else if (resistance < lowestResistance) {
                    lowestResult = result;
                }
            }
            lastResult = result;
        }

        return [lowestResult];
    }

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
            results = resultsWithoutFluid;
        } else {
            var pipeCount = pipeIndexes.length,
                availableResults = [];
            while(pipeCount--) {
                availableResults = availableResults.concat(that.getAvaliableConnectedPipesWithLowestFluidLevel(pipeIndexes[pipeCount], vertex));
            }
            var resultCount = availableResults.length,
                fluidLevel,
                lowestLevel = null,
                results;
            while(resultCount--) {
                result = availableResults[resultCount];
                fluidLevel = that.getFluidLevel(result.pipe, result.vertex);
                if (lowestLevel == null || fluidLevel < lowestLevel) {
                    lowestLevel = fluidLevel;
                    results = [result];
                } else if (fluidLevel == lowestLevel) {
                    results.push(result);
                }
            }
        }

        results = results.sort(resistanceLowToHigh);
        return [results[0]];
    };

    that.start = function() {
        that.setMetrics();
    };

    that.update = function() {
        that.moveFluids();
        that.equalisePressures();
    };

    return that;
};