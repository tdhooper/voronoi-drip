describe("a Voronoi Drip simulation", function() {
    var spec,
        voronoiDrip;

    beforeEach(function() {

        var edges = [
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

        spec = {
            width: 300,
            height: 300,
            fluidColour: "#ff0",
            pipeColour: '#000',
            startVolume: 50,
            gravity: 3,
            timeout: 60,
            network: edges
        };

        voronoiDrip = vd.createVoronoiDrip(spec);
    });

    describe("when drawNetwork is called", function() {

        var mockDisplay = jasmine.createSpyObj('display', ['drawLine']);

        beforeEach(function() {
            voronoiDrip.display = mockDisplay;
            voronoiDrip.drawNetwork();
            expect(voronoiDrip.network.length).toBeGreaterThan(0);
        });

        it("draws the network in the pipeColour", function() {
            var edgeCount = voronoiDrip.network.length,
                edge;

            while (edgeCount--) {
                edge = voronoiDrip.network[edgeCount];
                expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                    {x: edge.va.x, y: edge.va.y},
                    {x: edge.vb.x, y: edge.vb.y},
                    "#000"
                );
            }
        });
    });

    it("should find the highest edge and vertex when getHighestEdgeAndVertex is called", function() {
        var edges = [{
            va: {x: 5, y: 10},
            vb: {x: 324, y: 38},
        },{
            va: {x: 55, y: 54},
            vb: {x: 9, y: 3},
        },{
            va: {x: 543, y: 87},
            vb: {x: 6, y: 76},
        }];

        voronoiDrip.network = edges;

        var result = voronoiDrip.getHighestEdgeAndVertex();
        expect(result.edge).toBe(edges[1]);
        expect(result.vertex).toBe(edges[1].vb);
    });

    describe("when start is called", function() {

        var mockFPN = jasmine.createSpyObj('fpn', ['start', 'addFluid']),
            mockDisplay = jasmine.createSpyObj('display', ['start']);

        beforeEach(function() {
            spyOn(vd, 'createFluidPipeNetwork').andReturn(mockFPN);
            spyOn(vd, 'createDisplay').andReturn(mockDisplay);
            spyOn(voronoiDrip, 'drawNetwork');
            spyOn(voronoiDrip, 'tick');
            voronoiDrip.start();
        });

        it("creates a new fluid pipe network with the edges and gravity, and attaches it to the voronoiDrip", function() {
            var expectedSpec = {
                pipes: spec.network,
                gravity: 3
            }
            expect(vd.createFluidPipeNetwork).toHaveBeenCalledWith(expectedSpec);
            expect(voronoiDrip.fpn).toBe(mockFPN);
        });

        it("starts the fluid pipe network", function() {
            expect(mockFPN.start).toHaveBeenCalled();
        });

        it("creates a new display at the specified width and height, and attaches it to the voronoiDrip", function() {
            var expectedSpec = {
                width: 300,
                height: 300
            }
            expect(vd.createDisplay).toHaveBeenCalledWith(expectedSpec);
            expect(voronoiDrip.display).toBe(mockDisplay);
        });

        it("starts the display", function() {
            expect(mockDisplay.start).toHaveBeenCalled();
        });

        it("draws the network", function() {
            expect(voronoiDrip.drawNetwork).toHaveBeenCalled();
        });

        it("starts the tick loop", function() {
            expect(voronoiDrip.tick).toHaveBeenCalled();
        });
    });

    describe("when addFluid is called", function() {

        var mockFPN;

        beforeEach(function() {
            mockFPN = jasmine.createSpyObj('fpn', ['addFluid']);
            voronoiDrip.fpn = mockFPN;
        });

        describe("with no pipe and vertex specified", function() {

            var highestEdgeAndVertex = {
                edge: {},
                vertex: {}
            };

            beforeEach(function() {
                spyOn(voronoiDrip, 'getHighestEdgeAndVertex').andReturn(highestEdgeAndVertex);
                voronoiDrip.addFluid(50);
            });

            it("adds the specified volume of fluid at the highest point", function() {
                expect(mockFPN.addFluid).toHaveBeenCalledWith(
                    highestEdgeAndVertex.edge,
                    highestEdgeAndVertex.vertex,
                    50
                );
            });
        });

        describe("with a vertex specified", function() {

            beforeEach(function() {
                voronoiDrip.addFluid(50, 'some edge', 'some vertex');
            });

            it("adds the specified volume of fluid at the specified point", function() {
                expect(mockFPN.addFluid).toHaveBeenCalledWith(
                    'some edge',
                    'some vertex',
                    50
                );
            });
        });
    });

    describe("when tick is called", function() {

        beforeEach(function() {
            spyOn(voronoiDrip, 'update');
            spyOn(voronoiDrip, 'tick').andCallThrough();
            jasmine.Clock.useMock();
            voronoiDrip.tick();
        });

        it("should update the simulation", function() {
            expect(voronoiDrip.update).toHaveBeenCalled();
        });

        it("should call itself again in the allotted time", function() {
            expect(voronoiDrip.tick.callCount).toBe(1);
            jasmine.Clock.tick(60 + 1);
            expect(voronoiDrip.tick.callCount).toBe(2);
        });
    });

    it("should stop the tick loop when stop is called", function() {
        spyOn(voronoiDrip, 'update');
        spyOn(voronoiDrip, 'tick').andCallThrough();
        jasmine.Clock.useMock();
        voronoiDrip.tick();
        voronoiDrip.stop();
        jasmine.Clock.tick(11);
        expect(voronoiDrip.tick.callCount).toBe(1);
    });

    describe("when drawFluids is called", function() {
        var mockFPN = jasmine.createSpyObj('fpn', ['update']),
            mockDisplay = jasmine.createSpyObj('display', ['drawLine', 'clear']);

        beforeEach(function() {
            mockFPN.pipes = [
            {
                va: {x: 0, y: 0},
                vb: {x: 0, y: 10},
                capacity: 10,
                fluids: [{
                    volume: 5,
                    position: 0
                },{
                    volume: 2,
                    position: 7
                }]
            },{
                va: {x: 30, y: 10},
                vb: {x: 0, y: 10},
                capacity: 30,
                fluids: [{
                    volume: 2,
                    position: 1
                }]
            },{
                va: {x: 0, y: 10},
                vb: {x: 15, y: 15},
                capacity: 30
            }];
            voronoiDrip.fpn = mockFPN;
            voronoiDrip.display = mockDisplay;
            voronoiDrip.drawFluids();
        });

        it("draws each fluid in the fluidColour", function() {
            expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                {x: 0, y: 0},
                {x: 0, y: 5},
                "#ff0"
            );
            expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                {x: 0, y: 7},
                {x: 0, y: 9},
                "#ff0"
            );
            expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                {x: 29, y: 10},
                {x: 27, y: 10},
                "#ff0"
            );
        });
    });

    describe("when update is called", function() {
        var mockFPN = jasmine.createSpyObj('fpn', ['update']),
            mockDisplay = jasmine.createSpyObj('display', ['drawLine', 'clear']);

        beforeEach(function() {
            spyOn(voronoiDrip, 'drawNetwork');
            spyOn(voronoiDrip, 'drawFluids');
            voronoiDrip.fpn = mockFPN;
            voronoiDrip.display = mockDisplay;
            voronoiDrip.update();
        });

        it("updates the fluid pipe network", function() {
            expect(mockFPN.update).toHaveBeenCalled();
        });

        it("clears the display", function() {
            expect(mockDisplay.clear).toHaveBeenCalled();
        });

        it("draws the network", function() {
            expect(voronoiDrip.drawNetwork).toHaveBeenCalled();
        });

        it("draws the fluids", function() {
            expect(voronoiDrip.drawFluids).toHaveBeenCalled();
        });
    });
});