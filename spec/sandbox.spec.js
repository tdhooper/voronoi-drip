describe("a Sandbox", function() {
    var sandbox,
        container,
        startAllLink;

    beforeEach(function() {
        container = document.createElement('div');
        sandbox = VoronoiDrip.Sandbox.create({
            container: container
        });
    });

    describe("when start is called", function() {

        beforeEach(function() {
            sandbox.start();
            startAllLink = container.getElementsByClassName('sandbox-start-all')[0];
        });

        it("creates a start all link", function() {
            expect(startAllLink.innerHTML).toBe('Start all');
            expect(startAllLink.getAttribute('href')).toBe('#');
        });

        describe("when add is called", function() {

            var spec,
                network,
                dripContainer,
                startLink,
                mockDrip;

            beforeEach(function() {
                network = [
                    {
                        va: {x: 150, y: 200},
                        vb: {x: 250, y: 250},
                        ca: null,
                        cb: [1],
                    },{
                        va: {x: 250, y: 250},
                        vb: {x: 250, y: 300},
                        ca: [0],
                        cb: null,
                    }
                ];
                spec = {
                    voronoiDrip: {
                        width: 300,
                        height: 300,
                        gravity: 10,
                        timeout: 100,
                        network: network
                    },
                    addFluid: {
                        volume: 10,
                        pipe: network[0],
                        vertex: network[0].va
                    }
                };
                mockDrip = jasmine.createSpyObj('voronoiDrip', ['start', 'pause', 'resume', 'addFluid']);
                spyOn(VoronoiDrip, 'create').andReturn(mockDrip);
                sandbox.add(spec);
                dripContainer = container.getElementsByClassName('sandbox-voronoi-drip')[0];
                startLink = dripContainer.getElementsByClassName('sandbox-start')[0];
            });

            it("creates a new voronoi drip", function() {
                expect(VoronoiDrip.create).toHaveBeenCalled();
            });

            it("creates a container for the new voronoi drip", function() {
                expect(container.getElementsByClassName('sandbox-voronoi-drip').length).toBe(1);
            });

            it("passes the container and spec to the new voronoi drip", function() {
                expect(VoronoiDrip.create).toHaveBeenCalledWith(spec.voronoiDrip);
                expect(spec.voronoiDrip.container).toBe(dripContainer);
            });

            it("starts and pauses the new voronoi drip", function() {
                expect(mockDrip.start).toHaveBeenCalled();
                expect(mockDrip.pause).toHaveBeenCalled();
            });

            it("creates a start link for the new voronoi drip", function() {
                expect(startLink.innerHTML).toBe('Start');
                expect(startLink.getAttribute('href')).toBe('#');
            });

            it("adds the specified fluid when the start link is clicked and resumes", function() {
                startLink.click();
                expect(mockDrip.addFluid).toHaveBeenCalledWith(
                    spec.addFluid.volume,
                    spec.addFluid.pipe,
                    spec.addFluid.vertex
                );
                expect(mockDrip.resume).toHaveBeenCalled();
            });

            describe("when add is called again", function() {

                var anotherSpec,
                    anotherDripContainer,
                    anotherStartLink,
                    anotherMockDrip;

                beforeEach(function() {
                    anotherSpec = {
                        voronoiDrip: {},
                        addFluid: {},
                    };
                    anotherMockDrip = jasmine.createSpyObj('voronoiDrip', ['start', 'pause', 'resume', 'addFluid']);
                    VoronoiDrip.create.andReturn(anotherMockDrip);
                    sandbox.add(anotherSpec);
                    anotherDripContainer = container.getElementsByClassName('sandbox-voronoi-drip')[1];
                    anotherStartLink = anotherDripContainer.getElementsByClassName('sandbox-start')[0];
                });

                it("creates a new voronoi drip", function() {
                    expect(VoronoiDrip.create).toHaveBeenCalled();
                });

                it("creates a container for the new voronoi drip", function() {
                    expect(container.getElementsByClassName('sandbox-voronoi-drip').length).toBe(2);
                });

                it("passes the container and spec to the new voronoi drip", function() {
                    expect(VoronoiDrip.create).toHaveBeenCalledWith(anotherSpec.voronoiDrip);
                    expect(anotherSpec.voronoiDrip.container).toBe(anotherDripContainer);
                });

                it("starts and pauses the new voronoi drip", function() {
                    expect(anotherMockDrip.start).toHaveBeenCalled();
                    expect(anotherMockDrip.pause).toHaveBeenCalled();
                });

                it("creates a start link for the new voronoi drip", function() {
                    expect(anotherStartLink.innerHTML).toBe('Start');
                    expect(anotherStartLink.getAttribute('href')).toBe('#');
                });

                it("adds the specified fluid when the start link is clicked and resumes", function() {
                    anotherStartLink.click();
                    expect(anotherMockDrip.addFluid).toHaveBeenCalledWith(
                        anotherSpec.addFluid.volume,
                        anotherSpec.addFluid.pipe,
                        anotherSpec.addFluid.vertex
                    );
                    expect(anotherMockDrip.resume).toHaveBeenCalled();
                });

                describe("when the start all link is clicked", function() {

                    beforeEach(function() {
                        startAllLink.click();
                    });

                    it("adds the specified fluid to all voronoi drips and resumes them", function() {
                        expect(mockDrip.addFluid).toHaveBeenCalledWith(
                            spec.addFluid.volume,
                            spec.addFluid.pipe,
                            spec.addFluid.vertex
                        );
                        expect(mockDrip.resume).toHaveBeenCalled();

                        expect(anotherMockDrip.addFluid).toHaveBeenCalledWith(
                            anotherSpec.addFluid.volume,
                            anotherSpec.addFluid.pipe,
                            anotherSpec.addFluid.vertex
                        );
                        expect(anotherMockDrip.resume).toHaveBeenCalled();
                    });

                });
            });
        });
    });
});