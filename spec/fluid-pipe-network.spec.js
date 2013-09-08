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

              |
        _ _ | |
             \|
             /
    */

    beforeEach(function() {

        pipes = [
            {
                va: {x: 0, y: 0},
                vb: {x: 0, y: 10},
                ca: null,
                cb: [1, 2],
            },{
                va: {x: 10, y: 20},
                vb: {x: 0, y: 10},
                ca: [3, 4],
                cb: [0, 2],
            },{
                va: {x: 0, y: 10},
                vb: {x: -20, y: 10},
                ca: [0, 1],
                cb: null,
            },{
                va: {x: 10, y: 20},
                vb: {x: 10, y: -10},
                ca: [1, 4],
                cb: null,
            },{
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
            fpn.moveFluids();
        });

        it("moves each fluid by it's velocity", function() {
            expect(fpn.pipes[0].fluids[0].position).toBe(0.1);
            expect(fpn.pipes[1].fluids[0].position).toBe(5 - 0.05);
            expect(fpn.pipes[2].fluids[0].position).toBe(0);
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

    describe("when equalisePressuresForPipesAtVertex is called", function() {

        beforeEach(function() {
            fpn.setMetrics();
        });

        it("pressure at each point is removed and redistributed according to resistance", function() {
            // The following share a vertex
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: fpn.getLength(fpn.pipes[0]) - 3
            }];
            fpn.pipes[1].fluids = [{
                volume: 5,
                position: fpn.getLength(fpn.pipes[1]) - 2
            }];
            fpn.pipes[2].fluids = [{
                volume: 5,
                position: -4
            }];

            fpn.equalisePressuresForPipesAtVertex([2, 1, 0], fpn.pipes[0].vb);

            expect(round5dp(
                fpn.pipes[0].fluids[0].volume
                + fpn.pipes[1].fluids[0].volume
                + fpn.pipes[2].fluids[0].volume
            )).toBe(15);

            expect(fpn.pipes[0].fluids.length).toBe(1);
            expect(fpn.pipes[1].fluids.length).toBe(1);
            expect(fpn.pipes[2].fluids.length).toBe(1);

            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb)
            ).toBe(0);
            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[1], fpn.pipes[0].vb)
            ).toBe(0);
            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[2], fpn.pipes[0].va)
            ).toBe(0);
        });

        it("pressure at a dead end is sent back", function() {
            // Capacity 14.142
            fpn.pipes[4].fluids = [{
                volume: 8,
                position: 10
            }];

            fpn.equalisePressuresForPipesAtVertex([4], fpn.pipes[4].vb);

            expect(fpn.pipes[4].fluids.length).toBe(1);
            expect(fpn.pipes[4].fluids[0].volume).toBe(8);
            expect(fpn.pipes[4].fluids[0].position).toBe(fpn.pipes[4].capacity - 8);
        });

        it("pressure that is less than the pipe's resistance is distributed as expected", function() {
            fpn.pipes[0].fluids = [{
                volume: 0.001,
                position: fpn.getLength(fpn.pipes[0]) - 0.0005
            }];

            fpn.equalisePressuresForPipesAtVertex([2, 1, 0], fpn.pipes[0].vb);

            expect(round5dp(
                fpn.pipes[0].fluids[0].volume
                + fpn.pipes[1].fluids[0].volume
            )).toBe(0.001);

            expect(fpn.pipes[0].fluids.length).toBe(1);
            expect(fpn.pipes[1].fluids.length).toBe(1);

            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb)
            ).toBe(0);
            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[1], fpn.pipes[0].vb)
            ).toBe(0);
        });

        it("pressure that is equal to the total resistances is distributed as expected", function() {
            var totalResistances = fpn.pipes[0].rb + fpn.pipes[1].rb + fpn.pipes[2].ra

            fpn.pipes[0].fluids = [{
                volume: 1 + totalResistances,
                position: fpn.getLength(fpn.pipes[0]) - 1
            }];

            fpn.equalisePressuresForPipesAtVertex([2, 1, 0], fpn.pipes[0].vb);

            expect(round5dp(
                fpn.pipes[0].fluids[0].volume
                + fpn.pipes[1].fluids[0].volume
                + fpn.pipes[2].fluids[0].volume
            )).toBe(1 + totalResistances);

            expect(fpn.pipes[0].fluids.length).toBe(1);
            expect(fpn.pipes[1].fluids.length).toBe(1);
            expect(fpn.pipes[2].fluids.length).toBe(1);

            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[0], fpn.pipes[0].vb)
            ).toBe(0);
            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[1], fpn.pipes[0].vb)
            ).toBe(0);
            expect(
                fpn.removePressureInPipeAtVertex(fpn.pipes[2], fpn.pipes[0].vb)
            ).toBe(0);
        });

        it("doesn't add fluid to full pipes when they are the last pipe", function() {

            // Pressure of 2
            fpn.pipes[0].fluids = [{
                volume: 5,
                position: fpn.getLength(fpn.pipes[0]) - 3
            }];
            // full, but not last
            fpn.pipes[1].fluids = [{
                volume: fpn.pipes[1].capacity,
                position: 0
            }];
            // full
            fpn.pipes[2].fluids = [{
                volume: fpn.pipes[2].capacity,
                position: 0
            }];

            fpn.equalisePressuresForPipesAtVertex([2, 1, 0], fpn.pipes[0].vb);

            expect(fpn.pipes[1].fluids[0].volume).not.toBe(fpn.pipes[1].capacity);
            expect(fpn.pipes[2].fluids[0].volume).toBe(fpn.pipes[2].capacity);
        });

        it("doesn't add fluid to full pipes if all the subsequent pipes are full", function() {

            // Pressure of 1000
            fpn.pipes[0].fluids = [{
                volume: 1000,
                position: fpn.getLength(fpn.pipes[0])
            }];
            // full, but not last
            fpn.pipes[1].fluids = [{
                volume: fpn.pipes[1].capacity,
                position: 0
            }];
            // full, and last
            fpn.pipes[3].fluids = [{
                volume: fpn.pipes[3].capacity,
                position: 0
            }];
            // full and last
            fpn.pipes[4].fluids = [{
                volume: fpn.pipes[4].capacity,
                position: 0
            }];

            fpn.equalisePressuresForPipesAtVertex([2, 1, 0], fpn.pipes[0].vb);

            expect(
                fpn.pipes[0].fluids[0].volume
                + fpn.pipes[2].fluids[0].volume
            ).toBe(1000);

            expect(fpn.pipes[1].fluids[0].volume).toBe(fpn.pipes[1].capacity);
            expect(fpn.pipes[3].fluids[0].volume).toBe(fpn.pipes[3].capacity);
            expect(fpn.pipes[4].fluids[0].volume).toBe(fpn.pipes[4].capacity);
        });
    });

    describe("when equalisePressures is called", function() {

        var equaliseSpy;

        beforeEach(function() {
            fpn.setMetrics();
        });

        it("equalisePressuresForPipesAtVertex is called for each vertex", function() {
            equaliseSpy = spyOn(fpn, "equalisePressuresForPipesAtVertex");
            fpn.equalisePressures();
            expect(equaliseSpy.callCount).toBe(6);
            expect(equaliseSpy).toHaveBeenCalledWith([
                0
            ],{
                x: 0,
                y: 0
            });
            expect(equaliseSpy).toHaveBeenCalledWith([
                2, 1, 0
            ],{
                x: 0,
                y: 10
            });
            expect(equaliseSpy).toHaveBeenCalledWith([
                4, 3, 1
            ],{
                x: 10,
                y: 20
            });
            expect(equaliseSpy).toHaveBeenCalledWith([
                2
            ],{
                x: -20,
                y: 10
            });
            expect(equaliseSpy).toHaveBeenCalledWith([
                3
            ],{
                x: 10,
                y: -10
            });
            expect(equaliseSpy).toHaveBeenCalledWith([
                4
            ],{
                x: 0,
                y: 30
            });
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
            spyOn(fpn, 'equalisePressures');

            fpn.update();
        });

        it("should advance the simulation", function() {
            expect(fpn.moveFluids).toHaveBeenCalled();
            expect(fpn.moveFluids.callCount).toBe(1);

            expect(fpn.equalisePressures).toHaveBeenCalled();
            expect(fpn.equalisePressures.callCount).toBe(1);
        });
    });
});