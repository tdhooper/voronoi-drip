var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.FluidNetworkSimulation = VoronoiDrip.FluidNetworkSimulation || {};
VoronoiDrip.FluidNetworkSimulation.FluidMover = VoronoiDrip.FluidNetworkSimulation.FluidMover || {};

VoronoiDrip.FluidNetworkSimulation.FluidMover.create = function(spec) {
    var that = {};

    that.pipes = spec.pipes;
    that.metrics = spec.metrics;
    that.pressureSolver = spec.pressureSolver;
    that.targetCalculator = spec.targetCalculator;

    that.update = function() {
        var pipeCount = that.pipes.length,
            pipe,
            velocity,
            fluidCount,
            fluid;

        while (pipeCount--) {
            pipe = that.pipes[pipeCount];
            velocity = that.metrics.getFluidVelocity(pipe);
            fluidCount = pipe.fluids ? pipe.fluids.length : 0;

            if ( ! velocity || ! fluidCount) {
                continue;
            }

            while (fluidCount--) {
                fluid = pipe.fluids[fluidCount];
                fluid.position += velocity;
            }

            that.targetCalculator.pipeEmpty(pipe);

            if (velocity < 0) {
                // Fluid moved towards vertex A
                that.pressureSolver.solve(pipe, pipe.va);
            } else {
                // Fluid moved towards vertex B
                that.pressureSolver.solve(pipe, pipe.vb);
            }
        }
    };

    return that;
};