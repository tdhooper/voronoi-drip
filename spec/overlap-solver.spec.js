// Rename resistance to slope

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

        overlapSolver = VoronoiDrip.FluidNetworkSimulation.OverlapSolver.create({
            pipes: pipes
        });
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

});