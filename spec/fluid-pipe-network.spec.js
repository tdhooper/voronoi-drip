// Rename resistance to slope

describe("a Fluid Pipe Network", function() {
    var fpn,
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

        fpn = vd.createFluidPipeNetwork({
            pipes: pipes,
            gravity: 0.1
        });
    });

    it("should set a default gravity", function() {
        fpn = vd.createFluidPipeNetwork({
            pipes: []
        });
        expect(fpn.gravity).toBe(0.1);
    })

    it("getAngle should return the angle clockwise from the given point", function() {
        var pipe = {va: {x: 0, y: 0}};

        // 0˚
        pipe.vb = {x: 0, y: -1};
        expect(
            fpn.getAngle(pipe, pipe.va)
        ).toBe(0);

        // 90˚
        pipe.vb = {x: 1, y: 0};
        expect(
            fpn.getAngle(pipe, pipe.va)
        ).toBe(Math.PI / 2);

        // 180˚
        pipe.vb = {x: 0, y: 1};
        expect(
            fpn.getAngle(pipe, pipe.va)
        ).toBe(Math.PI);

        // 270˚
        pipe.vb = {x: -1, y: 0};
        expect(
            fpn.getAngle(pipe, pipe.va)
        ).toBe((Math.PI * 3) / 2);

        // Other point

        // 180˚
        pipe.vb = {x: 0, y: -1};
        expect(
            fpn.getAngle(pipe, pipe.vb)
        ).toBe(Math.PI);

        // 270˚
        pipe.vb = {x: 1, y: 0};
        expect(
            fpn.getAngle(pipe, pipe.vb)
        ).toBe((Math.PI * 3) / 2);

        // 0˚
        pipe.vb = {x: 0, y: 1};
        expect(
            fpn.getAngle(pipe, pipe.vb)
        ).toBe(0);

        // 90˚
        pipe.vb = {x: -1, y: 0};
        expect(
            fpn.getAngle(pipe, pipe.vb)
        ).toBe(Math.PI / 2);
    });

    it("getLength should return length of the pipe", function() {
        var pipe = {va: {x: 0, y: 0}};

        pipe.vb = {x: 0, y: -1};
        expect(fpn.getLength(pipe)).toBe(1);

        pipe.vb = {x: 2, y: 2};
        expect(round2dp(
            fpn.getLength(pipe)
        )).toBe(2.83);

        pipe.vb = {x: -3, y: 1};
        expect(round2dp(
            fpn.getLength(pipe)
        )).toBe(3.16);

        pipe.va = {x: 1, y: -1};
        pipe.vb = {x: -3, y: 1};
        expect(round2dp(
            fpn.getLength(pipe)
        )).toBe(4.47);
    });

    it("calculateIncline should calculate an incline from 0 to 1 regardless of direction", function() {
        // 90˚
        expect(round2dp(
            fpn.calculateIncline( Math.PI * (1/2) )
        )).toBe(0);

        // 112.5˚
        expect(round2dp(
            fpn.calculateIncline( Math.PI * (5/8) )
        )).toBe(0.25);

        // 135˚
        expect(round2dp(
            fpn.calculateIncline( Math.PI * (3/4) )
        )).toBe(0.5);

        // 180˚
        expect(round2dp(
            fpn.calculateIncline( Math.PI )
        )).toBe(1);

        // 225˚
        expect(round2dp(
            fpn.calculateIncline( Math.PI * (5/4) )
        )).toBe(0.5);

        // 247.5˚
        expect(round2dp(
            fpn.calculateIncline( Math.PI * (11/8) )
        )).toBe(0.25);

        // 270˚
        expect(round2dp(
            fpn.calculateIncline( Math.PI * (3/2) )
        )).toBe(0);
    });

    it("getOverlap returns the ammount of overlap between two fluids", function() {
        expect(
            fpn.getOverlap({
                volume: 5,
                position: 0
            },{
                volume: 2,
                position: 4
            })
        ).toBe(1);

        expect(
            fpn.getOverlap({
                volume: 5,
                position: -1
            },{
                volume: 2,
                position: 2
            })
        ).toBe(2);

        expect(
            fpn.getOverlap({
                volume: 5,
                position: 0
            },{
                volume: 2,
                position: 6
            })
        ).toBe(-1);

        expect(
            fpn.getOverlap({
                volume: 3,
                position: 3
            },{
                volume: 8,
                position: 1
            })
        ).toBe(3);
    });

    describe("when setMetrics is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
        });

        it("sets the incline of all pipes from the va vertex", function() {
            expect(fpn.pipes[0].incline).toBe(1);
            expect(fpn.pipes[1].incline).toBe(-0.5);
            expect(fpn.pipes[2].incline).toBe(0);
            expect(fpn.pipes[3].incline).toBe(-1);
            expect(fpn.pipes[4].incline).toBe(0.5);
        });

        it("sets the capacity of all pipes", function() {
            expect(fpn.pipes[0].capacity).toBe(10);
            expect(round3dp(fpn.pipes[1].capacity)).toBe(14.142);
            expect(fpn.pipes[2].capacity).toBe(20);
            expect(fpn.pipes[3].capacity).toBe(30);
            expect(round3dp(fpn.pipes[4].capacity)).toBe(14.142);
        });

        it("calculates the resistance to entry at each vertex as a factor of gravity and incline", function() {
            expect(fpn.pipes[0].ra).toBe(0);
            expect(fpn.pipes[0].rb).toBe(0.1);
            expect(round3dp(fpn.pipes[1].ra)).toBe(0.075);
            expect(fpn.pipes[1].rb).toBe(0.025);
            expect(fpn.pipes[2].ra).toBe(0.05);
            expect(fpn.pipes[2].rb).toBe(0.05);
        });
    });

    describe("when fluid is added at a pipe's vertex", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.addFluid(fpn.pipes[0], fpn.pipes[0].va, 2);
            fpn.addFluid(fpn.pipes[0], fpn.pipes[0].vb, 3);
            fpn.addFluid(fpn.pipes[1], fpn.pipes[1].vb, 4);
            fpn.addFluid(fpn.pipes[2], fpn.pipes[2].va, 5);
        });

        it("has it's volume stored in the fluids array", function() {
            expect(fpn.pipes[0].fluids[0]).toEqual({
                volume: 2,
                position: 0
            });
            expect(fpn.pipes[0].fluids[1]).toEqual({
                volume: 3,
                position: fpn.pipes[0].capacity - 3
            });
            expect(fpn.pipes[1].fluids[0]).toEqual({
                volume: 4,
                position: fpn.pipes[1].capacity - 4
            });
            expect(fpn.pipes[2].fluids[0]).toEqual({
                volume: 5,
                position: 0
            });
        });
    });

    describe("when new fluid collides with existing fluid", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: 0
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(7);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(fpn.pipes[0].fluids[0].position).toEqual(0);
            });
        });
    });

    describe("when new fluid puts the pipe over capacity", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 9,
                position: 0
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(11);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(fpn.pipes[0].fluids[0].position).toEqual(0);
            });
        });
    });

    describe("when new fluid is added to an already over capacity pipe", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 12,
                position: -1
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(14);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(fpn.pipes[0].fluids[0].position).toEqual(-1);
            });
        });
    });

    describe("when combined fluid collides with existing fluid", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: 0
            },{
                volume: 1,
                position: 6
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(8);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(fpn.pipes[0].fluids[0].position).toEqual(0);
            });
        });
    });

    describe("when new fluid collides with existing fluid", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: 5
            }];
        });

         describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(7);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(round2dp(fpn.pipes[0].fluids[0].position)).toEqual(3);
            });
        });
    });

    describe("when new fluid puts the pipe over capacity", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 9,
                position: 1
            }];
        });

         describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(11);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(fpn.pipes[0].fluids[0].position).toEqual(-1);
            });
        });
    });

    describe("when new fluid is added to an already over capacity pipe", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 12,
                position: -1
            }];
        });

         describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(14);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(fpn.pipes[0].fluids[0].position).toEqual(-1 - 2);
            });
        });
    });

    describe("when combined fluid collides with existing fluid", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: 5
            },{
                volume: 1,
                position: 3
            }];
        });

        describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fpn.addFluid(fpn.pipes[0], fpn.pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(fpn.pipes[0].fluids[0].volume).toEqual(8);
                expect(fpn.pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(fpn.pipes[0].fluids[0].position).toEqual(2);
            });
        });
    });

    describe("when getFluidVelocity is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
        });

        it("calculates the velocity for a pipe's fluid as a factor of incline (friction), relative to the A vertex", function() {
            fpn.gravity = 1;
            fpn.addFluid(fpn.pipes[0], fpn.pipes[0].va, 1);
            fpn.addFluid(fpn.pipes[1], fpn.pipes[1].vb, 1);
            fpn.addFluid(fpn.pipes[2], fpn.pipes[2].va, 1);

            expect(fpn.getFluidVelocity(fpn.pipes[0], fpn.pipes[0].fluids[0])).toBe(1);
            expect(fpn.getFluidVelocity(fpn.pipes[1], fpn.pipes[1].fluids[0])).toBe(-0.5);
            expect(fpn.getFluidVelocity(fpn.pipes[2], fpn.pipes[2].fluids[0])).toBe(0);
        });

        it("calculates the velocity for a pipe's fluid as a factor of gravity", function() {
            fpn.addFluid(fpn.pipes[0], fpn.pipes[0].va, 1);
            fpn.addFluid(fpn.pipes[1], fpn.pipes[1].vb, 1);
            fpn.addFluid(fpn.pipes[2], fpn.pipes[2].va, 1);

            expect(fpn.getFluidVelocity(fpn.pipes[0], fpn.pipes[0].fluids[0])).toBe(0.1);
            expect(fpn.getFluidVelocity(fpn.pipes[1], fpn.pipes[1].fluids[0])).toBe(-0.05);
            expect(fpn.getFluidVelocity(fpn.pipes[2], fpn.pipes[2].fluids[0])).toBe(0);
        });
    });

    describe("when moveFluids is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: 1,
                position: 0
            }];
            fpn.pipes[1].fluids = [{
                volume: 1,
                position: 5
            }];
            fpn.pipes[2].fluids = [{
                volume: 1,
                position: 0
            }];
            spyOn(fpn, 'solvePressureForPipeAtVertex');
            fpn.moveFluids();
        });

        it("moves each fluid by it's velocity", function() {
            expect(fpn.pipes[0].fluids[0].position).toBe(0.1);
            expect(fpn.pipes[1].fluids[0].position).toBe(5 - 0.05);
            expect(fpn.pipes[2].fluids[0].position).toBe(0);
        });

        it("calls solvePressureForPipeAtVertex for each pipe where fluid has moved", function() {
            expect(fpn.solvePressureForPipeAtVertex.callCount).toBe(2);
        });

        it("passes the pipe and the vertex towards which the fluid is moving to solvePressureForPipeAtVertex", function() {
            expect(fpn.solvePressureForPipeAtVertex).toHaveBeenCalledWith(fpn.pipes[0], fpn.pipes[0].vb);
            expect(fpn.solvePressureForPipeAtVertex).toHaveBeenCalledWith(fpn.pipes[1], fpn.pipes[1].va);
        });
    });

    describe("removePressureInPipeAtVertex removes overlap in fluids, updates positions, and returns removed volume", function() {

        beforeEach(function() {
            fpn.setMetrics();
        });

        it("when fluid overlaps at the A vertex", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: -4
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].va);
            expect(fpn.pipes[0].fluids[0].volume).toBe(1);
            expect(fpn.pipes[0].fluids[0].position).toBe(0);
            expect(volumeRemoved).toBe(4);
        });

        it("when fluid overlaps at the B vertex", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: 8
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb);
            expect(fpn.pipes[0].fluids[0].volume).toBe(2);
            expect(fpn.pipes[0].fluids[0].position).toBe(8);
            expect(volumeRemoved).toBe(3);
        });

        it("when fluid overlaps at both vertices (removing at vertex A)", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                volume: 15,
                position: -2
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].va);
            expect(fpn.pipes[0].fluids[0].volume).toBe(13);
            expect(fpn.pipes[0].fluids[0].position).toBe(0);
            expect(volumeRemoved).toBe(2);
        });

        it("when fluid overlaps at both vertices (removing at vertex B)", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                volume: 15,
                position: -2
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb);
            expect(fpn.pipes[0].fluids[0].volume).toBe(12);
            expect(fpn.pipes[0].fluids[0].position).toBe(-2);
            expect(volumeRemoved).toBe(3);
        });

        it("when there is no overlap", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: 3
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb);
            expect(fpn.pipes[0].fluids[0].volume).toBe(5);
            expect(fpn.pipes[0].fluids[0].position).toBe(3);
            expect(volumeRemoved).toBe(0);
        });

        it("when the overlapping fluid is outside the pipe at vertex B", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: 18
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb);
            expect(fpn.pipes[0].fluids.length).toBe(0);
            expect(fpn.pipes[0].fluids.length).toBe(0);
            expect(volumeRemoved).toBe(5);
        });

        it("when the overlapping fluid is outside the pipe at vertex A", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: -18
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].va);
            expect(fpn.pipes[0].fluids.length).toBe(0);
            expect(fpn.pipes[0].fluids.length).toBe(0);
            expect(volumeRemoved).toBe(5);
        });

        it("can cope with more than one fluid", function() {
            // Pipe capacity 10
            fpn.pipes[0].fluids = [{
                // Overlap 3
                volume: 5,
                position: 8
            },{
                // Overlap 5, outsie pipe
                volume: 5,
                position: 18
            }];
            var volumeRemoved = fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb);
            expect(fpn.pipes[0].fluids.length).toBe(1);
            expect(fpn.pipes[0].fluids[0].volume).toBe(2);
            expect(fpn.pipes[0].fluids[0].position).toBe(8);
            expect(volumeRemoved).toBe(8);
        });
    });

    describe("when getFluidAtVertex is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
            fpn.pipes[0].fluids = [{
                volume: fpn.getLength(fpn.pipes[0]),
                position: 0
            }];
        });

        it("returns the fluid touching vertex A", function() {
            expect(fpn.getFluidAtVertex(fpn.pipes[0], fpn.pipes[0].va)).toBe(fpn.pipes[0].fluids[0]);
        });

        it("returns the fluid touching vertex B", function() {
            expect(fpn.getFluidAtVertex(fpn.pipes[0], fpn.pipes[0].vb)).toBe(fpn.pipes[0].fluids[0]);
        });

    });

    describe("when getAvaliableConnectedPipesWithLowestFluidLevel is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
        });

        describe("with two empty connected pipes", function() {

            beforeEach(function() {
                fpn.pipes[0].fluids = [{
                    volume: fpn.getLength(fpn.pipes[0]),
                    position: 0
                }];
            });

            it("returns the most downward pointing pipe", function() {
                var results = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(0, fpn.pipes[0].va);
                expect(results.length).toBe(1);
                expect(results).toContain({
                    pipe: fpn.pipes[1],
                    vertex: fpn.pipes[0].vb
                });
            });
        });

        describe("with two connected pipes containing fluid", function() {

            beforeEach(function() {
                fpn.pipes[0].fluids = [{
                    volume: fpn.getLength(fpn.pipes[0]),
                    position: 0
                }];
                fpn.pipes[1].fluids = [{
                    volume: 6,
                    position: fpn.getLength(fpn.pipes[1]) - 6
                }];
                fpn.pipes[2].fluids = [{
                    volume: 7,
                    position: 0
                }];
            });

            it("returns the connected pipes and vertices where the fluid ends", function() {
                var results = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(0, fpn.pipes[0].va);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: fpn.pipes[1],
                    vertex: fpn.pipes[0].vb
                });
                expect(results).toContain({
                    pipe: fpn.pipes[2],
                    vertex: fpn.pipes[0].vb
                });
            });
        });

        describe("with two connected pipes containing fluid, pointing up", function() {

            beforeEach(function() {
                fpn.pipes[4].fluids = [{
                    volume: fpn.getLength(fpn.pipes[4]),
                    position: 0
                }];
                fpn.pipes[1].fluids = [{
                    volume: 6,
                    position: 0
                }];
                fpn.pipes[3].fluids = [{
                    volume: 1,
                    position: 0
                }];
            });

            it("returns the connected pipes and vertices where the fluid ends", function() {
                var results = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(4, fpn.pipes[4].vb);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: fpn.pipes[3],
                    vertex: fpn.pipes[4].va
                });
                expect(results).toContain({
                    pipe: fpn.pipes[1],
                    vertex: fpn.pipes[1].va
                });
            });
        });

        describe("with two connected pipes containing fluid, pointing up, one being full", function() {

            beforeEach(function() {
                fpn.pipes[4].fluids = [{
                    volume: fpn.getLength(fpn.pipes[4]),
                    position: 0
                }];
                fpn.pipes[1].fluids = [{
                    volume: fpn.getLength(fpn.pipes[1]),
                    position: 0
                }];
                fpn.pipes[2].fluids = [{
                    volume: fpn.getLength(fpn.pipes[2]),
                    position: 0
                }];
                fpn.pipes[0].fluids = [{
                    volume: 1,
                    position: fpn.getLength(fpn.pipes[0]) - 1
                }];
                fpn.pipes[3].fluids = [{
                    volume: 20,
                    position: 0
                }];
            });

            it("returns the connected pipe and end with the lowest fluid level", function() {
                var results = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(4, fpn.pipes[4].vb);
                expect(results[0].pipe).toBe(fpn.pipes[0]);
                expect(results[0].vertex).toEqual(fpn.pipes[0].vb);
            });
        });

        describe("with the lowest fluid pipe being full", function() {

            beforeEach(function() {
                fpn.pipes[0].fluids = [{
                    volume: fpn.getLength(fpn.pipes[0]),
                    position: 0
                }];
                fpn.pipes[1].fluids = [{
                    volume: fpn.getLength(fpn.pipes[1]),
                    position: 0
                }];
                fpn.pipes[2].fluids = [{
                    volume: 7,
                    position: 0
                }];
            });

            it("returns the most downward pointing pipe of the two branches available", function() {
                var results = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(0, fpn.pipes[0].va);
                expect(results.length).toBe(2);
                expect(results).toContain({
                    pipe: fpn.pipes[2],
                    vertex: fpn.pipes[2].va
                });
                expect(results).toContain({
                    pipe: fpn.pipes[4],
                    vertex: fpn.pipes[4].va
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
            fpn.setMetrics();
        });

        describe("and there are empty pipes at the vertex", function() {

            it("returns the most downward pointing pipe", function() {
                var pipes = fpn.getPipesToDistributePressureInto([2, 1, 0], fpn.pipes[0].vb);
                expect(pipes.length).toBe(1);
                expect(pipes[0]).toEqual({
                    pipe: fpn.pipes[1],
                    vertex: fpn.pipes[0].vb
                });
            });
        });

        describe("and the most downward pointing pipe contains fluid at the vertex", function() {

            beforeEach(function() {
                fpn.pipes[1].fluids = [{
                    volume: 2,
                    position: fpn.getLength(fpn.pipes[1]) - 2
                }];
            });

            it("returns the next most downward pointing pipe", function() {
                var pipes = fpn.getPipesToDistributePressureInto([2, 1, 0], fpn.pipes[0].vb);
                expect(pipes.length).toBe(1);
                expect(pipes[0]).toEqual({
                    pipe: fpn.pipes[2],
                    vertex: fpn.pipes[0].vb
                });
            });
        });

        describe("and all of the pipes contain fluid at their vertex", function() {

            var fluidSpy;

            beforeEach(function() {
                fpn.pipes[0].fluids = [{
                    volume: 6,
                    position: fpn.getLength(fpn.pipes[0]) - 6
                }];
                fpn.pipes[1].fluids = [{
                    volume: 2,
                    position: fpn.getLength(fpn.pipes[1]) - 2
                }];
                fpn.pipes[2].fluids = [{
                    volume: 3,
                    position: 0
                }];
                fluidSpy = spyOn(fpn, 'getAvaliableConnectedPipesWithLowestFluidLevel').andCallFake(function(index) {
                    switch (index) {
                        case 0:
                            return [{
                                pipe: fpn.pipes[0],
                                vertex: fpn.pipes[0].vb
                            }];
                        case 1:
                            return [{
                                pipe: fpn.pipes[1],
                                vertex: fpn.pipes[0].vb
                            }];
                        case 2:
                            return [{
                                pipe: fpn.pipes[2],
                                vertex: fpn.pipes[0].vb
                            }];
                    }
                });
            });

            it("calls getAvaliableConnectedPipesWithLowestFluidLevel for each pipe", function() {
                var pipes = fpn.getPipesToDistributePressureInto([2, 1, 0], fpn.pipes[0].vb);
                expect(fpn.getAvaliableConnectedPipesWithLowestFluidLevel).toHaveBeenCalledWith(0, fpn.pipes[0].vb);
                expect(fpn.getAvaliableConnectedPipesWithLowestFluidLevel).toHaveBeenCalledWith(1, fpn.pipes[0].vb);
                expect(fpn.getAvaliableConnectedPipesWithLowestFluidLevel).toHaveBeenCalledWith(2, fpn.pipes[0].vb);
            });

            it("returns all of the results", function() {
                var pipes = fpn.getPipesToDistributePressureInto([2, 1, 0], fpn.pipes[0].vb);
                expect(pipes.length).toBe(3);
                expect(pipes).toContain({
                    pipe: fpn.pipes[0],
                    vertex: fpn.pipes[0].vb
                });
                expect(pipes).toContain({
                    pipe: fpn.pipes[1],
                    vertex: fpn.pipes[0].vb
                });
                expect(pipes).toContain({
                    pipe: fpn.pipes[2],
                    vertex: fpn.pipes[0].vb
                });
            });
        });
    });

    describe("when getAvailableCapacity is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
        });

        describe("with a pipe containing no fluid", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[0].fluids = [];
            });

            it("returns the pipe's capacity", function() {
                expect(fpn.getAvailableCapacity(fpn.pipes[0])).toBe(fpn.pipes[0].capacity);
                expect(fpn.getAvailableCapacity(fpn.pipes[1])).toBe(fpn.pipes[1].capacity);
            });
        });

        describe("with a pipe containing one fluid", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[0].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the available capacity", function() {
                expect(fpn.getAvailableCapacity(fpn.pipes[0])).toBe(fpn.pipes[0].capacity - 3);
            });
        });

        describe("with a pipe containing multiple fluids", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[0].fluids = [{
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
                expect(fpn.getAvailableCapacity(fpn.pipes[0])).toBe(fpn.pipes[0].capacity - 4.7);
            });
        });

        describe("with a full pipe", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[0].fluids = [{
                    volume: fpn.pipes[0].capacity,
                    position: 0
                }];
            });

            it("returns 0", function() {
                expect(fpn.getAvailableCapacity(fpn.pipes[0])).toBe(0);
            });
        });

        describe("with a pipe containing fluid that overlaps at vertexB, but is not full", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[0].fluids = [{
                    volume: fpn.pipes[0].capacity + 10,
                    position: 5
                }];
            });

            it("returns the available capacity without overlap", function() {
                expect(fpn.getAvailableCapacity(fpn.pipes[0])).toBe(fpn.pipes[0].capacity - 5);
            });
        });

        describe("with a pipe containing fluid that overlaps at vertexA, but is not full", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[0].fluids = [{
                    volume: fpn.pipes[0].capacity + 10,
                    position: fpn.pipes[0].capacity - 5
                }];
            });

            it("returns the available capacity without overlap", function() {
                expect(fpn.getAvailableCapacity(fpn.pipes[0])).toBe(fpn.pipes[0].capacity - 5);
            });
        });

        describe("with a pipe containing fluid that overlaps at both vertices", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[0].fluids = [{
                    volume: fpn.pipes[0].capacity + 10,
                    position: -5
                }];
            });

            it("returns 0", function() {
                expect(fpn.getAvailableCapacity(fpn.pipes[0])).toBe(0);
            });
        });

    });

    describe("when getFluidLevel is called", function() {

        describe("when the pipe has fluid at the vertex", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the level of the fluid at the vertex in relation to the pipe's position", function() {
                // Pipe is at 45' with volume of 3 = ~ 2.12132034355965
                // subtract from y position of 20
                var level = fpn.getFluidLevel(fpn.pipes[1], fpn.pipes[1].va);
                expect(level).toBeCloseTo(20 - 2.12132034355965);
            });
        });

        describe("when the pipe has fluid at the vertex pointing down", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[1].fluids = [{
                    volume: 3,
                    position: fpn.pipes[1].capacity - 3
                }];
            });

            it("returns the level of the fluid at the vertex in relation to the pipe's position", function() {
                // Pipe is at 45' with volume of 3 = ~ 2.12132034355965
                // add to from y position of 10
                var level = fpn.getFluidLevel(fpn.pipes[1], fpn.pipes[1].vb);
                expect(level).toBeCloseTo(10 + 2.12132034355965);
            });
        });

        describe("when the pipe doesn't have fluid at the vertex", function() {

            beforeEach(function() {
                fpn.setMetrics();
            });

            it("returns the level of the vertex", function() {
                var level = fpn.getFluidLevel(fpn.pipes[1], fpn.pipes[1].va);
                expect(level).toBe(20);
            });
        });
    });

    describe("when getVolumeNeededToReachLevel is called", function() {

        describe("and the pipe is pointing up, with the level being higher", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = fpn.pipes[1];
                var level = fpn.getFluidLevel(pipe, pipe.va);
                pipe.fluids[0].volume += fpn.getVolumeNeededToReachLevel(pipe, pipe.va, level + 6);
                expect(fpn.getFluidLevel(pipe, pipe.va)).toBe(level + 6);
            });
        });

        describe("and the pipe is pointing up, with the level being lower", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[1].fluids = [{
                    volume: 5,
                    position: 0
                }];
            });

            it("returns the volume of fluid to be removed to reach that level", function() {
                var pipe = fpn.pipes[1];
                var level = fpn.getFluidLevel(pipe, pipe.va);
                pipe.fluids[0].volume += fpn.getVolumeNeededToReachLevel(pipe, pipe.va, level - 2);
                expect(fpn.getFluidLevel(pipe, pipe.va)).toBe(level - 2);
            });
        });

        describe("and the pipe is pointing down, with the level being lower", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[1].fluids = [{
                    volume: 4,
                    position: fpn.pipes[1].capacity - 4
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = fpn.pipes[1];
                var level = fpn.getFluidLevel(pipe, pipe.vb);
                var volume = fpn.getVolumeNeededToReachLevel(pipe, pipe.vb, level + 2);
                pipe.fluids[0].volume += volume;
                pipe.fluids[0].position -= volume;
                expect(fpn.getFluidLevel(pipe, pipe.vb)).toBe(level + 2);
            });
        });

        describe("and the pipe is pointing down, with the level being higher", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[1].fluids = [{
                    volume: 2,
                    position: fpn.pipes[1].capacity - 2
                }];
            });

            it("returns the volume of fluid to add to reach that level", function() {
                var pipe = fpn.pipes[1];
                var level = fpn.getFluidLevel(pipe, pipe.vb);
                var volume = fpn.getVolumeNeededToReachLevel(pipe, pipe.vb, level - 5);
                pipe.fluids[0].volume += volume;
                pipe.fluids[0].position -= volume;
                expect(fpn.getFluidLevel(pipe, pipe.vb)).toBeCloseTo(level - 5);
            });
        });

        describe("and the pipe is perfectly horizontal", function() {

            beforeEach(function() {
                fpn.setMetrics();
                fpn.pipes[2].fluids = [{
                    volume: 2,
                    position: 0
                }];
            });

            it("returns false", function() {
                var pipe = fpn.pipes[2];
                var level = fpn.getFluidLevel(pipe, pipe.va);
                var volume = fpn.getVolumeNeededToReachLevel(pipe, pipe.va, level + 1);
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

    describe("when redistributePressure is calledxx", function() {

        var distributeSpy,
            pipes,
            vertex;

        beforeEach(function() {
            fpn.setMetrics();
            pipes = [
                fpn.pipes[1],
                fpn.pipes[3],
                fpn.pipes[4]
            ],
            vertex = fpn.pipes[1].va;
            distributeSpy = spyOn(fpn, 'getPipesToDistributePressureIntoX').andReturn([{
                pipe: fpn.pipes[4],
                vertex: fpn.pipes[4].vb
            }]);
            spyOn(fpn, 'addFluid');
        });

        it("calls getPipesToDistributePressureIntoX", function() {
            fpn.redistributePressure(pipes, vertex, 5);
            expect(fpn.getPipesToDistributePressureIntoX).toHaveBeenCalledWith(pipes, vertex);
        });

        describe("and there is no fluid in the returned pipe", function() {

            it("moves the pressure into the returned pipe", function() {
                fpn.redistributePressure(pipes, vertex, 5);
                expect(fpn.addFluid).toHaveBeenCalledWith(fpn.pipes[4], fpn.pipes[4].vb, 5)
            });
        });

        describe("and there is fluid in all of the returned pipes", function() {

            beforeEach(function() {
                fpn.pipes[3].fluids = [{
                    volume: 6,
                    position: 0
                }];
                fpn.pipes[1].fluids = [{
                    volume: 3,
                    position: 0
                }];
                // 4 is full

                distributeSpy.andReturn([{
                    pipe: fpn.pipes[3],
                    vertex: fpn.pipes[3].va
                },{
                    pipe: fpn.pipes[1],
                    vertex: fpn.pipes[1].va
                }]);
            });

            it("moves fluid into the pipe with the lowest level", function() {
                fpn.redistributePressure(pipes, vertex, 5);
                expect(fpn.addFluid.callCount).toBe(1);
                var args = fpn.addFluid.mostRecentCall.args;
                expect(args[0]).toBe(fpn.pipes[1]);
                expect(args[1]).toBe(fpn.pipes[1].va);
            });

            describe("when the new level would be lower than the next highest", function() {

                it("moves all of the fluid", function() {
                    fpn.redistributePressure(pipes, vertex, 5);
                    var volume = fpn.addFluid.mostRecentCall.args[2];
                    expect(volume).toBe(5);
                });
            });

            describe("when the new level would be higher than the next highest", function() {

                beforeEach(function() {
                    spyOn(fpn, 'getVolumeNeededToReachLevel').andReturn(3.3);
                    fpn.redistributePressure(pipes, vertex, 20);
                })

                it("matches the level of the next highest fluid", function() {
                    var nextLevel = fpn.getFluidLevel(fpn.pipes[3], fpn.pipes[3].va);
                    expect(fpn.getVolumeNeededToReachLevel).toHaveBeenCalledWith(fpn.pipes[1], fpn.pipes[1].va, nextLevel);
                    var volume = fpn.addFluid.calls[0].args[2];
                    expect(volume).toBe(3.3);
                });
            });

            describe("when that pipe is full", function() {

                beforeEach(function() {
                    fpn.pipes[3].fluids[0].volume = 20;
                    var pressure = (fpn.pipes[1].capacity - 3) + 1;
                    spyOn(fpn, 'redistributePressure').andCallThrough();
                    fpn.redistributePressure(pipes, vertex, pressure);
                });

                it("calls redistributePressure again with the remaining pressure", function() {
                    expect(fpn.redistributePressure).toHaveBeenCalledWith(pipes, vertex, 1);
                });
            });

            describe("when there are multiple pipes with the lowest fluid level", function() {

                var originalLevelA,
                    originalLevelB;

                beforeEach(function() {
                    var nextLevel = fpn.getFluidLevel(fpn.pipes[3], fpn.pipes[3].va);
                    var volume = fpn.getVolumeNeededToReachLevel(fpn.pipes[1], fpn.pipes[1].va, nextLevel);
                    fpn.pipes[1].fluids[0].volume += volume;
                    originalLevelA = fpn.getFluidLevel(fpn.pipes[1], fpn.pipes[1].va);
                    originalLevelB = fpn.getFluidLevel(fpn.pipes[3], fpn.pipes[3].va);
                    fpn.addFluid.andCallThrough();
                    fpn.redistributePressure(pipes, vertex, 1);
                });

                it("distributes the fluid so that they reach the same level", function() {
                    var levelA = fpn.getFluidLevel(fpn.pipes[1], fpn.pipes[1].va);
                    var levelB = fpn.getFluidLevel(fpn.pipes[3], fpn.pipes[3].va);
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

    describe("when solvePressureForPipeAtVertex is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
            spyOn(fpn, 'removePressureInPipeAtVertex').andReturn(5);
            spyOn(fpn, 'redistributePressure');
            fpn.solvePressureForPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb);
        });

        it("removes the pressure from the pipe", function() {
            expect(fpn.removePressureInPipeAtVertex).toHaveBeenCalledWith(fpn.pipes[0], fpn.pipes[0].vb)
        });

        it("calls redistributePressure", function() {
            expect(fpn.redistributePressure).toHaveBeenCalled();
        });

        it("passes all the pipes at that vertex to redistributePressure", function() {
            var pipes = fpn.redistributePressure.mostRecentCall.args[0];
            expect(pipes).toContain(fpn.pipes[0]);
            expect(pipes).toContain(fpn.pipes[1]);
            expect(pipes).toContain(fpn.pipes[2]);
        });

        it("passes the vertex to redistributePressure", function() {
            expect(fpn.redistributePressure.mostRecentCall.args[1]).toBe(fpn.pipes[0].vb);
        });

        it("passes the pressure to redistributePressure", function() {
            expect(fpn.redistributePressure.mostRecentCall.args[2]).toBe(5);
        });
    });


    it("should calculate metrics when start is called", function() {
        spyOn(fpn, 'setMetrics');
        fpn.start();
        expect(fpn.setMetrics).toHaveBeenCalled();
    });

    describe("when update is called", function() {

        beforeEach(function() {
            spyOn(fpn, 'moveFluids');

            fpn.update();
        });

        it("should advance the simulation", function() {
            expect(fpn.moveFluids).toHaveBeenCalled();
            expect(fpn.moveFluids.callCount).toBe(1);
        });
    });
});