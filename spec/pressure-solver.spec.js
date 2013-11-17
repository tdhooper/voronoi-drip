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
            pipes[0].fluids = [{
                volume: 5,
                position: -4
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].va);
            expect(pipes[0].fluids[0].volume).toBe(1);
            expect(pipes[0].fluids[0].position).toBe(0);
            expect(volumeRemoved).toBe(4);
        });

        it("when fluid overlaps at the B vertex", function() {
            // Pipe capacity 10
            pipes[0].fluids = [{
                volume: 5,
                position: 8
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].vb);
            expect(pipes[0].fluids[0].volume).toBe(2);
            expect(pipes[0].fluids[0].position).toBe(8);
            expect(volumeRemoved).toBe(3);
        });

        it("when fluid overlaps at both vertices (removing at vertex A)", function() {
            // Pipe capacity 10
            pipes[0].fluids = [{
                volume: 15,
                position: -2
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].va);
            expect(pipes[0].fluids[0].volume).toBe(13);
            expect(pipes[0].fluids[0].position).toBe(0);
            expect(volumeRemoved).toBe(2);
        });

        it("when fluid overlaps at both vertices (removing at vertex B)", function() {
            // Pipe capacity 10
            pipes[0].fluids = [{
                volume: 15,
                position: -2
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].vb);
            expect(pipes[0].fluids[0].volume).toBe(12);
            expect(pipes[0].fluids[0].position).toBe(-2);
            expect(volumeRemoved).toBe(3);
        });

        it("when there is no overlap", function() {
            // Pipe capacity 10
            pipes[0].fluids = [{
                volume: 5,
                position: 3
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].vb);
            expect(pipes[0].fluids[0].volume).toBe(5);
            expect(pipes[0].fluids[0].position).toBe(3);
            expect(volumeRemoved).toBe(0);
        });

        it("when the overlapping fluid is outside the pipe at vertex B", function() {
            // Pipe capacity 10
            pipes[0].fluids = [{
                volume: 5,
                position: 18
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].vb);
            expect(pipes[0].fluids.length).toBe(0);
            expect(pipes[0].fluids.length).toBe(0);
            expect(volumeRemoved).toBe(5);
        });

        it("when the overlapping fluid is outside the pipe at vertex A", function() {
            // Pipe capacity 10
            pipes[0].fluids = [{
                volume: 5,
                position: -18
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].va);
            expect(pipes[0].fluids.length).toBe(0);
            expect(pipes[0].fluids.length).toBe(0);
            expect(volumeRemoved).toBe(5);
        });

        it("can cope with more than one fluid", function() {
            // Pipe capacity 10
            pipes[0].fluids = [{
                // Overlap 3
                volume: 5,
                position: 8
            },{
                // Overlap 5, outsie pipe
                volume: 5,
                position: 18
            }];
            var volumeRemoved = pressureSolver.removePressureInPipeAtVertex(pipes[0], pipes[0].vb);
            expect(pipes[0].fluids.length).toBe(1);
            expect(pipes[0].fluids[0].volume).toBe(2);
            expect(pipes[0].fluids[0].position).toBe(8);
            expect(volumeRemoved).toBe(8);
        });
    });

    describe("when getAvailableTargetsForPipe is called", function() {

        var fullPipes = [];

        beforeEach(function() {
            metrics.start();

            var hasCapacity = metrics.hasCapacity;
            spyOn(metrics, 'hasCapacity').andCallFake(function(pipe) {
                if (fullPipes.indexOf(pipe) !== -1) {
                    return false;
                }
                return true;
            });
        });

        describe("with a pipe that has available capacity", function() {

            it("returns the original pipe", function() {
                var results = pressureSolver.getAvailableTargetsForPipe(0, pipes[0].va);
                expect(results.length).toBe(1);
                expect(results).toContain({
                    pipe: pipes[0],
                    vertex: pipes[0].va,
                    highestVertex: pipes[0].va
                });
            });
        });

        describe("with two connected pipes with available capacity", function() {

            beforeEach(function() {
                fullPipes = [pipes[0]];
            });

            it("returns both pipes and their starting vertices", function() {
                var results = pressureSolver.getAvailableTargetsForPipe(0, pipes[0].va);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: pipes[1],
                    vertex: pipes[0].vb,
                    highestVertex: pipes[0].va
                });
                expect(results).toContain({
                    pipe: pipes[2],
                    vertex: pipes[0].vb,
                    highestVertex: pipes[0].va
                });
            });
        });

        describe("with one full connected pipe", function() {

            beforeEach(function() {
                fullPipes = [pipes[0], pipes[1]];
            });

            it("returns the connected pipes of the full pipes", function() {
                var results = pressureSolver.getAvailableTargetsForPipe(0, pipes[0].va);
                expect(results.length).toBe(3);
                expect(results).toContain({
                    pipe: pipes[2],
                    vertex: pipes[2].va,
                    highestVertex: pipes[0].va
                });
                expect(results).toContain({
                    pipe: pipes[4],
                    vertex: pipes[4].va,
                    highestVertex: pipes[0].va
                });
                expect(results).toContain({
                    pipe: pipes[3],
                    vertex: pipes[3].va,
                    highestVertex: pipes[0].va
                });
            });
        });

        describe("with two full connected pipes", function() {

            beforeEach(function() {
                fullPipes = [pipes[4], pipes[1], pipes[2]];
            });

            it("returns the connected pipes of the full pipes", function() {
                var results = pressureSolver.getAvailableTargetsForPipe(4, pipes[4].vb);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: pipes[0],
                    vertex: pipes[0].vb,
                    highestVertex: pipes[1].vb
                });
                expect(results).toContain({
                    pipe: pipes[3],
                    vertex: pipes[3].va,
                    highestVertex: pipes[1].vb
                });
            });
        });

        describe("when the highest point is higher than the starting point", function() {

            beforeEach(function() {
                fullPipes = [pipes[0], pipes[1], pipes[3]];
            });

            it("sets the highest vertex correctly", function() {
                var results = pressureSolver.getAvailableTargetsForPipe(0, pipes[0].va);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: pipes[2],
                    vertex: pipes[2].va,
                    highestVertex: pipes[3].vb
                });
                expect(results).toContain({
                    pipe: pipes[4],
                    vertex: pipes[4].va,
                    highestVertex: pipes[3].vb
                });
            });
        });

        describe("and there is a loop of full pipes", function() {

            var connectedSpy;

            beforeEach(function() {
                pipes = [
                    {
                        // 0
                        va: {x: 10, y: 10},
                        vb: {x: 0, y: 20},
                        ca: [1],
                        cb: [2],
                    },{
                        // 1
                        va: {x: 10, y: 10},
                        vb: {x: 20, y: 20},
                        ca: [0],
                        cb: [2],
                    },{
                        // 2
                        va: {x: 0, y: 20},
                        vb: {x: 20, y: 20},
                        ca: [0],
                        cb: [1],
                    }
                ];
                pressureSolver.pipes = pipes;
                metrics.pipes = pipes;
                fullPipes = [pipes[0], pipes[1], pipes[2]];
                spyOn(pressureSolver, 'getAvailableTargetsForPipe').andCallThrough();
                connectedSpy = spyOn(metrics, 'getConnectedPipeIndexes').andCallThrough();
            });

            it("does not re-check already checked pipe and vertex combinations", function() {
                pressureSolver.getAvailableTargetsForPipe(0, pipes[0].va);
                expect(connectedSpy.callCount).toBe(3);
                expect(connectedSpy).toHaveBeenCalledWith(0, pipes[0].vb);
                expect(connectedSpy).toHaveBeenCalledWith(2, pipes[2].vb);
                expect(connectedSpy).toHaveBeenCalledWith(1, pipes[1].va);
            });

        });

        // May need to cache the results, rather than returning false

    });

    describe("when getAvailableTargetsForVertex is called", function() {

        var targetsSpy;

        beforeEach(function() {
            metrics.start();
            spyOn(metrics, 'getVertexPipes').andReturn([
                pipes[0],
                pipes[2],
                pipes[1]
            ]);
            targetsSpy = spyOn(pressureSolver, 'getAvailableTargetsForPipe');
        });

        it("gets the vertex pipes", function() {
            pressureSolver.getAvailableTargetsForVertex(pipes[0], pipes[0].vb);
            expect(metrics.getVertexPipes).toHaveBeenCalledWith(pipes[0], pipes[0].vb);
        });

        it("calls getAvailableTargetsForPipe for each pipe", function() {
            var targets = pressureSolver.getAvailableTargetsForVertex(pipes[0], pipes[0].vb);
            expect(targetsSpy.callCount).toBe(3);
            expect(targetsSpy).toHaveBeenCalledWith(0, pipes[0].vb);
            expect(targetsSpy).toHaveBeenCalledWith(1, pipes[0].vb);
            expect(targetsSpy).toHaveBeenCalledWith(2, pipes[0].vb);
        });

        it("concatenates the results from getAvailableTargetsForPipe", function() {
            targetsSpy.andCallFake(function(pipeIndex) {
                switch (pipeIndex) {
                    case 0:
                        return ['A', 'B']
                    case 1:
                        return ['A']
                    case 2:
                        return ['C', 'D', 'E']
                }
            });
            var targets = pressureSolver.getAvailableTargetsForVertex(pipes[0], pipes[0].vb);
            expect(targets.length).toBe(6);
            expect(targets).toContain('A');
            expect(targets).toContain('B');
            expect(targets).toContain('C');
            expect(targets).toContain('D');
            expect(targets).toContain('E');
        });
    });

    describe("when getVolumeNeededToReachLevel is called", function() {

        describe("and the pipe is pointing up, with the level being higher", function() {

            beforeEach(function() {
                metrics.start();
                pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = pipes[1];
                var level = metrics.getFluidLevel(pipe, pipe.va);
                pipe.fluids[0].volume += pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.va, level + 6);
                expect(metrics.getFluidLevel(pipe, pipe.va)).toBe(level + 6);
            });
        });

        describe("and the pipe is pointing up, with the level being lower", function() {

            beforeEach(function() {
                metrics.start();
                pipes[1].fluids = [{
                    volume: 5,
                    position: 0
                }];
            });

            it("returns the volume of fluid to be removed to reach that level", function() {
                var pipe = pipes[1];
                var level = metrics.getFluidLevel(pipe, pipe.va);
                pipe.fluids[0].volume += pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.va, level - 2);
                expect(metrics.getFluidLevel(pipe, pipe.va)).toBe(level - 2);
            });
        });

        describe("and the pipe is pointing down, with the level being lower", function() {

            beforeEach(function() {
                metrics.start();
                pipes[1].fluids = [{
                    volume: 4,
                    position: pipes[1].capacity - 4
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = pipes[1];
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
                pipes[1].fluids = [{
                    volume: 2,
                    position: pipes[1].capacity - 2
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = pipes[1];
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
                pipes[2].fluids = [{
                    volume: 2,
                    position: 0
                }];
            });

            it("returns false", function() {
                var pipe = pipes[2];
                var level = metrics.getFluidLevel(pipe, pipe.va);
                var volume = pressureSolver.getVolumeNeededToReachLevel(pipe, pipe.va, level + 1);
                expect(volume).toBe(false);
            });
        })
    });

    describe("when addFluidLevel is called", function() {

        it("uses the fluid level if it is higher than the highestVertex", function() {
            spyOn(metrics, 'getFluidLevel').andReturn(6);
            var target = {
                pipe: pipes[0],
                vertex: pipes[0].va,
                highestVertex: {x: 0, y: 14}
            };
            target = pressureSolver.addFluidLevel(target);
            expect(metrics.getFluidLevel).toHaveBeenCalledWith(target.pipe, target.vertex);
            expect(target.level).toBe(6);
        });

        it("uses the highestVertex if it is higher than the fluid level", function() {
            spyOn(metrics, 'getFluidLevel').andReturn(52);
            var target = {
                pipe: pipes[0],
                vertex: pipes[0].va,
                highestVertex: {x: 0, y: 14}
            };
            target = pressureSolver.addFluidLevel(target);
            expect(target.level).toBe(14);
        });

    });

    describe("when redistributePressure is called", function() {

        var targetsSpy,
            vertex;

        beforeEach(function() {
            metrics.start();
            vertex = pipes[1].va;
            targetsSpy = spyOn(pressureSolver, 'getAvailableTargetsForVertex').andReturn([{
                pipe: pipes[3],
                vertex: pipes[3].va,
                highestVertex: pipes[3].va
            },{
                pipe: pipes[1],
                vertex: pipes[1].va,
                highestVertex: pipes[1].va
            }]);
            spyOn(fluidAdder, 'add');
        });

        it("calls getAvailableTargetsForVertex", function() {
            pressureSolver.redistributePressure(pipes[1], pipes[1].va, 5);
            expect(targetsSpy).toHaveBeenCalledWith(pipes[1], pipes[1].va);
        });

        it("adds the fluid level for each target", function() {
            var addLevelSpy = spyOn(pressureSolver, 'addFluidLevel').andCallThrough();
            pressureSolver.redistributePressure(pipes[1], pipes[1].va, 5);
            expect(addLevelSpy.callCount).toBe(2);
            expect(addLevelSpy.calls[0].args[0].pipe).toBe(pipes[3]);
            expect(addLevelSpy.calls[0].args[0].vertex).toBe(pipes[3].va);
            expect(addLevelSpy.calls[1].args[0].pipe).toBe(pipes[1]);
            expect(addLevelSpy.calls[1].args[0].vertex).toBe(pipes[1].va);
        });

        describe("and the returned targets are pointing down, with the same fluid level", function() {

            beforeEach(function() {
                targetsSpy.andReturn([{
                    pipe: pipes[1],
                    vertex: pipes[1].vb,
                    highestVertex: pipes[1].vb
                },{
                    pipe: pipes[2],
                    vertex: pipes[2].va,
                    highestVertex: pipes[2].va
                }]);
            });

            it("moves the pressure into the most downward pipe", function() {
                pressureSolver.redistributePressure(pipes[1], pipes[1].vb, 5);
                expect(fluidAdder.add).toHaveBeenCalledWith(pipes[1], pipes[1].vb, 5)
            });
        });

        describe("and there is fluid in all of the returned pipes", function() {

            beforeEach(function() {
                pipes[3].fluids = [{
                    volume: 6,
                    position: 0
                }];
                pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
                // 4 is full

                targetsSpy.andReturn([{
                    pipe: pipes[3],
                    vertex: pipes[3].va,
                    highestVertex: pipes[3].va
                },{
                    pipe: pipes[1],
                    vertex: pipes[1].va,
                    highestVertex: pipes[1].va
                }]);
            });

            it("moves fluid into the pipe with the lowest level", function() {
                pressureSolver.redistributePressure(pipes[1], pipes[1].va, 5);
                expect(fluidAdder.add.callCount).toBe(1);
                var args = fluidAdder.add.mostRecentCall.args;
                expect(args[0]).toBe(pipes[1]);
                expect(args[1]).toBe(pipes[1].va);
            });

            describe("when the new level would be lower than the next highest", function() {

                it("moves all of the fluid", function() {
                    pressureSolver.redistributePressure(pipes[1], pipes[1].va, 5);
                    var volume = fluidAdder.add.mostRecentCall.args[2];
                    expect(volume).toBe(5);
                });

                it("doesn't put any pipe over capacity", function() {
                    spyOn(metrics, 'getAvailableCapacity').andReturn(2);
                    pressureSolver.redistributePressure(pipes[1], pipes[1].va, 5);
                    var volume = fluidAdder.add.calls[0].args[2];
                    expect(volume).toBe(2);
                });
            });

            describe("when the new level would be higher than the next highest", function() {

                beforeEach(function() {
                    spyOn(pressureSolver, 'getVolumeNeededToReachLevel').andReturn(3.3);
                    pressureSolver.redistributePressure(pipes[1], pipes[1].va, 20);
                })

                it("matches the level of the next highest fluid", function() {
                    var nextLevel = metrics.getFluidLevel(pipes[3], pipes[3].va);
                    expect(pressureSolver.getVolumeNeededToReachLevel).toHaveBeenCalledWith(
                            pipes[1],
                            pipes[1].va,
                            nextLevel
                        );
                    var volume = fluidAdder.add.calls[0].args[2];
                    expect(volume).toBe(3.3);
                });
            });

            describe("when that pipe is full", function() {

                beforeEach(function() {
                    pipes[3].fluids[0].volume = pipes[3].capacity;
                    var pressure = metrics.getAvailableCapacity(pipes[1]) + 3;
                    spyOn(pressureSolver, 'redistributePressure').andCallThrough();
                    pressureSolver.redistributePressure(pipes[1], pipes[1].va, pressure);
                });

                it("calls redistributePressure again with the remaining pressure", function() {
                    expect(pressureSolver.redistributePressure).toHaveBeenCalledWith(pipes[1], pipes[1].va, 3);
                });
            });

            describe("when there are multiple pipes with the lowest fluid level", function() {

                var originalLevelA,
                    originalLevelB;

                beforeEach(function() {
                    var nextLevel = metrics.getFluidLevel(pipes[3], pipes[3].va);
                    var volume = pressureSolver.getVolumeNeededToReachLevel(pipes[1], pipes[1].va, nextLevel);
                    pipes[1].fluids[0].volume += volume;
                    originalLevelA = metrics.getFluidLevel(pipes[1], pipes[1].va);
                    originalLevelB = metrics.getFluidLevel(pipes[3], pipes[3].va);
                    fluidAdder.add.andCallThrough();
                    pressureSolver.redistributePressure(pipes[1], pipes[1].va, 1);
                });

                it("distributes the fluid so that they reach the same level", function() {
                    var levelA = metrics.getFluidLevel(pipes[1], pipes[1].va);
                    var levelB = metrics.getFluidLevel(pipes[3], pipes[3].va);
                    expect(levelA).not.toBe(originalLevelA);
                    expect(levelB).not.toBe(originalLevelB);
                    expect(levelA).toBeCloseTo(levelB);
                });

                // also test when they are pointing in different directions

                // also test they match the next level

            });
        });
    });

    describe("when solve is called", function() {

        beforeEach(function() {
            metrics.start();
            spyOn(pressureSolver, 'removePressureInPipeAtVertex').andReturn(5);
            spyOn(pressureSolver, 'redistributePressure');
            pressureSolver.solve(pipes[0], pipes[0].vb);
        });

        it("removes the pressure from the pipe", function() {
            expect(pressureSolver.removePressureInPipeAtVertex).toHaveBeenCalledWith(pipes[0], pipes[0].vb)
        });

        it("calls redistributePressure", function() {
            expect(pressureSolver.redistributePressure).toHaveBeenCalledWith(pipes[0], pipes[0].vb, 5);
        });
    });
});