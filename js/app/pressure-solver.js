define(function() {

    var PressureSolver = {};

    PressureSolver.create = function(spec) {
        var that = {};

        that.pipes = spec.pipes;
        that.metrics = spec.metrics;
        that.fluidAdder = spec.fluidAdder;
        that.targetCalculator = spec.targetCalculator;

        that.getVolumeNeededToReachLevel = function(pipe, vertex, level) {
            var targetLevel = that.metrics.getFluidLevel(pipe, vertex),
                heightFromVertex = that.metrics.pointsMatch(pipe.va, vertex) ? pipe.vb.y - pipe.va.y : pipe.va.y - pipe.vb.y;

            if (heightFromVertex == 0) {
                return false;
            }

            var heightToCapicity = pipe.capacity / heightFromVertex;
            return (level - targetLevel) * heightToCapicity;
        };

        that.distributePressureBetweenTargets = function(targets, pressure, nextHighestLevel) {
            var targetCount = targets.length,
                totalVolume = 0,
                minCapacityScale = null;
                otherVertex = that.metrics.pointsMatch(targets[0].vertex, targets[0].pipe.va) ? targets[0].pipe.vb : targets[0].pipe.va,
                direction = (otherVertex.y - targets[0].vertex.y) > 0 ? 1 : -1,
                highestPossibleLevel = targets[0].level + (pressure * direction);
                highestPossibleLevel = nextHighestLevel !== null ? nextHighestLevel : highestPossibleLevel;

            while (targetCount--) {
                var target = targets[targetCount],
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
                targetCount = targets.length;

            while (targetCount--) {
                var target = targets[targetCount];
                target.volumeToAdd *= scale;

                if (target.volumeToAdd > spec.MINIMUM_FLUID_VOLUME) {
                    that.fluidAdder.add(target.pipe, target.vertex, target.volumeToAdd);
                    pressure -= target.volumeToAdd;
                }
            }

            return pressure;
        };

        that.addFluidLevel = function(target) {
            var level = that.metrics.getFluidLevel(target.pipe, target.vertex);
            target.level = Math.min(level, target.highestVertex.y);
            return target;
        };

        that.fluidLevelLowToHigh = function(targetA, targetB) {
            return targetB.level - targetA.level;
        };

        that.findLowestLevelTargets = function(targets) {
            var targets = targets.map(that.addFluidLevel),
                targets = targets.sort(that.fluidLevelLowToHigh),
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

                if (previousLevel - target.level < spec.MINIMUM_FLUID_VOLUME) {
                    sameLevelTargets.push(target);
                } else {
                    nextHighestLevel = target.level;
                    break;
                }

                targetCount += 1;
            }

            return {
                targets: sameLevelTargets,
                nextHighestLevel: nextHighestLevel
            };
        };

        that.downwardPointing = function(target) {
            var otherVertex = that.metrics.pointsMatch(target.pipe.va, target.vertex) ? target.pipe.vb : target.pipe.va;
            if (otherVertex.y < target.vertex.y) {
                return false;
            }
            return true;
        };

        that.resistanceLowToHigh = function(targetA, targetB) {
            var resistanceA = that.metrics.getResistance(targetA.pipe, targetA.vertex),
                resistanceB = that.metrics.getResistance(targetB.pipe, targetB.vertex);
            return resistanceA > resistanceB;
        };

        that.findDownwardPointingTarget = function(targets) {
            var downwardPointingTargets = targets.filter(that.downwardPointing);
            if ( ! downwardPointingTargets.length) {
                return false;
            }
            downwardPointingTargets.sort(that.resistanceLowToHigh);
            return downwardPointingTargets[0];
        };

        that.getDistributionTargets = function(pipe, vertex) {
            var targets = that.targetCalculator.getForVertex(pipe, vertex),
                result = that.findLowestLevelTargets(targets),
                downwardPointingTarget = that.findDownwardPointingTarget(result.targets);
            if (downwardPointingTarget) {
                result.targets = [downwardPointingTarget];
            }
            return result;
        };

        that.redistributePressure = function(pipe, vertex, pressure) {
            var availablePressure = pressure,
                distribute = that.getDistributionTargets(pipe, vertex),
                targets = distribute.targets,
                nextHighestLevel = distribute.nextHighestLevel;

            var remainingPressure = that.distributePressureBetweenTargets(targets, pressure, nextHighestLevel);
            if (
                remainingPressure > spec.MINIMUM_FLUID_VOLUME
                && remainingPressure !== availablePressure
            ) {
                return that.redistributePressure(pipe, vertex, remainingPressure);
            }

            return remainingPressure;
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

                    if (overlap > spec.MINIMUM_FLUID_VOLUME) {
                        fluid.position = 0;
                        fluid.volume -= overlap;
                        if (fluid.volume <= spec.MINIMUM_FLUID_VOLUME) {
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

                    if (overlap > spec.MINIMUM_FLUID_VOLUME) {
                        fluid.volume -= overlap;
                        if (fluid.volume <= spec.MINIMUM_FLUID_VOLUME) {
                            pipe.fluids.splice(fluidCount, 1);
                        }
                        pressure += overlap;
                    }
                }
            }

            return pressure;
        };

        that.solve = function(pipe, vertex) {
            var pressure = that.removePressureInPipeAtVertex(pipe, vertex);
            if (pressure) {
                that.redistributePressure(pipe, vertex, pressure);
            }
        };

        return that;
    };

    return PressureSolver;
});