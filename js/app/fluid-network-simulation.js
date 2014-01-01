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

define(['app/overlap-solver', 'app/target-calculator', 'app/fluid-adder', 'app/pressure-solver', 'app/fluid-mover'], function(OverlapSolver, TargetCalculator, FluidAdder, PressureSolver, FluidMover) {

    var FluidNetworkSimulation = {};

    FluidNetworkSimulation.create = function(spec) {
        var that = {};

        that.pipes = spec.pipes;
        that.metrics = spec.metrics;

        that.addFluid = function(pipe, point, volume) {
            that.fluidAdder.add(pipe, point, volume);
        };

        that.start = function() {
            that.overlapSolver = OverlapSolver.create({
                pipes: that.pipes,
                metrics: that.metrics
            });
            that.targetCalculator = TargetCalculator.create({
                pipes: that.pipes,
                metrics: that.metrics
            });
            that.fluidAdder = FluidAdder.create({
                metrics: that.metrics,
                overlapSolver: that.overlapSolver,
                targetCalculator: that.targetCalculator
            });
            that.pressureSolver = PressureSolver.create({
                pipes: that.pipes,
                metrics: that.metrics,
                fluidAdder: that.fluidAdder,
                targetCalculator: that.targetCalculator
            });
            that.fluidMover = FluidMover.create({
                pipes: that.pipes,
                metrics: that.metrics,
                pressureSolver: that.pressureSolver,
                targetCalculator: that.targetCalculator
            });
        };

        that.update = function() {
            that.fluidMover.update();
        };

        return that;
    };

    return FluidNetworkSimulation;
});