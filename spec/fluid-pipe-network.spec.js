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
            spyOn(fpn, 'removePressureInPipeAtVertex').andReturn(5);
            spyOn(fpn, 'getPipesToDistributePressureInto').andReturn([{
                pipe: fpn.pipes[1],
                vertex: fpn.pipes[1].vb
            }]);
            spyOn(fpn, 'addFluid');
            fpn.equalisePressuresForPipesAtVertex([2, 1, 0], fpn.pipes[0].vb);
        });

        it("calls getPipesToDistributePressureInto", function() {
            expect(fpn.getPipesToDistributePressureInto).toHaveBeenCalledWith([2, 1, 0], fpn.pipes[0].vb);
        });

        it("removes the pressure from each pipe", function() {
            expect(fpn.removePressureInPipeAtVertex).toHaveBeenCalledWith(fpn.pipes[0], fpn.pipes[1].vb)
            expect(fpn.removePressureInPipeAtVertex).toHaveBeenCalledWith(fpn.pipes[1], fpn.pipes[1].vb)
            expect(fpn.removePressureInPipeAtVertex).toHaveBeenCalledWith(fpn.pipes[2], fpn.pipes[1].vb)
        });

        it("moves the pressure into the returned pipe", function() {
            expect(fpn.addFluid).toHaveBeenCalledWith(fpn.pipes[1], fpn.pipes[1].vb, 15)
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
                1, 0, 2
            ],{
                x: 0,
                y: 10
            });
            expect(equaliseSpy).toHaveBeenCalledWith([
                3, 1, 4
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

            it("returns the connected pipe and end with the lowest fluid level", function() {
                var result = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(0, fpn.pipes[0].va);
                expect(result[0].pipe).toBe(fpn.pipes[1]);
                expect(result[0].vertex).toBe(fpn.pipes[0].vb);
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

            it("returns the connected pipe and end with the lowest fluid level", function() {
                var result = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(4, fpn.pipes[4].vb);
                expect(result[0].pipe).toBe(fpn.pipes[3]);
                expect(result[0].vertex).toBe(fpn.pipes[4].va);
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
                var result = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(4, fpn.pipes[4].vb);
                expect(result[0].pipe).toBe(fpn.pipes[0]);
                expect(result[0].vertex).toEqual(fpn.pipes[0].vb);
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

            it("returns the most downward pointing pipe", function() {
                var results = fpn.getAvaliableConnectedPipesWithLowestFluidLevel(0, fpn.pipes[0].va);
                expect(results.length).toBe(1);
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

            it("returns the pipe with the lowest available fluid level", function() {
                var pipes = fpn.getPipesToDistributePressureInto([2, 1, 0], fpn.pipes[0].vb);
                expect(pipes[0]).toEqual({
                    pipe: fpn.pipes[1],
                    vertex: fpn.pipes[0].vb
                });
            });

            describe("there are multiple pipes with the lowest fluid level", function() {

                beforeEach(function() {
                    fpn.pipes[1].fluids = [{
                        volume: fpn.getLength(fpn.pipes[1]),
                        position: 0
                    }];
                    fluidSpy.andCallFake(function(index) {
                        switch (index) {
                            case 0:
                                return [{
                                    pipe: fpn.pipes[0],
                                    vertex: fpn.pipes[0].vb
                                }];
                            case 1:
                                return [{
                                    pipe: fpn.pipes[4],
                                    vertex: fpn.pipes[4].va
                                },{
                                    pipe: fpn.pipes[3],
                                    vertex: fpn.pipes[3].va
                                }];
                            case 2:
                                return [{
                                    pipe: fpn.pipes[2],
                                    vertex: fpn.pipes[0].vb
                                }];
                        }
                    });
                });

                it("returns the most downward pointing pipe", function() {
                    var pipes = fpn.getPipesToDistributePressureInto([2, 1, 0], fpn.pipes[0].vb);
                    expect(pipes[0]).toEqual({
                        pipe: fpn.pipes[4],
                        vertex: fpn.pipes[4].va
                    });
                });
            });
        })
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