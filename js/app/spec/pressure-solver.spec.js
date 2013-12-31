define(['app/fluid-network-simulation', 'app/metrics', 'app/fluid-adder', 'app/target-calculator', 'app/pressure-solver'], function(FluidNetworkSimulation, Metrics, FluidAdder, TargetCalculator, PressureSolver) {

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

            metrics = Metrics.create({
                pipes: pipes,
                gravity: 0.1,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            overlapSolver = {
                solve: function() {}
            };
            fluidAdder = FluidAdder.create({
                pipes: pipes,
                metrics: metrics,
                overlapSolver: overlapSolver,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            targetCalculator = TargetCalculator.create({
                pipes: pipes,
                metrics: metrics,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
            });
            pressureSolver = PressureSolver.create({
                pipes: pipes,
                metrics: metrics,
                fluidAdder: fluidAdder,
                targetCalculator: targetCalculator,
                MINIMUM_FLUID_VOLUME: FluidNetworkSimulation.MINIMUM_FLUID_VOLUME
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

        describe("when findDownwardPointingTarget is called", function() {

            beforeEach(function() {
                metrics.start();
            });

            it("returns the downward pointing target when there is one", function() {
                var targets = [{
                    pipe: pipes[0],
                    vertex: pipes[0].vb
                },{
                    pipe: pipes[1],
                    vertex: pipes[1].vb
                }];
                var target = pressureSolver.findDownwardPointingTarget(targets);
                expect(target).toBe(targets[1]);
            });

            it("returns false when there is none", function() {
                var targets = [{
                    pipe: pipes[0],
                    vertex: pipes[0].vb
                },{
                    pipe: pipes[1],
                    vertex: pipes[1].va
                }];
                var target = pressureSolver.findDownwardPointingTarget(targets);
                expect(target).toBe(false);
            });

            it("returns the most downward pointing when there are many", function() {
                var targets = [{
                    pipe: pipes[0],
                    vertex: pipes[0].vb
                },{
                    pipe: pipes[2],
                    vertex: pipes[2].va
                },{
                    pipe: pipes[1],
                    vertex: pipes[1].vb
                }];
                var target = pressureSolver.findDownwardPointingTarget(targets);
                expect(target).toBe(targets[2]);
            })
        });

        describe("when findLowestLevelTargets is called", function() {

            var addLevelSpy;

            beforeEach(function() {
                addLevelSpy = spyOn(pressureSolver, 'addFluidLevel').andCallFake(function(target) {
                    return target;
                });
            })

            it("adds the fluid level for each target", function() {
                var targets = ['A', 'B'];
                pressureSolver.findLowestLevelTargets(targets);
                expect(addLevelSpy.callCount).toBe(2);
                expect(addLevelSpy.calls[0].args[0]).toBe('A');
                expect(addLevelSpy.calls[1].args[0]).toBe('B');
            });

            it("returns the target with the lowest fluid level", function() {
                var targets = [{
                    level: 2
                },{
                    level: 10
                },{
                    level: 5
                }];
                var sameLevelTargets = pressureSolver.findLowestLevelTargets(targets);
                expect(sameLevelTargets.targets.length).toBe(1);
                expect(sameLevelTargets.targets).toContain(targets[1]);
            });

            it("returns targets with the same level as the lowest", function() {
                var targets = [{
                    level: 2
                },{
                    level: 10
                },{
                    level: 5
                },{
                    level: 10
                }];
                var sameLevelTargets = pressureSolver.findLowestLevelTargets(targets);
                expect(sameLevelTargets.targets.length).toBe(2);
                expect(sameLevelTargets.targets).toContain(targets[1]);
                expect(sameLevelTargets.targets).toContain(targets[3]);
            });

            it("returns the next highest level", function() {
                var targets = [{
                    level: 2
                },{
                    level: 10
                },{
                    level: 5
                }];
                var sameLevelTargets = pressureSolver.findLowestLevelTargets(targets);
                expect(sameLevelTargets.nextHighestLevel).toBe(5);
            });
        });

        describe("when getDistributionTargets is called", function() {
            var targets,
                lowestLevelTargets,
                targetsSpy,
                lowestLevelSpy,
                downwardPointingSpy;

            beforeEach(function() {
                targets = [{
                    pipe: pipes[3],
                    vertex: pipes[3].va
                },{
                    pipe: pipes[1],
                    vertex: pipes[1].va
                }];
                lowestLevelTargets = {
                    targets: [{
                        pipe: pipes[3],
                        vertex: pipes[3].va,
                    }],
                    nextHighestLevel: 5
                };
                targetsSpy = spyOn(targetCalculator, 'getForVertex').andReturn(targets);
                lowestLevelSpy = spyOn(pressureSolver, 'findLowestLevelTargets').andReturn(lowestLevelTargets);
                downwardPointingSpy = spyOn(pressureSolver, 'findDownwardPointingTarget');
            });

            it("gets targets from the target calculator", function() {
                pressureSolver.getDistributionTargets(pipes[1], pipes[1].va);
                expect(targetsSpy).toHaveBeenCalledWith(pipes[1], pipes[1].va);
            });

            it("passes them to findLowestLevelTargets", function() {
                pressureSolver.getDistributionTargets(pipes[1], pipes[1].va);
                expect(lowestLevelSpy).toHaveBeenCalledWith(targets);
            });

            it("passes the lowest level targets to findDownwardPointingTarget", function() {
                pressureSolver.getDistributionTargets(pipes[1], pipes[1].va);
                expect(downwardPointingSpy).toHaveBeenCalledWith(lowestLevelTargets.targets);
            });

            describe("when there is a downward pointing target", function() {

                beforeEach(function() {
                    downwardPointingSpy.andReturn(targets[0]);
                });

                it("returns it", function() {
                    var result = pressureSolver.getDistributionTargets(pipes[1], pipes[1].va);
                    expect(result.targets.length).toBe(1);
                    expect(result.targets).toContain(targets[0]);
                });

                it("returns the next highest level", function() {
                    var result = pressureSolver.getDistributionTargets(pipes[1], pipes[1].va);
                    expect(result.nextHighestLevel).toBe(5);
                });
            });

            describe("when there isn't a downward pointing target", function() {

                beforeEach(function() {
                    downwardPointingSpy.andReturn(false);
                });

                it("returns the lowest level targets", function() {
                    var result = pressureSolver.getDistributionTargets(pipes[1], pipes[1].va);
                    expect(result.targets).toBe(lowestLevelTargets.targets);
                });

                it("returns the next highest level", function() {
                    var result = pressureSolver.getDistributionTargets(pipes[1], pipes[1].va);
                    expect(result.nextHighestLevel).toBe(5);
                });
            });


        });

        describe("when redistributePressure is called", function() {

            var targetsSpy,
                distributionSpy,
                vertex;

            beforeEach(function() {
                metrics.start();
                vertex = pipes[1].va;
                targetsSpy = spyOn(targetCalculator, 'getForVertex').andReturn([{
                    pipe: pipes[3],
                    vertex: pipes[3].va,
                    highestVertex: pipes[3].va
                },{
                    pipe: pipes[1],
                    vertex: pipes[1].va,
                    highestVertex: pipes[1].va
                }]);
                spyOn(fluidAdder, 'add');
                distributionSpy = spyOn(pressureSolver, 'getDistributionTargets').andCallThrough();
            });

            it("gets targets from getDistributionTargets", function() {
                pressureSolver.redistributePressure(pipes[1], pipes[1].va, 5);
                expect(distributionSpy).toHaveBeenCalledWith(pipes[1], pipes[1].va);
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

                describe("when there are multiple pipes with the lowest fluid level, within the range of the minimum", function() {

                    var originalLevelA,
                        originalLevelB;

                    beforeEach(function() {
                        var nextLevel = metrics.getFluidLevel(pipes[3], pipes[3].va);
                        var volume = pressureSolver.getVolumeNeededToReachLevel(pipes[1], pipes[1].va, nextLevel);
                        pipes[1].fluids[0].volume += volume + (FluidNetworkSimulation.MINIMUM_FLUID_VOLUME / 2);
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
});