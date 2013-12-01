var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.FluidNetworkSimulation = VoronoiDrip.FluidNetworkSimulation || {};
VoronoiDrip.FluidNetworkSimulation.FluidMover = VoronoiDrip.FluidNetworkSimulation.FluidMover || {};

VoronoiDrip.FluidNetworkSimulation.FluidMover.create = function(spec) {
    var that = {};

    that.pipes = spec.pipes;
    that.metrics = spec.metrics;
    that.pressureSolver = spec.pressureSolver;
    that.targetCalculator = spec.targetCalculator;

    that.hasValidTarget = function(pipe, vertex) {
        var group = that.targetCalculator.getCachedGroupContainingFullPipe(pipe);
        if (group) {
            var level = that.metrics.getFluidLevel(pipe, vertex),
                targetCount = group.targets.length,
                target,
                targetLevel;
            while (targetCount--) {
                target = group.targets[targetCount];
                targetLevel = that.metrics.getFluidLevel(target.pipe, target.vertex);
                if (targetLevel > level) {
                    return true;
                }
            }
            return false;
        }
        return true;
    };

    that.moveFluidsInPipe = function(pipe, velocity) {
        var fluidCount = pipe.fluids.length,
            fluid;
        while (fluidCount--) {
            fluid = pipe.fluids[fluidCount];
            fluid.position += velocity;
        }
        that.targetCalculator.pipeEmpty(pipe);
        var towardsVertex = velocity > 0 ? pipe.vb : pipe.va;
        that.pressureSolver.solve(pipe, towardsVertex);
    };

    that.update = function() {
        var pipeCount = that.pipes.length,
            pipe,
            fluidCount,
            velocity,
            hasCapacity,
            towardsVertex,
            hasValidTarget;

        while (pipeCount--) {
            pipe = that.pipes[pipeCount];

            fluidCount = pipe.fluids ? pipe.fluids.length : 0;
            if ( ! fluidCount) {
                continue;
            }

            velocity = that.metrics.getFluidVelocity(pipe);
            if ( ! velocity) {
                continue;
            }

            hasCapacity = that.metrics.hasCapacity(pipe);
            if ( ! hasCapacity) {
                towardsVertex = velocity > 0 ? pipe.vb : pipe.va;
                hasValidTarget = that.hasValidTarget(pipe, towardsVertex);
                if ( ! hasValidTarget) {
                    continue;
                }
            }

            that.moveFluidsInPipe(pipe, velocity);
        }
    };

    return that;
};