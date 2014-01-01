define(function() {

    var OverlapSolver = {};

    OverlapSolver.create = function(spec) {
        var that = {};

        that.pipes = spec.pipes;
        that.metrics = spec.metrics;

        that.getOverlap = function(fluidA, fluidB) {
            var startA = fluidA.position,
                startB = fluidB.position,
                endA = fluidA.volume + fluidA.position,
                endB = fluidB.volume + fluidB.position,
                latestStart = Math.max(startA, startB),
                earliestEnd = Math.min(endA, endB);
            return earliestEnd - latestStart;
        };

        that.solve = function(pipe) {

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
                    if (overlap > that.metrics.MINIMUM_FLUID_VOLUME * -1) {
                        movement = 0;
                        fluidA.movedBy = fluidA.movedBy || 0;
                        fluidB.movedBy = fluidA.movedBy || 0;
                        if (fluidA.movedBy && fluidB.movedBy) {
                            movementTotal = Math.abs(fluidA.movedBy) + Math.abs(fluidB.movedBy);
                            movementA = fluidA.movedBy / movementTotal;
                            movementB = fluidB.movedBy / movementTotal;
                            movement = overlap * (movementA + movementB);
                        }
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
                that.solve(pipe);
            } else {
                fluidCountA = pipe.fluids.length;
                while (fluidCountA--) {
                    fluid = pipe.fluids[fluidCountA];
                    delete fluid.movedBy;
                }
            }
        };

        return that;
    };

    return OverlapSolver;
});