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

define(['app/metrics', 'app/overlap-solver', 'app/target-calculator', 'app/fluid-adder', 'app/pressure-solver', 'app/fluid-mover'], function(Metrics, OverlapSolver, TargetCalculator, FluidAdder, PressureSolver, FluidMover) {

    var FluidNetworkSimulation = {};

    FluidNetworkSimulation.MINIMUM_FLUID_VOLUME = 0.00001;
    FluidNetworkSimulation.GRAVITY = 5;

    FluidNetworkSimulation.create = function(spec) {
        var that = {};

        that.pipes = spec.pipes;
        that.gravity = spec.hasOwnProperty('gravity') && spec.gravity ? spec.gravity : FluidNetworkSimulation.GRAVITY;

        that.addFluid = function(pipe, point, volume) {
            that.fluidAdder.add(pipe, point, volume);
        };

        that.start = function() {
            that.metrics = Metrics.create({
                pipes: that.pipes,
                gravity: that.gravity,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            that.metrics.start();
            that.overlapSolver = OverlapSolver.create({
                pipes: that.pipes,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            that.targetCalculator = TargetCalculator.create({
                pipes: that.pipes,
                metrics: that.metrics,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            that.fluidAdder = FluidAdder.create({
                pipes: that.pipes,
                metrics: that.metrics,
                overlapSolver: that.overlapSolver,
                targetCalculator: that.targetCalculator,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            that.pressureSolver = PressureSolver.create({
                pipes: that.pipes,
                metrics: that.metrics,
                fluidAdder: that.fluidAdder,
                targetCalculator: that.targetCalculator,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            that.fluidMover = FluidMover.create({
                pipes: that.pipes,
                metrics: that.metrics,
                pressureSolver: that.pressureSolver,
                targetCalculator: that.targetCalculator,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
        };

        that.update = function() {
            that.fluidMover.update();
        };

        return that;
    };

    return FluidNetworkSimulation;
});