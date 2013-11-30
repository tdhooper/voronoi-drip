// Rename resistance to slope

describe("a Fluid Mover", function() {
    var metrics,
        overlapSolver,
        targetCalculator,
        fluidAdder,
        pressureSolver,
        fluidMover,
        pipes;

    /*
        Test pipe layout

                    | 3
                    |
                    |
              0 |   |
        2       |   |
        _ _ _ _ |   |
                 \  |
                  \ |
                1  \|
                   /
                  /
                 /  4

        0   x -->

        y
        |
        V

    */

    beforeEach(function() {

        pipes = [
            {
                // 0
                va: {x: 0, y: 0},
                vb: {x: 0, y: 10},
                ca: null,
                cb: [1, 2],
            },{
                // 1
                va: {x: 10, y: 20},
                vb: {x: 0, y: 10},
                ca: [3, 4],
                cb: [0, 2],
            },{
                // 2
                va: {x: 0, y: 10},
                vb: {x: -20, y: 10},
                ca: [0, 1],
                cb: null,
            },{
                // 3
                va: {x: 10, y: 20},
                vb: {x: 10, y: -10},
                ca: [1, 4],
                cb: null,
            },{
                // 4
                va: {x: 10, y: 20},
                vb: {x: 0, y: 30},
                ca: [1, 3],
                cb: null,
            }
        ];

        var fns = VoronoiDrip.FluidNetworkSimulation;
        metrics = fns.Metrics.create({
            pipes: pipes,
            gravity: 0.1
        });
        overlapSolver = fns.OverlapSolver.create({
            pipes: pipes
        });
        targetCalculator = fns.TargetCalculator.create({
            pipes: pipes,
            metrics: metrics
        });
        fluidAdder = fns.FluidAdder.create({
            pipes: pipes,
            metrics: metrics,
            overlapSolver: overlapSolver,
            targetCalculator: targetCalculator
        });
        pressureSolver = fns.PressureSolver.create({
            pipes: pipes,
            metrics: metrics,
            fluidAdder: fluidAdder,
            targetCalculator: targetCalculator
        });
        fluidMover = fns.FluidMover.create({
            pipes: pipes,
            metrics: metrics,
            pressureSolver: pressureSolver,
            targetCalculator: targetCalculator
        });
    });

    describe("when update is called", function() {

        beforeEach(function() {
            metrics.start();
            fluidMover.pipes[0].fluids = [{
                volume: 1,
                position: 0
            }];
            fluidMover.pipes[1].fluids = [{
                volume: 1,
                position: 5
            }];
            fluidMover.pipes[2].fluids = [{
                volume: 1,
                position: 0
            }];
            spyOn(pressureSolver, 'solve');
            spyOn(targetCalculator, 'pipeEmpty');
            fluidMover.update();
        });

        it("moves each fluid by it's velocity", function() {
            expect(fluidMover.pipes[0].fluids[0].position).toBe(0.1);
            expect(fluidMover.pipes[1].fluids[0].position).toBe(5 - 0.05);
            expect(fluidMover.pipes[2].fluids[0].position).toBe(0);
        });

        it("calls pressureSolver.solve for each pipe where fluid has moved", function() {
            expect(pressureSolver.solve.callCount).toBe(2);
        });

        it("passes the pipe and the vertex towards which the fluid is moving to pressureSolver.solve", function() {
            expect(pressureSolver.solve).toHaveBeenCalledWith(fluidMover.pipes[0], fluidMover.pipes[0].vb);
            expect(pressureSolver.solve).toHaveBeenCalledWith(fluidMover.pipes[1], fluidMover.pipes[1].va);
        });

        it("for each pipe where fluid has moved, tells the target calculator that it's empty", function() {
            expect(targetCalculator.pipeEmpty.callCount).toBe(2);
            expect(targetCalculator.pipeEmpty).toHaveBeenCalledWith(fluidMover.pipes[0]);
            expect(targetCalculator.pipeEmpty).toHaveBeenCalledWith(fluidMover.pipes[1]);
        });
    });
});