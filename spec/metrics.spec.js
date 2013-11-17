// Rename resistance to slope

describe("a Metrics", function() {
    var metrics,
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

        metrics = VoronoiDrip.FluidNetworkSimulation.Metrics.create({
            pipes: pipes,
            gravity: 0.1
        });
    });

    it("getAngle should return the angle clockwise from the given point", function() {
        var pipe = {va: {x: 0, y: 0}};

        // 0˚
        pipe.vb = {x: 0, y: -1};
        expect(
            metrics.getAngle(pipe, pipe.va)
        ).toBe(0);

        // 90˚
        pipe.vb = {x: 1, y: 0};
        expect(
            metrics.getAngle(pipe, pipe.va)
        ).toBe(Math.PI / 2);

        // 180˚
        pipe.vb = {x: 0, y: 1};
        expect(
            metrics.getAngle(pipe, pipe.va)
        ).toBe(Math.PI);

        // 270˚
        pipe.vb = {x: -1, y: 0};
        expect(
            metrics.getAngle(pipe, pipe.va)
        ).toBe((Math.PI * 3) / 2);

        // Other point

        // 180˚
        pipe.vb = {x: 0, y: -1};
        expect(
            metrics.getAngle(pipe, pipe.vb)
        ).toBe(Math.PI);

        // 270˚
        pipe.vb = {x: 1, y: 0};
        expect(
            metrics.getAngle(pipe, pipe.vb)
        ).toBe((Math.PI * 3) / 2);

        // 0˚
        pipe.vb = {x: 0, y: 1};
        expect(
            metrics.getAngle(pipe, pipe.vb)
        ).toBe(0);

        // 90˚
        pipe.vb = {x: -1, y: 0};
        expect(
            metrics.getAngle(pipe, pipe.vb)
        ).toBe(Math.PI / 2);
    });

    it("getLength should return length of the pipe", function() {
        var pipe = {va: {x: 0, y: 0}};

        pipe.vb = {x: 0, y: -1};
        expect(metrics.getLength(pipe)).toBe(1);

        pipe.vb = {x: 2, y: 2};
        expect(round2dp(
            metrics.getLength(pipe)
        )).toBe(2.83);

        pipe.vb = {x: -3, y: 1};
        expect(round2dp(
            metrics.getLength(pipe)
        )).toBe(3.16);

        pipe.va = {x: 1, y: -1};
        pipe.vb = {x: -3, y: 1};
        expect(round2dp(
            metrics.getLength(pipe)
        )).toBe(4.47);
    });

    it("calculateIncline should calculate an incline from 0 to 1 regardless of direction", function() {
        // 90˚
        expect(round2dp(
            metrics.calculateIncline( Math.PI * (1/2) )
        )).toBe(0);

        // 112.5˚
        expect(round2dp(
            metrics.calculateIncline( Math.PI * (5/8) )
        )).toBe(0.25);

        // 135˚
        expect(round2dp(
            metrics.calculateIncline( Math.PI * (3/4) )
        )).toBe(0.5);

        // 180˚
        expect(round2dp(
            metrics.calculateIncline( Math.PI )
        )).toBe(1);

        // 225˚
        expect(round2dp(
            metrics.calculateIncline( Math.PI * (5/4) )
        )).toBe(0.5);

        // 247.5˚
        expect(round2dp(
            metrics.calculateIncline( Math.PI * (11/8) )
        )).toBe(0.25);

        // 270˚
        expect(round2dp(
            metrics.calculateIncline( Math.PI * (3/2) )
        )).toBe(0);
    });

    describe("when start is called", function() {

        beforeEach(function() {
            metrics.start();
        });

        it("sets the incline of all pipes from the va vertex", function() {
            expect(metrics.pipes[0].incline).toBe(1);
            expect(metrics.pipes[1].incline).toBe(-0.5);
            expect(metrics.pipes[2].incline).toBe(0);
            expect(metrics.pipes[3].incline).toBe(-1);
            expect(metrics.pipes[4].incline).toBe(0.5);
        });

        it("sets the capacity of all pipes", function() {
            expect(metrics.pipes[0].capacity).toBe(10);
            expect(round3dp(metrics.pipes[1].capacity)).toBe(14.142);
            expect(metrics.pipes[2].capacity).toBe(20);
            expect(metrics.pipes[3].capacity).toBe(30);
            expect(round3dp(metrics.pipes[4].capacity)).toBe(14.142);
        });

        it("calculates the resistance to entry at each vertex as a factor of gravity and incline", function() {
            expect(metrics.pipes[0].ra).toBe(0);
            expect(metrics.pipes[0].rb).toBe(0.1);
            expect(round3dp(metrics.pipes[1].ra)).toBe(0.075);
            expect(metrics.pipes[1].rb).toBe(0.025);
            expect(metrics.pipes[2].ra).toBe(0.05);
            expect(metrics.pipes[2].rb).toBe(0.05);
        });
    });

    describe("when getFluidVelocity is called", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = {
                volume: 1,
                position: 0
            };
            pipes[1].fluids = {
                volume: 1,
                position: pipes[1].capacity - 1
            };
            pipes[2].fluids = {
                volume: 1,
                position: 0
            };
        });

        it("calculates the velocity for a pipe's fluid as a factor of incline (friction), relative to the A vertex", function() {
            metrics.gravity = 1;
            expect(metrics.getFluidVelocity(metrics.pipes[0], metrics.pipes[0].fluids[0])).toBe(1);
            expect(metrics.getFluidVelocity(metrics.pipes[1], metrics.pipes[1].fluids[0])).toBe(-0.5);
            expect(metrics.getFluidVelocity(metrics.pipes[2], metrics.pipes[2].fluids[0])).toBe(0);
        });

        it("calculates the velocity for a pipe's fluid as a factor of gravity", function() {
            expect(metrics.getFluidVelocity(metrics.pipes[0], metrics.pipes[0].fluids[0])).toBe(0.1);
            expect(metrics.getFluidVelocity(metrics.pipes[1], metrics.pipes[1].fluids[0])).toBe(-0.05);
            expect(metrics.getFluidVelocity(metrics.pipes[2], metrics.pipes[2].fluids[0])).toBe(0);
        });
    });

    describe("when getFluidAtVertex is called", function() {

        beforeEach(function() {
            metrics.start();
            metrics.pipes[0].fluids = [{
                volume: metrics.getLength(metrics.pipes[0]),
                position: 0
            }];
            metrics.pipes[1].fluids = [{
                volume: 6,
                position: 0
            }];
            metrics.pipes[2].fluids = [{
                volume: 6,
                position: metrics.getLength(metrics.pipes[2]) - 6
            }];
        });

        describe("for vertex A", function() {

            it("returns the fluid when the pipe is full", function() {
                expect(metrics.getFluidAtVertex(metrics.pipes[0], metrics.pipes[0].va)).toBe(metrics.pipes[0].fluids[0]);
            });

            it("returns the fluid touching vertex A", function() {
                expect(metrics.getFluidAtVertex(metrics.pipes[1], metrics.pipes[1].va)).toBe(metrics.pipes[1].fluids[0]);
            });

            it("doesn't return the fluid touching vertex B", function() {
                expect(metrics.getFluidAtVertex(metrics.pipes[2], metrics.pipes[2].va)).toBe(undefined);
            });
        });

        describe("for vertex B", function() {

            it("returns the fluid when the pipe is full", function() {
                expect(metrics.getFluidAtVertex(metrics.pipes[0], metrics.pipes[0].vb)).toBe(metrics.pipes[0].fluids[0]);
            });

            it("returns the fluid touching vertex B", function() {
                expect(metrics.getFluidAtVertex(metrics.pipes[2], metrics.pipes[2].vb)).toBe(metrics.pipes[2].fluids[0]);
            });

            it("doesn't return the fluid touching vertex A", function() {
                expect(metrics.getFluidAtVertex(metrics.pipes[1], metrics.pipes[1].vb)).toBe(undefined);
            });
        });
    });


    describe("when getAvailableCapacity is called", function() {

        beforeEach(function() {
            metrics.start();
        });

        describe("with a pipe containing no fluid", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[0].fluids = [];
            });

            it("returns the pipe's capacity", function() {
                expect(metrics.getAvailableCapacity(metrics.pipes[0])).toBe(metrics.pipes[0].capacity);
                expect(metrics.getAvailableCapacity(metrics.pipes[1])).toBe(metrics.pipes[1].capacity);
            });
        });

        describe("with a pipe containing one fluid", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[0].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the available capacity", function() {
                expect(metrics.getAvailableCapacity(metrics.pipes[0])).toBe(metrics.pipes[0].capacity - 3);
            });
        });

        describe("with a pipe containing multiple fluids", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[0].fluids = [{
                    volume: 3,
                    position: 0
                },{
                    volume: 0.7,
                    position: 5
                },{
                    volume: 1,
                    position: 8
                }];
            });

            it("returns the available capacity", function() {
                expect(metrics.getAvailableCapacity(metrics.pipes[0])).toBe(metrics.pipes[0].capacity - 4.7);
            });
        });

        describe("with a full pipe", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[0].fluids = [{
                    volume: metrics.pipes[0].capacity,
                    position: 0
                }];
            });

            it("returns 0", function() {
                expect(metrics.getAvailableCapacity(metrics.pipes[0])).toBe(0);
            });
        });

        describe("with a pipe containing fluid that overlaps at vertexB, but is not full", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[0].fluids = [{
                    volume: metrics.pipes[0].capacity + 10,
                    position: 5
                }];
            });

            it("returns the available capacity without overlap", function() {
                expect(metrics.getAvailableCapacity(metrics.pipes[0])).toBe(metrics.pipes[0].capacity - 5);
            });
        });

        describe("with a pipe containing fluid that overlaps at vertexA, but is not full", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[0].fluids = [{
                    volume: metrics.pipes[0].capacity + 10,
                    position: metrics.pipes[0].capacity - 5
                }];
            });

            it("returns the available capacity without overlap", function() {
                expect(metrics.getAvailableCapacity(metrics.pipes[0])).toBe(metrics.pipes[0].capacity - 5);
            });
        });

        describe("with a pipe containing fluid that overlaps at both vertices", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[0].fluids = [{
                    volume: metrics.pipes[0].capacity + 10,
                    position: -5
                }];
            });

            it("returns 0", function() {
                expect(metrics.getAvailableCapacity(metrics.pipes[0])).toBe(0);
            });
        });
    });

    describe("when hasCapacity is called", function() {

        var availableSpy;

        beforeEach(function() {
            availableSpy = spyOn(metrics, 'getAvailableCapacity');
        });

        it("gets the pipe's available capacity", function() {
            metrics.hasCapacity(pipes[3]);
            expect(availableSpy).toHaveBeenCalledWith(pipes[3]);
        });

        it("returns true when the pipe has the minumum available", function() {
            availableSpy.andReturn(VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME);
            expect(metrics.hasCapacity(pipes[3])).toBe(true);
        });

        it("returns false when the pipe has less available than the minumum", function() {
            availableSpy.andReturn(VoronoiDrip.FluidNetworkSimulation.MINIMUM_FLUID_VOLUME * 0.9);
            expect(metrics.hasCapacity(pipes[3])).toBe(false);
        });

    });

    describe("when getFluidLevel is called", function() {

        describe("when the pipe has fluid at the vertex", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the level of the fluid at the vertex in relation to the pipe's position", function() {
                // Pipe is at 45' with volume of 3 = ~ 2.12132034355965
                // subtract from y position of 20
                var level = metrics.getFluidLevel(metrics.pipes[1], metrics.pipes[1].va);
                expect(level).toBeCloseTo(20 - 2.12132034355965);
            });
        });

        describe("when the pipe has fluid at the vertex pointing down", function() {

            beforeEach(function() {
                metrics.start();
                metrics.pipes[1].fluids = [{
                    volume: 3,
                    position: metrics.pipes[1].capacity - 3
                }];
            });

            it("returns the level of the fluid at the vertex in relation to the pipe's position", function() {
                // Pipe is at 45' with volume of 3 = ~ 2.12132034355965
                // add to from y position of 10
                var level = metrics.getFluidLevel(metrics.pipes[1], metrics.pipes[1].vb);
                expect(level).toBeCloseTo(10 + 2.12132034355965);
            });
        });

        describe("when the pipe doesn't have fluid at the vertex", function() {

            beforeEach(function() {
                metrics.start();
            });

            it("returns the level of the vertex", function() {
                var level = metrics.getFluidLevel(metrics.pipes[1], metrics.pipes[1].va);
                expect(level).toBe(20);
            });
        });
    });

    describe("when getVertexPipes is called", function() {

        it("gets the connected pipes", function() {
            spyOn(metrics, 'getConnectedPipes').andCallThrough();
            metrics.getVertexPipes(pipes[0], pipes[0].vb);
            expect(metrics.getConnectedPipes).toHaveBeenCalledWith(pipes[0], pipes[0].vb);
        });

        it("returns the connected pipes and the seed pipe", function() {
            spyOn(metrics, 'getConnectedPipes').andReturn([
                pipes[1],
                pipes[2],
                pipes[4],
            ]);
            var vertexPipes = metrics.getVertexPipes(pipes[0], pipes[0].vb);
            expect(vertexPipes.length).toBe(4);
            expect(vertexPipes).toContain(pipes[0]);
            expect(vertexPipes).toContain(pipes[1]);
            expect(vertexPipes).toContain(pipes[2]);
            expect(vertexPipes).toContain(pipes[4]);

        });

    });
});