// Rename resistance to slope

describe("a Fluid Adder", function() {
    var metrics,
        overlapSolver,
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
    });

    describe("when fluid is added at a pipe's vertex", function() {

        beforeEach(function() {
            metrics.start();
            fluidAdder.add(pipes[0], pipes[0].va, 2);
            fluidAdder.add(pipes[0], pipes[0].vb, 3);
            fluidAdder.add(pipes[1], pipes[1].vb, 4);
            fluidAdder.add(pipes[2], pipes[2].va, 5);
        });

        it("has it's volume stored in the fluids array", function() {
            expect(pipes[0].fluids[0]).toEqual({
                volume: 2,
                position: 0
            });
            expect(pipes[0].fluids[1]).toEqual({
                volume: 3,
                position: pipes[0].capacity - 3
            });
            expect(pipes[1].fluids[0]).toEqual({
                volume: 4,
                position: pipes[1].capacity - 4
            });
            expect(pipes[2].fluids[0]).toEqual({
                volume: 5,
                position: 0
            });
        });
    });

    describe("when new fluid collides with existing fluid", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 5,
                position: 0
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(7);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(pipes[0].fluids[0].position).toEqual(0);
            });
        });
    });

    describe("when new fluid puts the pipe over capacity", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 9,
                position: 0
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(11);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(pipes[0].fluids[0].position).toEqual(0);
            });
        });
    });

    describe("when new fluid is added to an already over capacity pipe", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 12,
                position: -1
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(14);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(pipes[0].fluids[0].position).toEqual(-1);
            });
        });
    });

    describe("when combined fluid collides with existing fluid", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 5,
                position: 0
            },{
                volume: 1,
                position: 6
            }];
        });

        describe("and it was added at the A vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].va, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(8);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(pipes[0].fluids[0].position).toEqual(0);
            });
        });
    });

    describe("when new fluid collides with existing fluid", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 5,
                position: 5
            }];
        });

         describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(7);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(round2dp(pipes[0].fluids[0].position)).toEqual(3);
            });
        });
    });

    describe("when new fluid puts the pipe over capacity", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 9,
                position: 1
            }];
        });

         describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(11);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(pipes[0].fluids[0].position).toEqual(-1);
            });
        });
    });

    describe("when new fluid is added to an already over capacity pipe", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 12,
                position: -1
            }];
        });

         describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(14);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(pipes[0].fluids[0].position).toEqual(-1 - 2);
            });
        });
    });

    describe("when combined fluid collides with existing fluid", function() {

        beforeEach(function() {
            metrics.start();
            pipes[0].fluids = [{
                volume: 5,
                position: 5
            },{
                volume: 1,
                position: 3
            }];
        });

        describe("and it was added at the B vertex", function() {

            beforeEach(function() {
                fluidAdder.add(pipes[0], pipes[0].vb, 2);
            });

            it("combines volumes the existing fluid, removing the new one", function() {
                expect(pipes[0].fluids[0].volume).toEqual(8);
                expect(pipes[0].fluids.length).toEqual(1);
            });

            it("pushes the existing fluid along by the volume", function() {
                expect(pipes[0].fluids[0].position).toEqual(2);
            });
        });
    });

});