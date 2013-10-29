// Rename resistance to slope

describe("a Pressure Solver", function() {
    var pressureSolver,
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
        fluidAdder = fns.FluidAdder.create({
            pipes: pipes,
            metrics: metrics,
            overlapSolver: overlapSolver
        });
        pressureSolver = fns.PressureSolver.create({
            pipes: pipes,
            metrics: metrics,
            fluidAdder: fluidAdder
        });
    });


    describe("removePressureInPipeAtVertex removes overlap in fluids, updates positions, and returns removed volume", function() {

        beforeEach(function() {
            metrics.start();
        });

        it("when fluid overlaps at the A vertex", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                volume: 5,
                position: -4
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].va);
            expect(pressureSolver.pipes[0].fluids[0].volume).toBe(1);
            expect(pressureSolver.pipes[0].fluids[0].position).toBe(0);
            expect(volumeRemoved).toBe(4);
        });

        it("when fluid overlaps at the B vertex", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                volume: 5,
                position: 8
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].vb);
            expect(pressureSolver.pipes[0].fluids[0].volume).toBe(2);
            expect(pressureSolver.pipes[0].fluids[0].position).toBe(8);
            expect(volumeRemoved).toBe(3);
        });

        it("when fluid overlaps at both vertices (removing at vertex A)", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                volume: 15,
                position: -2
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].va);
            expect(pressureSolver.pipes[0].fluids[0].volume).toBe(13);
            expect(pressureSolver.pipes[0].fluids[0].position).toBe(0);
            expect(volumeRemoved).toBe(2);
        });

        it("when fluid overlaps at both vertices (removing at vertex B)", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                volume: 15,
                position: -2
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].vb);
            expect(pressureSolver.pipes[0].fluids[0].volume).toBe(12);
            expect(pressureSolver.pipes[0].fluids[0].position).toBe(-2);
            expect(volumeRemoved).toBe(3);
        });

        it("when there is no overlap", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                volume: 5,
                position: 3
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].vb);
            expect(pressureSolver.pipes[0].fluids[0].volume).toBe(5);
            expect(pressureSolver.pipes[0].fluids[0].position).toBe(3);
            expect(volumeRemoved).toBe(0);
        });

        it("when the overlapping fluid is outside the pipe at vertex B", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                volume: 5,
                position: 18
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].vb);
            expect(pressureSolver.pipes[0].fluids.length).toBe(0);
            expect(pressureSolver.pipes[0].fluids.length).toBe(0);
            expect(volumeRemoved).toBe(5);
        });

        it("when the overlapping fluid is outside the pipe at vertex A", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                volume: 5,
                position: -18
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].va);
            expect(pressureSolver.pipes[0].fluids.length).toBe(0);
            expect(pressureSolver.pipes[0].fluids.length).toBe(0);
            expect(volumeRemoved).toBe(5);
        });

        it("can cope with more than one fluid", function() {
            // Pipe capacity 10
            pressureSolver.pipes[0].fluids = [{
                // Overlap 3
                volume: 5,
                position: 8
            },{
                // Overlap 5, outsie pipe
                volume: 5,
                position: 18
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pressureSolver.pipes[0], pressureSolver.pipes[0].vb);
            expect(pressureSolver.pipes[0].fluids.length).toBe(1);
            expect(pressureSolver.pipes[0].fluids[0].volume).toBe(2);
            expect(pressureSolver.pipes[0].fluids[0].position).toBe(8);
            expect(volumeRemoved).toBe(8);
        });
    });


    describe("when getAvaliableConnectedPipesWithLowestFluidLevel is called", function() {

        beforeEach(function() {
            metrics.start();
        });

        describe("with two empty connected pipes", function() {

            beforeEach(function() {
                pressureSolver.pipes[0].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[0]),
                    position: 0
                }];
            });

            it("returns the most downward pointing pipe", function() {
                var results = pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel(0, pressureSolver.pipes[0].va);
                expect(results.length).toBe(1);
                expect(results).toContain({
                    pipe: pressureSolver.pipes[1],
                    vertex: pressureSolver.pipes[0].vb
                });
            });
        });

        describe("with two connected pipes containing fluid", function() {

            beforeEach(function() {
                pressureSolver.pipes[0].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[0]),
                    position: 0
                }];
                pressureSolver.pipes[1].fluids = [{
                    volume: 6,
                    position: metrics.getLength(pressureSolver.pipes[1]) - 6
                }];
                pressureSolver.pipes[2].fluids = [{
                    volume: 7,
                    position: 0
                }];
            });

            it("returns the connected pipes and vertices where the fluid ends", function() {
                var results = pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel(0, pressureSolver.pipes[0].va);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: pressureSolver.pipes[1],
                    vertex: pressureSolver.pipes[0].vb
                });
                expect(results).toContain({
                    pipe: pressureSolver.pipes[2],
                    vertex: pressureSolver.pipes[0].vb
                });
            });
        });

        describe("with two connected pipes containing fluid, pointing up", function() {

            beforeEach(function() {
                pressureSolver.pipes[4].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[4]),
                    position: 0
                }];
                pressureSolver.pipes[1].fluids = [{
                    volume: 6,
                    position: 0
                }];
                pressureSolver.pipes[3].fluids = [{
                    volume: 1,
                    position: 0
                }];
            });

            it("returns the connected pipes and vertices where the fluid ends", function() {
                var results = pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel(4, pressureSolver.pipes[4].vb);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: pressureSolver.pipes[3],
                    vertex: pressureSolver.pipes[4].va
                });
                expect(results).toContain({
                    pipe: pressureSolver.pipes[1],
                    vertex: pressureSolver.pipes[1].va
                });
            });
        });

        describe("with two connected pipes containing fluid, pointing up, one being full", function() {

            beforeEach(function() {
                pressureSolver.pipes[4].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[4]),
                    position: 0
                }];
                pressureSolver.pipes[1].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[1]),
                    position: 0
                }];
                pressureSolver.pipes[2].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[2]),
                    position: 0
                }];
                pressureSolver.pipes[0].fluids = [{
                    volume: 1,
                    position: metrics.getLength(pressureSolver.pipes[0]) - 1
                }];
                pressureSolver.pipes[3].fluids = [{
                    volume: 20,
                    position: 0
                }];
            });

            it("returns the connected pipe and end with the lowest fluid level", function() {
                var results = pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel(4, pressureSolver.pipes[4].vb);
                expect(results[0].pipe).toBe(pressureSolver.pipes[0]);
                expect(results[0].vertex).toEqual(pressureSolver.pipes[0].vb);
            });
        });

        describe("with the lowest fluid pipe being full", function() {

            beforeEach(function() {
                pressureSolver.pipes[0].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[0]),
                    position: 0
                }];
                pressureSolver.pipes[1].fluids = [{
                    volume: metrics.getLength(pressureSolver.pipes[1]),
                    position: 0
                }];
                pressureSolver.pipes[2].fluids = [{
                    volume: 7,
                    position: 0
                }];
            });

            it("returns the most downward pointing pipe of the two branches available", function() {
                var results = pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel(0, pressureSolver.pipes[0].va);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: pressureSolver.pipes[2],
                    vertex: pressureSolver.pipes[2].va
                });
                expect(results).toContain({
                    pipe: pressureSolver.pipes[4],
                    vertex: pressureSolver.pipes[4].va
                });
            });
        });
    });

    // Pipes try to equalise the height of fluids
    // after movement, if there is leftover PRESSURE at each pipe
    // that PRESSURE is redistributed

    // PRESSURE at a vertex is summed and removed
    // this PRESSURE is moved into the pipe of least RESISTANCE
    // or DISTRIBUTED between the pipes that are OCCUPIED

    // RESISTANCE is the ANGLE of the pipe, pointing downward being lower

    // Empty pipes are always preferred, a pipe is considered OCCUPIED if
    // there is fluid at the side of the current vertex

    // When fluid is moved into an occupied pipe, it is added to the end
    // of the chain of fluids

    // Fluid is DISTRIBUTED in such a way to minimise the difference between
    // fluid heights

    // There should be no leftover PRESSURE caused by this step. if PRESSURE
    // exceeds the capacity of the pipes, it is added to the next pipe in
    // the chain


    describe("when getPipesToDistributePressureInto is called", function() {

        beforeEach(function() {
            metrics.start();
        });

        describe("and there are empty pipes at the vertex", function() {

            it("returns the most downward pointing pipe", function() {
                var pipes = pressureSolver.getPipesToDistributePressureInto([2, 1, 0], pressureSolver.pipes[0].vb);
                expect(pipes.length).toBe(1);
                expect(pipes[0]).toEqual({
                    pipe: pressureSolver.pipes[1],
                    vertex: pressureSolver.pipes[0].vb
                });
            });
        });

        describe("and the most downward pointing pipe contains fluid at the vertex", function() {

            beforeEach(function() {
                pressureSolver.pipes[1].fluids = [{
                    volume: 2,
                    position: metrics.getLength(pressureSolver.pipes[1]) - 2
                }];
            });

            it("returns the next most downward pointing pipe", function() {
                var pipes = pressureSolver.getPipesToDistributePressureInto([2, 1, 0], pressureSolver.pipes[0].vb);
                expect(pipes.length).toBe(1);
                expect(pipes[0]).toEqual({
                    pipe: pressureSolver.pipes[2],
                    vertex: pressureSolver.pipes[0].vb
                });
            });
        });

        describe("and all of the pipes contain fluid at their vertex", function() {

            var fluidSpy;

            beforeEach(function() {
                pressureSolver.pipes[0].fluids = [{
                    volume: 6,
                    position: metrics.getLength(pressureSolver.pipes[0]) - 6
                }];
                pressureSolver.pipes[1].fluids = [{
                    volume: 2,
                    position: metrics.getLength(pressureSolver.pipes[1]) - 2
                }];
                pressureSolver.pipes[2].fluids = [{
                    volume: 3,
                    position: 0
                }];
                fluidSpy = spyOn(pressureSolver, 'getAvaliableConnectedPipesWithLowestFluidLevel').andCallFake(function(index) {
                    switch (index) {
                        case 0:
                            return [{
                                pipe: pressureSolver.pipes[0],
                                vertex: pressureSolver.pipes[0].vb
                            }];
                        case 1:
                            return [{
                                pipe: pressureSolver.pipes[1],
                                vertex: pressureSolver.pipes[0].vb
                            }];
                        case 2:
                            return [{
                                pipe: pressureSolver.pipes[2],
                                vertex: pressureSolver.pipes[0].vb
                            }];
                    }
                });
            });

            it("calls getAvaliableConnectedPipesWithLowestFluidLevel for each pipe", function() {
                var pipes = pressureSolver.getPipesToDistributePressureInto([2, 1, 0], pressureSolver.pipes[0].vb);
                expect(pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel).toHaveBeenCalledWith(0, pressureSolver.pipes[0].vb);
                expect(pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel).toHaveBeenCalledWith(1, pressureSolver.pipes[0].vb);
                expect(pressureSolver.getAvaliableConnectedPipesWithLowestFluidLevel).toHaveBeenCalledWith(2, pressureSolver.pipes[0].vb);
            });

            it("returns all of the results", function() {
                var pipes = pressureSolver.getPipesToDistributePressureInto([2, 1, 0], pressureSolver.pipes[0].vb);
                expect(pipes.length).toBe(3);
                expect(pipes).toContain({
                    pipe: pressureSolver.pipes[0],
                    vertex: pressureSolver.pipes[0].vb
                });
                expect(pipes).toContain({
                    pipe: pressureSolver.pipes[1],
                    vertex: pressureSolver.pipes[0].vb
                });
                expect(pipes).toContain({
                    pipe: pressureSolver.pipes[2],
                    vertex: pressureSolver.pipes[0].vb
                });
            });
        });
    });


    describe("when getFluidLevel is called", function() {

        describe("when the pipe has fluid at the vertex", function() {

            beforeEach(function() {
                metrics.start();
                pressureSolver.pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the level of the fluid at the vertex in relation to the pipe's position", function() {
                // Pipe is at 45' with volume of 3 = ~ 2.12132034355965
                // subtract from y position of 20
                var level = metrics.getFluidLevel(pressureSolver.pipes[1], pressureSolver.pipes[1].va);
                expect(level).toBeCloseTo(20 - 2.12132034355965);
            });
        });

        describe("when the pipe has fluid at the vertex pointing down", function() {

            beforeEach(function() {
                metrics.start();
                pressureSolver.pipes[1].fluids = [{
                    volume: 3,
                    position: pressureSolver.pipes[1].capacity - 3
                }];
            });

            it("returns the level of the fluid at the vertex in relation to the pipe's position", function() {
                // Pipe is at 45' with volume of 3 = ~ 2.12132034355965
                // add to from y position of 10
                var level = metrics.getFluidLevel(pressureSolver.pipes[1], pressureSolver.pipes[1].vb);
                expect(level).toBeCloseTo(10 + 2.12132034355965);
            });
        });

        describe("when the pipe doesn't have fluid at the vertex", function() {

            beforeEach(function() {
                metrics.start();
            });

            it("returns the level of the vertex", function() {
                var level = metrics.getFluidLevel(pressureSolver.pipes[1], pressureSolver.pipes[1].va);
                expect(level).toBe(20);
            });
        });
    });

    describe("when getVolumeNeededToReachLevel is called", function() {

        describe("and the pipe is pointing up, with the level being higher", function() {

            beforeEach(function() {
                metrics.start();
                pressureSolver.pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = pressureSolver.pipes[1];
                var level = metrics.getFluidLevel(pipe, pipe.va);
                pipe.fluids[0].volume += pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.va, level + 6);
                expect(metrics.getFluidLevel(pipe, pipe.va)).toBe(level + 6);
            });
        });

        describe("and the pipe is pointing up, with the level being lower", function() {

            beforeEach(function() {
                metrics.start();
                pressureSolver.pipes[1].fluids = [{
                    volume: 5,
                    position: 0
                }];
            });

            it("returns the volume of fluid to be removed to reach that level", function() {
                var pipe = pressureSolver.pipes[1];
                var level = metrics.getFluidLevel(pipe, pipe.va);
                pipe.fluids[0].volume += pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.va, level - 2);
                expect(metrics.getFluidLevel(pipe, pipe.va)).toBe(level - 2);
            });
        });

        describe("and the pipe is pointing down, with the level being lower", function() {

            beforeEach(function() {
                metrics.start();
                pressureSolver.pipes[1].fluids = [{
                    volume: 4,
                    position: pressureSolver.pipes[1].capacity - 4
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = pressureSolver.pipes[1];
                var level = metrics.getFluidLevel(pipe, pipe.vb);
                var volume = pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.vb, level + 2);
                pipe.fluids[0].volume += volume;
                pipe.fluids[0].position -= volume;
                expect(metrics.getFluidLevel(pipe, pipe.vb)).toBe(level + 2);
            });
        });

        describe("and the pipe is pointing down, with the level being higher", function() {

            beforeEach(function() {
                metrics.start();
                pressureSolver.pipes[1].fluids = [{
                    volume: 2,
                    position: pressureSolver.pipes[1].capacity - 2
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = pressureSolver.pipes[1];
                var level = metrics.getFluidLevel(pipe, pipe.vb);
                var volume = pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.vb, level - 5);
                pipe.fluids[0].volume += volume;
                pipe.fluids[0].position -= volume;
                expect(metrics.getFluidLevel(pipe, pipe.vb)).toBeCloseTo(level - 5);
            });
        });

        describe("and the pipe is perfectly horizontal", function() {

            beforeEach(function() {
                metrics.start();
                pressureSolver.pipes[2].fluids = [{
                    volume: 2,
                    position: 0
                }];
            });

            it("returns false", function() {
                var pipe = pressureSolver.pipes[2];
                var level = metrics.getFluidLevel(pipe, pipe.va);
                var volume = pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.va, level + 1);
                expect(volume).toBe(false);
            });
        })
    });

            // 1. get targets as above
            // 2. order by fluid height
            // 3. if multiple
                // 4. find the ammount of fluid for each one
                //    for them all to be at the same height as
                //    the next highest (or less, if there's not enough)
                    // 5. if any of this will put a pipe over capacity
                    //    or run the fluid into an existing one, scale
                    //    down the fluid to add
                        // 6. add to all, and re-run from step 1 with
                        //    the remaining fluid
            // 3a. if single
                // find the ammount to add for the fluid to be the same
                // height as the next highest
                    // take the minimum of this, and the capacity
                        // add it, and re-run from step 1 with
                        // the remaining fluid

    describe("when redistributePressure is called", function() {

        var distributeSpy,
            pipes,
            vertex;

        beforeEach(function() {
            metrics.start();
            pipes = [
                pressureSolver.pipes[1],
                pressureSolver.pipes[3],
                pressureSolver.pipes[4]
            ],
            vertex = pressureSolver.pipes[1].va;
            distributeSpy = spyOn(pressureSolver, 'getPipesToDistributePressureIntoX').andReturn([{
                pipe: pressureSolver.pipes[4],
                vertex: pressureSolver.pipes[4].vb
            }]);
            spyOn(fluidAdder, 'add');
        });

        it("calls getPipesToDistributePressureIntoX", function() {
            pressureSolver.redistributePressure(pipes, vertex, 5);
            expect(pressureSolver.getPipesToDistributePressureIntoX).toHaveBeenCalledWith(pipes, vertex);
        });

        describe("and there is no fluid in the returned pipe", function() {

            it("moves the pressure into the returned pipe", function() {
                pressureSolver.redistributePressure(pipes, vertex, 5);
                expect(fluidAdder.add).toHaveBeenCalledWith(pressureSolver.pipes[4], pressureSolver.pipes[4].vb, 5)
            });
        });

        describe("and there is fluid in all of the returned pipes", function() {

            beforeEach(function() {
                pressureSolver.pipes[3].fluids = [{
                    volume: 6,
                    position: 0
                }];
                pressureSolver.pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
                // 4 is full

                distributeSpy.andReturn([{
                    pipe: pressureSolver.pipes[3],
                    vertex: pressureSolver.pipes[3].va
                },{
                    pipe: pressureSolver.pipes[1],
                    vertex: pressureSolver.pipes[1].va
                }]);
            });

            it("moves fluid into the pipe with the lowest level", function() {
                pressureSolver.redistributePressure(pipes, vertex, 5);
                expect(fluidAdder.add.callCount).toBe(1);
                var args = fluidAdder.add.mostRecentCall.args;
                expect(args[0]).toBe(pressureSolver.pipes[1]);
                expect(args[1]).toBe(pressureSolver.pipes[1].va);
            });

            describe("when the new level would be lower than the next highest", function() {

                it("moves all of the fluid", function() {
                    pressureSolver.redistributePressure(pipes, vertex, 5);
                    var volume = fluidAdder.add.mostRecentCall.args[2];
                    expect(volume).toBe(5);
                });
            });

            describe("when the new level would be higher than the next highest", function() {

                beforeEach(function() {
                    spyOn(pressureSolver, 'getVolumeNeededToReachLevel').andReturn(3.3);
                    pressureSolver.redistributePressure(pipes, vertex, 20);
                })

                it("matches the level of the next highest fluid", function() {
                    var nextLevel = metrics.getFluidLevel(pressureSolver.pipes[3], pressureSolver.pipes[3].va);
                    expect(pressureSolver.getVolumeNeededToReachLevel).toHaveBeenCalledWith(pressureSolver.pipes[1], pressureSolver.pipes[1].va, nextLevel);
                    var volume = fluidAdder.add.calls[0].args[2];
                    expect(volume).toBe(3.3);
                });
            });

            describe("when that pipe is full", function() {

                beforeEach(function() {
                    pressureSolver.pipes[3].fluids[0].volume = 20;
                    var pressure = (pressureSolver.pipes[1].capacity - 3) + 1;
                    spyOn(pressureSolver, 'redistributePressure').andCallThrough();
                    pressureSolver.redistributePressure(pipes, vertex, pressure);
                });

                it("calls redistributePressure again with the remaining pressure", function() {
                    expect(pressureSolver.redistributePressure).toHaveBeenCalledWith(pipes, vertex, 1);
                });
            });

            describe("when there are multiple pipes with the lowest fluid level", function() {

                var originalLevelA,
                    originalLevelB;

                beforeEach(function() {
                    var nextLevel = metrics.getFluidLevel(pressureSolver.pipes[3], pressureSolver.pipes[3].va);
                    var volume = pressureSolver.getVolumeNeededToReachLevel(pressureSolver.pipes[1], pressureSolver.pipes[1].va, nextLevel);
                    pressureSolver.pipes[1].fluids[0].volume += volume;
                    originalLevelA = metrics.getFluidLevel(pressureSolver.pipes[1], pressureSolver.pipes[1].va);
                    originalLevelB = metrics.getFluidLevel(pressureSolver.pipes[3], pressureSolver.pipes[3].va);
                    fluidAdder.add.andCallThrough();
                    pressureSolver.redistributePressure(pipes, vertex, 1);
                });

                it("distributes the fluid so that they reach the same level", function() {
                    var levelA = metrics.getFluidLevel(pressureSolver.pipes[1], pressureSolver.pipes[1].va);
                    var levelB = metrics.getFluidLevel(pressureSolver.pipes[3], pressureSolver.pipes[3].va);
                    expect(levelA).not.toBe(originalLevelA);
                    expect(levelB).not.toBe(originalLevelB);
                    expect(levelA).toBeCloseTo(levelB);
                });

                it("doesn't put any pipe over capacity", function() {

                });

                // also test when they are pointing in different directions

                // also test they match the next level

                // test they dont' put pipe over capacity

            });
        });
    });

            // when there are multiple pipes with the same fluid level
                // 4. find the ammount of fluid for each one
                //    for them all to be at the same height as
                //    the next highest (or less, if there's not enough)
                    // 5. if any of this will put a pipe over capacity
                    //    or run the fluid into an existing one, scale
                    //    down the fluid to add
                        // 6. add to all, and re-run from step 1 with
                        //    the remaining fluid

    describe("when solve is called", function() {

        beforeEach(function() {
            metrics.start();
            spyOn(pressureSolver, 'removePressureInPipeAtVertex').andReturn(5);
            spyOn(pressureSolver, 'redistributePressure');
            pressureSolver.solve(pressureSolver.pipes[0], pressureSolver.pipes[0].vb);
        });

        it("removes the pressure from the pipe", function() {
            expect(pressureSolver.removePressureInPipeAtVertex).toHaveBeenCalledWith(pressureSolver.pipes[0], pressureSolver.pipes[0].vb)
        });

        it("calls redistributePressure", function() {
            expect(pressureSolver.redistributePressure).toHaveBeenCalled();
        });

        it("passes all the pipes at that vertex to redistributePressure", function() {
            var pipes = pressureSolver.redistributePressure.mostRecentCall.args[0];
            expect(pipes).toContain(pressureSolver.pipes[0]);
            expect(pipes).toContain(pressureSolver.pipes[1]);
            expect(pipes).toContain(pressureSolver.pipes[2]);
        });

        it("passes the vertex to redistributePressure", function() {
            expect(pressureSolver.redistributePressure.mostRecentCall.args[1]).toBe(pressureSolver.pipes[0].vb);
        });

        it("passes the pressure to redistributePressure", function() {
            expect(pressureSolver.redistributePressure.mostRecentCall.args[2]).toBe(5);
        });
    });
});