// Rename resistance to slope
define(['app/fluid-network-simulation', 'app/metrics', 'app/overlap-solver', 'app/target-calculator', 'app/fluid-adder'], function(FluidNetworkSimulation, Metrics, OverlapSolver, TargetCalculator, FluidAdder) {

    describe("a Fluid Adder", function() {
        var metrics,
            overlapSolver,
            targetCalculator,
            fluidAdder,
            pipes;

        var roundToPrecision = function(value, precision) {
            var power = Math.pow(10, precision - 1);
            return Math.round(value * power) / power;
        }

        var round2dp = function(value) { return roundToPrecision(value, 3); }
        var round3dp = function(value) { return roundToPrecision(value, 4); }
        var round4dp = function(value) { return roundToPrecision(value, 5); }
        var round5dp = function(value) { return roundToPrecision(value, 6); }

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
            overlapSolver = jasmine.createSpyObj('overlapSolver', ['solve']);
            targetCalculator = jasmine.createSpyObj('targetCalculator', ['pipeFull']);
            fluidAdder = FluidAdder.create({
                metrics: metrics,
                overlapSolver: overlapSolver,
                targetCalculator: targetCalculator
            });
        });

        describe("when add is called", function() {

            beforeEach(function() {
                metrics.start();
                spyOn(metrics, 'hasCapacity').andReturn(true);
            });

            describe("with a volume less than the minimum", function() {

                beforeEach(function() {
                    fluidAdder.add(pipes[0], pipes[0].va, metrics.MINIMUM_FLUID_VOLUME / 2);
                });

                it("doesn't create the pipe's fluids array", function() {
                    expect(pipes[0].fluids).toBeUndefined();
                });

                it("doesn't solve overlaps", function() {
                    expect(overlapSolver.solve).not.toHaveBeenCalled();
                });

                it("doesn't check the pipe's capacity", function() {
                    expect(metrics.hasCapacity).not.toHaveBeenCalled();
                });
            });

            describe("with a volume greater than the minimum", function() {

                describe("at the A vertex", function() {

                    beforeEach(function() {
                        fluidAdder.add(pipes[0], pipes[0].va, 2);
                    });

                    it("creates the pipe's fluids array", function() {
                        expect(pipes[0].fluids).not.toBeUndefined();
                    });

                    it("has it's volume stored in the pipe's fluids array", function() {
                        expect(pipes[0].fluids[0].volume).toBe(2);
                    });

                    it("sets it's position as 0", function() {
                        expect(pipes[0].fluids[0].position).toBe(0);
                    });

                    it("sets it's movement as the volume", function() {
                        expect(pipes[0].fluids[0].movedBy).toBe(2);
                    });

                    it("solves overlaps", function() {
                        expect(overlapSolver.solve).toHaveBeenCalledWith(pipes[0]);
                    });

                    it("checks the pipe's capacity", function() {
                        expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[0]);
                    });

                    describe("and then at the B vertex", function() {

                        beforeEach(function() {
                            fluidAdder.add(pipes[0], pipes[0].vb, 3);
                        });

                        it("has it's volume stored in the pipe's fluids array", function() {
                            expect(pipes[0].fluids[1].volume).toBe(3);
                        });

                        it("sets it's position at the end of the pipe", function() {
                            expect(pipes[0].fluids[1].position).toBe(pipes[0].capacity - 3);
                        });

                        it("sets it's movement as the negative volume", function() {
                            expect(pipes[0].fluids[1].movedBy).toBe(-3);
                        });

                        it("solves overlaps", function() {
                            expect(overlapSolver.solve.callCount).toBe(2);
                            expect(overlapSolver.solve.mostRecentCall.args[0]).toBe(pipes[0]);
                        });

                        it("checks the pipe's capacity", function() {
                            expect(metrics.hasCapacity.callCount).toBe(2);
                            expect(metrics.hasCapacity.mostRecentCall.args[0]).toBe(pipes[0]);
                        });
                    });

                    describe("and then with a volume less than the minimum", function() {

                        beforeEach(function() {
                            fluidAdder.add(pipes[0], pipes[0].va, metrics.MINIMUM_FLUID_VOLUME / 2);
                        });

                        it("doesn't add it to the pipe's fluids array", function() {
                            expect(pipes[0].fluids.length).toBe(1);
                        });

                        it("doesn't solve overlaps", function() {
                            expect(overlapSolver.solve.callCount).toBe(1);
                        });

                        it("doesn't check the pipe's capacity", function() {
                            expect(metrics.hasCapacity.callCount).toBe(1);
                        });
                    });
                });
            });

            describe("and the pipe still has capacity", function() {

                beforeEach(function() {
                    fluidAdder.add(pipes[0], pipes[0].va, 2);
                });

                it("does not tell the target calculator that the pipe is full", function() {
                    expect(targetCalculator.pipeFull).not.toHaveBeenCalled();
                });
            });

            describe("and the pipe becomes full", function() {

                beforeEach(function() {
                    metrics.hasCapacity.andReturn(false);
                    fluidAdder.add(pipes[0], pipes[0].va, 2);
                });

                it("tells the target calculator that the pipe is full", function() {
                    expect(targetCalculator.pipeFull).toHaveBeenCalledWith(pipes[0]);
                });
            });
        });
    });
});