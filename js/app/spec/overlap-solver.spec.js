define(['app/fluid-network-simulation', 'app/metrics', 'app/overlap-solver'], function(FluidNetworkSimulation, Metrics, OverlapSolver) {
    describe("a Overlap Solver", function() {
        var overlapSolver,
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
            overlapSolver = OverlapSolver.create({
                pipes: pipes,
                metrics: metrics
            });
            metrics.start();
        });

        it("getOverlap returns the ammount of overlap between two fluids", function() {
            expect(
                overlapSolver.getOverlap({
                    volume: 5,
                    position: 0
                },{
                    volume: 2,
                    position: 4
                })
            ).toBe(1);

            expect(
                overlapSolver.getOverlap({
                    volume: 5,
                    position: -1
                },{
                    volume: 2,
                    position: 2
                })
            ).toBe(2);

            expect(
                overlapSolver.getOverlap({
                    volume: 5,
                    position: 0
                },{
                    volume: 2,
                    position: 6
                })
            ).toBe(-1);

            expect(
                overlapSolver.getOverlap({
                    volume: 3,
                    position: 3
                },{
                    volume: 8,
                    position: 1
                })
            ).toBe(3);
        });

        describe("when solve is called", function() {

            describe("and fluids overlap", function() {

                beforeEach(function() {
                    pipes[0].fluids = [{
                        volume: 5,
                        position: 0
                    },{
                        volume: 5,
                        position: 4
                    }];
                    overlapSolver.solve(pipes[0]);
                });

                it("combines the fluids into one", function() {
                    expect(pipes[0].fluids.length).toEqual(1);
                });

                it("combines the volumes", function() {
                    expect(pipes[0].fluids[0].volume).toEqual(10);
                });

                it("uses the lowest position", function() {
                    expect(pipes[0].fluids[0].position).toEqual(0);
                });
            });

            describe("and are nearly overlapping", function() {

                beforeEach(function() {
                    pipes[0].fluids = [{
                        volume: 5,
                        position: 0
                    },{
                        volume: 5,
                        position: 5 + metrics.MINIMUM_FLUID_VOLUME
                    }];
                    overlapSolver.solve(pipes[0]);
                });

                it("combines the fluids into one", function() {
                    expect(pipes[0].fluids.length).toEqual(1);
                });

                it("combines the volumes", function() {
                    expect(pipes[0].fluids[0].volume).toEqual(10);
                });

                it("uses the lowest position", function() {
                    expect(pipes[0].fluids[0].position).toEqual(0);
                });
            });

            describe("when fluids overlap from movement", function() {

                describe("and the most recent fluid is at the A vertex", function() {

                    beforeEach(function() {
                        pipes[0].fluids = [{
                            volume: 5,
                            position: 0
                        },{
                            volume: 2,
                            position: 0,
                            movedBy: 2
                        }];
                        overlapSolver.solve(pipes[0]);
                    });

                    it("combines the fluids into one", function() {
                        expect(pipes[0].fluids.length).toEqual(1);
                    });

                    it("combines the volumes", function() {
                        expect(pipes[0].fluids[0].volume).toEqual(7);
                    });

                    it("pushes the fluid along by the volume", function() {
                        expect(pipes[0].fluids[0].position).toEqual(0);
                    });
                });

                describe("and the most recent fluid is at the B vertex", function() {

                    beforeEach(function() {
                        pipes[0].fluids = [{
                            volume: 5,
                            position: 5
                        },{
                            volume: 2,
                            position: pipes[0].capacity - 2,
                            movedBy: -2
                        }];
                        overlapSolver.solve(pipes[0]);
                    });

                    it("combines the fluids into one", function() {
                        expect(pipes[0].fluids.length).toEqual(1);
                    });

                    it("combines the volumes", function() {
                        expect(pipes[0].fluids[0].volume).toEqual(7);
                    });

                    it("pushes the fluid along by the volume", function() {
                        expect(pipes[0].fluids[0].position).toEqual(3);
                    });
                });

                describe("and put the pipe over capacity", function() {

                    describe("and the most recent fluid is at the A vertex", function() {

                        beforeEach(function() {
                            pipes[0].fluids = [{
                                volume: 9,
                                position: 0
                            },{
                                volume: 2,
                                position: 0,
                                movedBy: 2
                            }];
                            overlapSolver.solve(pipes[0]);
                        });

                        it("combines the fluids into one", function() {
                            expect(pipes[0].fluids.length).toEqual(1);
                        });

                        it("combines the volumes", function() {
                            expect(pipes[0].fluids[0].volume).toEqual(11);
                        });

                        it("pushes the fluid along by the volume", function() {
                            expect(pipes[0].fluids[0].position).toEqual(0);
                        });
                    });

                    describe("and the most recent fluid is at the B vertex", function() {

                        beforeEach(function() {
                            pipes[0].fluids = [{
                                volume: 9,
                                position: 1
                            },{
                                volume: 2,
                                position: pipes[0].capacity - 2,
                                movedBy: -2
                            }];
                            overlapSolver.solve(pipes[0]);
                        });

                        it("combines the fluids into one", function() {
                            expect(pipes[0].fluids.length).toEqual(1);
                        });

                        it("combines the volumes", function() {
                            expect(pipes[0].fluids[0].volume).toEqual(11);
                        });

                        it("pushes the fluid along by the volume", function() {
                            expect(pipes[0].fluids[0].position).toEqual(-1);
                        });
                    });
                });

                describe("and put the pipe over capacity, one of which has more volume than the capacity", function() {

                    describe("and the most recent fluid is at the A vertex", function() {

                        beforeEach(function() {
                            pipes[0].fluids = [{
                                volume: 12,
                                position: -1
                            },{
                                volume: 2,
                                position: 0,
                                movedBy: 2
                            }];
                            overlapSolver.solve(pipes[0]);
                        });

                        it("combines the fluids into one", function() {
                            expect(pipes[0].fluids.length).toEqual(1);
                        });

                        it("combines the volumes", function() {
                            expect(pipes[0].fluids[0].volume).toEqual(14);
                        });

                        it("pushes the fluid along by the volume", function() {
                            expect(pipes[0].fluids[0].position).toEqual(-1);
                        });
                    });

                    describe("and the most recent fluid is at the B vertex", function() {

                        beforeEach(function() {
                            pipes[0].fluids = [{
                                volume: 12,
                                position: -1
                            },{
                                volume: 2,
                                position: pipes[0].capacity - 2,
                                movedBy: -2
                            }];
                            overlapSolver.solve(pipes[0]);
                        });

                        it("combines the fluids into one", function() {
                            expect(pipes[0].fluids.length).toEqual(1);
                        });

                        it("combines the volumes", function() {
                            expect(pipes[0].fluids[0].volume).toEqual(14);
                        });

                        it("pushes the fluid along by the volume", function() {
                            expect(pipes[0].fluids[0].position).toEqual(-1 - 2);
                        });
                    });
                });

                describe("and the combined fluid collides with existing fluid", function() {

                    describe("and the most recent fluid is at the A vertex", function() {

                        beforeEach(function() {
                            pipes[0].fluids = [{
                                volume: 5,
                                position: 0
                            },{
                                volume: 1,
                                position: 6
                            },{
                                volume: 2,
                                position: 0,
                                movedBy: 2
                            }];
                            overlapSolver.solve(pipes[0]);
                        });

                        it("combines the fluids into one", function() {
                            expect(pipes[0].fluids.length).toEqual(1);
                        });

                        it("combines the volumes", function() {
                            expect(pipes[0].fluids[0].volume).toEqual(8);
                        });

                        it("pushes the fluid along by the volume", function() {
                            expect(pipes[0].fluids[0].position).toEqual(0);
                        });
                    });

                    describe("and the most recent fluid is at the B vertex", function() {

                        beforeEach(function() {
                            pipes[0].fluids = [{
                                volume: 5,
                                position: 5
                            },{
                                volume: 1,
                                position: 3
                            },{
                                volume: 2,
                                position: pipes[0].capacity - 2,
                                movedBy: -2
                            }];
                            overlapSolver.solve(pipes[0]);
                        });

                        it("combines the fluids into one", function() {
                            expect(pipes[0].fluids.length).toEqual(1);
                        });

                        it("combines the volumes", function() {
                            expect(pipes[0].fluids[0].volume).toEqual(8);
                        });

                        it("pushes the fluid along by the volume", function() {
                            expect(pipes[0].fluids[0].position).toEqual(2);
                        });
                    });
                });
            });
        });
    });
});