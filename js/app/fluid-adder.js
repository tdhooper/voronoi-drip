define(function() {

    var FluidAdder = {};

    FluidAdder.create = function(spec) {
        var that = {};

        that.metrics = spec.metrics;
        that.overlapSolver = spec.overlapSolver;
        that.targetCalculator = spec.targetCalculator;

        that.add = function(pipe, point, volume) {
            if (volume < spec.MINIMUM_FLUID_VOLUME) {
                return;
            }

            var fluids = pipe.fluids = pipe.fluids || [];

            fluids.push({
                volume: volume,
                position: that.metrics.pointsMatch(point, pipe.va) ? 0 : pipe.capacity - volume,
                movedBy: that.metrics.pointsMatch(point, pipe.va) ? volume : volume * -1
            });

            that.overlapSolver.solve(pipe);

            if ( ! that.metrics.hasCapacity(pipe)) {
                that.targetCalculator.pipeFull(pipe);
            }
        };

        return that;
    };

    return FluidAdder;
});