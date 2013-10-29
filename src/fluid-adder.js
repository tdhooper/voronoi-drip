var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.FluidNetworkSimulation = VoronoiDrip.FluidNetworkSimulation || {};
VoronoiDrip.FluidNetworkSimulation.FluidAdder = VoronoiDrip.FluidNetworkSimulation.FluidAdder || {};

VoronoiDrip.FluidNetworkSimulation.FluidAdder.create = function(spec) {
    var that = {};

    that.metrics = spec.metrics;
    that.overlapSolver = spec.overlapSolver;

    that.add = function(pipe, point, volume) {
        if (volume < VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME) {
            return;
        }

        var fluids = pipe.fluids = pipe.fluids || [];

        fluids.push({
            volume: volume,
            position: that.metrics.pointsMatch(point, pipe.va) ? 0 : pipe.capacity - volume,
            movedBy: that.metrics.pointsMatch(point, pipe.va) ? volume : volume * -1
        });

        that.overlapSolver.solve(pipe);
    };

    return that;
};