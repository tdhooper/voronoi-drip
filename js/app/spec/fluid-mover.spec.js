define(['app/fluid-network-simulation', 'app/metrics', 'app/overlap-solver', 'app/target-calculator', 'app/fluid-adder', 'app/pressure-solver', 'app/fluid-mover'], function(FluidNetworkSimulation, Metrics, OverlapSolver, TargetCalculator, FluidAdder, PressureSolver, FluidMover) {

    describe("a Fluid Mover", function() {
        var metrics,
            targetCalculator,
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

            metrics = Metrics.create({
                pipes: pipes,
                gravity: 0.1
            });
            targetCalculator = jasmine.createSpyObj('targetCalculator', ['getCachedGroupContainingFullPipe', 'pipeEmpty']);
            pressureSolver = jasmine.createSpyObj('pressureSolver', ['solve']);
            fluidMover = FluidMover.create({
                pipes: pipes,
                metrics: metrics,
                pressureSolver: pressureSolver,
                targetCalculator: targetCalculator
            });
        });

        describe("when hasValidTarget is called", function() {

            var getCachedSpy;

            beforeEach(function() {
                getCachedSpy = targetCalculator.getCachedGroupContainingFullPipe;
            });

            it("gets the cached group for the pipe", function() {
                fluidMover.hasValidTarget(pipes[0], pipes[0].va);
                expect(getCachedSpy).toHaveBeenCalledWith(pipes[0]);
            });

            describe("and there is no cached group", function() {

                it("returns true", function() {
                    expect(fluidMover.hasValidTarget(pipes[0], pipes[0].va)).toBe(true);
                });
            });

            describe("and there is a cached group", function() {

                beforeEach(function() {
                    getCachedSpy.and.returnValue({
                        targets: [{
                            pipe: pipes[4],
                            vertex: pipes[4].vb
                        },{
                            pipe: pipes[1],
                            vertex: pipes[1].vb
                        },{
                            pipe: pipes[2],
                            vertex: pipes[2].va
                        }]
                    });
                    pipes[0].level = 100;
                    pipes[4].level = 50;
                    pipes[1].level = 50;
                    pipes[2].level = 50;
                    spyOn(metrics, 'getFluidLevel').and.callFake(function(pipe) {
                        return pipe.level;
                    });
                });

                it("gets the pipe's fluid level", function() {
                    fluidMover.hasValidTarget(pipes[0], pipes[0].va);
                    expect(metrics.getFluidLevel).toHaveBeenCalledWith(pipes[0], pipes[0].va);
                });

                it("gets the fluid level of each target", function() {
                    fluidMover.hasValidTarget(pipes[0], pipes[0].va);
                    expect(metrics.getFluidLevel.calls.count()).toBe(4);
                    expect(metrics.getFluidLevel).toHaveBeenCalledWith(pipes[4], pipes[4].vb);
                    expect(metrics.getFluidLevel).toHaveBeenCalledWith(pipes[1], pipes[1].vb);
                    expect(metrics.getFluidLevel).toHaveBeenCalledWith(pipes[2], pipes[2].va);
                });

                it("returns true when it finds a target with a lower fluid level", function() {
                    pipes[1].level = 120;
                    expect(fluidMover.hasValidTarget(pipes[0], pipes[0].va)).toBe(true);
                    expect(metrics.getFluidLevel.calls.count()).toBe(3);
                });

                it("returns false if it doesn't find one", function() {
                    expect(fluidMover.hasValidTarget(pipes[0], pipes[0].va)).toBe(false);
                });
            });
        });

        describe("when moveFluidsInPipe is called", function() {

            beforeEach(function() {
                pipes[0].fluids = [{
                    volume: 1,
                    position: 0
                },{
                    volume: 1,
                    position: 2
                }];
                fluidMover.moveFluidsInPipe(pipes[0], 0.1);
            });

            it("moves each fluid by it's velocity", function() {
                expect(fluidMover.pipes[0].fluids[0].position).toBe(0.1);
                expect(fluidMover.pipes[0].fluids[1].position).toBe(2.1);
            });

            it("calls pressureSolver.solve with the pipe and B vertex if the velocity is positive", function() {
                expect(pressureSolver.solve.calls.count()).toBe(1);
                expect(pressureSolver.solve).toHaveBeenCalledWith(fluidMover.pipes[0], fluidMover.pipes[0].vb);
            });

            it("calls pressureSolver.solve with the pipe and A vertex if the velocity is positive", function() {
                fluidMover.moveFluidsInPipe(pipes[0], -5);
                expect(pressureSolver.solve.calls.count()).toBe(2);
                expect(pressureSolver.solve).toHaveBeenCalledWith(fluidMover.pipes[0], fluidMover.pipes[0].va);
            });

            it("tells the target calculator that it's empty", function() {
                expect(targetCalculator.pipeEmpty.calls.count()).toBe(1);
                expect(targetCalculator.pipeEmpty).toHaveBeenCalledWith(fluidMover.pipes[0]);
            });
        });

        describe("when update is called", function() {

            beforeEach(function() {
                metrics.start();
                pipes[0].fluids = [{
                    volume: 1000,
                    position: 0
                }];
                pipes[1].fluids = [{
                    volume: 1,
                    position: 5
                }];
                pipes[2].fluids = [{
                    volume: 1,
                    position: 0
                }];
                pipes[3].fluids = [{
                    volume: 5555,
                    position: 0
                }];
                spyOn(metrics, 'getFluidVelocity').and.callThrough();
                spyOn(metrics, 'hasCapacity').and.callThrough();
                spyOn(fluidMover, 'moveFluidsInPipe');
                spyOn(fluidMover, 'hasValidTarget').and.callFake(function(pipe) {
                    if (pipe == pipes[3]) {
                        return true;
                    }
                    return false;
                });
                fluidMover.update();
            });

            it("checks the velocity for each pipe that has fluids", function() {
                expect(metrics.getFluidVelocity.calls.count()).toBe(4);
                expect(metrics.getFluidVelocity).toHaveBeenCalledWith(pipes[0]);
                expect(metrics.getFluidVelocity).toHaveBeenCalledWith(pipes[1]);
                expect(metrics.getFluidVelocity).toHaveBeenCalledWith(pipes[2]);
                expect(metrics.getFluidVelocity).toHaveBeenCalledWith(pipes[3]);
            });

            it("for pipes that have velocity, it checks their capacity", function() {
                expect(metrics.hasCapacity.calls.count()).toBe(3);
                expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[0]);
                expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[1]);
                expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[3]);
            });

            it("for pipes that have capacity, it calls moveFluidsInPipe with the velocity", function() {
                expect(fluidMover.moveFluidsInPipe.calls.count()).toBe(2);
                expect(fluidMover.moveFluidsInPipe).toHaveBeenCalledWith(pipes[1], -0.05);
            });

            describe("for pipes without capacity", function() {

                it("calls hasValidTarget", function() {
                    expect(fluidMover.hasValidTarget.calls.count()).toBe(2);
                });

                it("with vertex B when there is a positive velocity", function() {
                    expect(fluidMover.hasValidTarget).toHaveBeenCalledWith(pipes[0], pipes[0].vb);
                });

                it("with vertex A when there is a negative velocity", function() {
                    expect(fluidMover.hasValidTarget).toHaveBeenCalledWith(pipes[3], pipes[3].va);
                });

                it("for pipe with a valid target, it calls moveFluidsInPipe with the velocity", function() {
                    expect(fluidMover.moveFluidsInPipe.calls.count()).toBe(2);
                    expect(fluidMover.moveFluidsInPipe).toHaveBeenCalledWith(pipes[3], -0.1);
                });
            });
        });
    });
});