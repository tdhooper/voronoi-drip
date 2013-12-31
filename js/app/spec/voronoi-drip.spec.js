define(['lib/Squire'], function(Squire) {

    describe("a Voronoi Drip simulation", function() {
        var spec,
            edges,
            container,
            VoronoiDrip,
            voronoiDrip,
            UpdateLoop,
            mockUpdateLoop = jasmine.createSpyObj('updateLoop', ['start', 'stop']),
            FluidNetworkSimulation,
            Display;

        beforeEach(function() {
            edges = [
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

            container = document.createElement('div');
            document.body.appendChild(container);

            spec = {
                width: 300,
                height: 300,
                fluidColour: "#ff0",
                pipeColour: '#000',
                gravity: 3,
                timeout: 60,
                container: container,
                network: edges
            };

            UpdateLoop = jasmine.createSpyObj('UpdateLoop', ['create'])
            UpdateLoop.create.andReturn(mockUpdateLoop);

            FluidNetworkSimulation = jasmine.createSpyObj('FluidNetworkSimulation', ['create'])
            Display = jasmine.createSpyObj('Display', ['create'])

            injector = new Squire();
            injector.mock('app/update-loop', UpdateLoop);
            injector.mock('app/fluid-network-simulation', FluidNetworkSimulation);
            injector.mock('app/display', Display);

            VoronoiDrip = null;

            injector.require(['app/voronoi-drip'], function(VoronoiDripLoaded) {
                VoronoiDrip = VoronoiDripLoaded;
            });

            waitsFor(function() {
                return VoronoiDrip;
            }, 'VoronoiDrip should be loaded', 750);

            runs(function() {
                voronoiDrip = VoronoiDrip.create(spec);
            })
        });

        afterEach(function() {
            document.body.removeChild(container);
        });

        describe("when drawNetwork is called", function() {

            var mockDisplay = jasmine.createSpyObj('display', ['drawLine']);

            beforeEach(function() {
                voronoiDrip.display = mockDisplay;
                voronoiDrip.drawNetwork();
                expect(voronoiDrip.network.length).toBeGreaterThan(0);
            });

            it("draws the network in the provided pipeColour", function() {
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

            it("defaults to the PIPE_COLOUR", function() {
                var spec = {
                    width: 300,
                    height: 300,
                    timeout: 60,
                    container: container,
                    network: edges
                };
                var voronoiDrip = VoronoiDrip.create(spec);
                voronoiDrip.display = mockDisplay;
                voronoiDrip.drawNetwork();
                expect(mockDisplay.drawLine.mostRecentCall.args[2]).toBe(VoronoiDrip.PIPE_COLOUR);
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

            var mockSimulation = jasmine.createSpyObj('fluidNetworkSimulation', ['start', 'addFluid']),
                mockDisplay = jasmine.createSpyObj('display', ['start']);

            beforeEach(function() {
                FluidNetworkSimulation.create.andReturn(mockSimulation);
                Display.create.andReturn(mockDisplay);
                spyOn(voronoiDrip, 'drawNetwork');
                voronoiDrip.start();
            });

            it("creates a new fluid network simulation with the edges and gravity, and attaches it to the voronoiDrip", function() {

                var expectedSpec = {
                    pipes: spec.network,
                    gravity: 3
                }
                expect(FluidNetworkSimulation.create).toHaveBeenCalledWith(expectedSpec);
                expect(voronoiDrip.fluidNetworkSimulation).toBe(mockSimulation);
            });

            it("starts the fluid network simulation", function() {
                expect(mockSimulation.start).toHaveBeenCalled();
            });

            it("creates a new display in the container at the specified width and height, and attaches it to the voronoiDrip", function() {
                var expectedSpec = {
                    width: 300,
                    height: 300,
                    container: container
                }
                expect(Display.create).toHaveBeenCalledWith(expectedSpec);
                expect(voronoiDrip.display).toBe(mockDisplay);
            });

            it("starts the display", function() {
                expect(mockDisplay.start).toHaveBeenCalled();
            });

            it("creates a new update loop with the specified timeout and update function", function() {
                var expectedSpec = {
                    update: voronoiDrip.update,
                    timeout: 60
                }
                expect(UpdateLoop.create).toHaveBeenCalledWith(expectedSpec);
            });

            it("uses the default TIMEOUT if none is provided", function() {
                var spec = {
                    width: 300,
                    height: 300,
                    container: container,
                    network: edges
                };
                var voronoiDrip = VoronoiDrip.create(spec);
                spyOn(voronoiDrip, 'drawNetwork');
                voronoiDrip.start();
                var expectedSpec = {
                    update: voronoiDrip.update,
                    timeout: VoronoiDrip.TIMEOUT
                }
                expect(UpdateLoop.create).toHaveBeenCalledWith(expectedSpec);
            });

            it("should start the update loop when play is called", function() {
                voronoiDrip.play();
                expect(mockUpdateLoop.start).toHaveBeenCalled();
            });

            it("should stop the update loop when stop is called", function() {
                voronoiDrip.stop();
                expect(mockUpdateLoop.stop).toHaveBeenCalled();
            });

            it("should stop the update loop when pause is called", function() {
                voronoiDrip.pause();
                expect(mockUpdateLoop.stop).toHaveBeenCalled();
            });
        });

        describe("when addFluid is called", function() {

            var mockSimulation;

            beforeEach(function() {
                mockSimulation = jasmine.createSpyObj('fluidNetworkSimulation', ['addFluid']);
                voronoiDrip.fluidNetworkSimulation = mockSimulation;
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
                    expect(mockSimulation.addFluid).toHaveBeenCalledWith(
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
                    expect(mockSimulation.addFluid).toHaveBeenCalledWith(
                        'some edge',
                        'some vertex',
                        50
                    );
                });
            });
        });

        describe("when drawFluids is called", function() {
            var mockSimulation = jasmine.createSpyObj('fluidNetworkSimulation', ['update']),
                mockDisplay = jasmine.createSpyObj('display', ['drawLine', 'clear']);

            beforeEach(function() {
                mockSimulation.pipes = [
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
                voronoiDrip.fluidNetworkSimulation = mockSimulation;
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

            it("defaults to the FLUID_COLOUR", function() {
                var spec = {
                    width: 300,
                    height: 300,
                    timeout: 60,
                    container: container,
                    network: edges
                };
                var voronoiDrip = VoronoiDrip.create(spec);
                voronoiDrip.fluidNetworkSimulation = mockSimulation;
                voronoiDrip.display = mockDisplay;
                voronoiDrip.drawFluids();
                expect(mockDisplay.drawLine.mostRecentCall.args[2]).toBe(VoronoiDrip.FLUID_COLOUR);
            });
        });

        describe("when update is called", function() {
            var mockSimulation = jasmine.createSpyObj('fluidNetworkSimulation', ['update']),
                mockDisplay = jasmine.createSpyObj('display', ['drawLine', 'clear']);

            beforeEach(function() {
                spyOn(voronoiDrip, 'drawNetwork');
                spyOn(voronoiDrip, 'drawFluids');
                voronoiDrip.fluidNetworkSimulation = mockSimulation;
                voronoiDrip.display = mockDisplay;
                voronoiDrip.update();
            });

            it("updates the fluid network simulation", function() {
                expect(mockSimulation.update).toHaveBeenCalled();
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
});