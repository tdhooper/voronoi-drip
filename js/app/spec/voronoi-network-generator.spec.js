define(['dev/squire', 'app/voronoi-network-generator'], function(Squire, VoronoiNetworkGenerator) {

    describe("a Voronoi Network Generator", function() {
        var vng;

        beforeEach(function() {
            vng = VoronoiNetworkGenerator.create();
        });

        describe("when createRandomDiagram is called", function() {

            var voronoi,
                injector;

            beforeEach(function(done) {
                vng = null;
                voronoi = {
                    compute: jasmine.createSpy('compute').and.returnValue('some diagram')
                };

                injector = new Squire();
                injector.mock('lib/Javascript-Voronoi/rhill-voronoi-core', Squire.Helpers.returns(voronoi));
                injector.require(['app/voronoi-network-generator'], function(MockedVoronoiNetworkGenerator) {
                    vng = MockedVoronoiNetworkGenerator.create();
                    vng.createRandomDiagram(8, 100, 100);
                    done();
                });
            });

            it("creates a random Voronoi diagram", function() {
                expect(voronoi.compute).toHaveBeenCalled();
                expect(vng.diagram).toBe('some diagram');
            });

            it("with the specified number of sites", function() {
                var sites = voronoi.compute.calls.mostRecent().args[0];
                expect(sites.length).toBe(8);
            });

            it("within the width and height", function() {
                var boundingBox = voronoi.compute.calls.mostRecent().args[1];
                expect(boundingBox).toEqual({
                    xl: 0,
                    xr: 100,
                    yt: 0,
                    yb: 100
                });
            });
        });

        describe("when connectEdges is called", function() {

            var edgeCount,
                edge;

            beforeEach(function() {
                vng.createRandomDiagram(6, 100, 100);
                edgeCount = vng.diagram.edges.length;
                expect(edgeCount).toBeGreaterThan(0);

                vng.connectEdges();
            });

            it("creates ca and cb properties for each edge", function() {
                while (edgeCount--) {
                    edge = vng.diagram.edges[edgeCount];
                    expect(edge.hasOwnProperty('ca')).toBe(true);
                    expect(edge.hasOwnProperty('cb')).toBe(true);
                }
            });

            it("creates lists of edges also connected to each vertex", function() {
                var hasConnections;

                var verifyConnections = function(edges, vertex) {
                    var edgeCount = edges.length,
                        edgeIndex,
                        edge,
                        matches;

                    while (edgeCount--) {
                        edgeIndex = edges[edgeCount];
                        edge = vng.diagram.edges[edgeIndex];

                        matches = 0;
                        if (edge.va.x == vertex.x && edge.va.y == vertex.y) {
                            matches++;
                        }
                        if (edge.vb.x == vertex.x && edge.vb.y == vertex.y) {
                            matches++;
                        }
                        expect(matches).toBe(1);
                    }
                };

                while (edgeCount--) {
                    edge = vng.diagram.edges[edgeCount];
                    hasConnections = false;

                    if (edge.ca !== null) {
                        verifyConnections(edge.ca, edge.va);
                        hasConnections = true;
                    }

                    if (edge.cb !== null) {
                        verifyConnections(edge.cb, edge.vb);
                        hasConnections = true;
                    }

                    expect(hasConnections).toBe(true);
                }
            });
        });

        describe("when generate is called", function() {

            var network;

            beforeEach(function() {
                spyOn(vng, 'createRandomDiagram');
                spyOn(vng, 'connectEdges');
                vng.diagram = {
                    edges: 'some edges'
                };
                network = vng.generate(3, 50, 60);
            });

            it("creates a random diagram", function() {
                expect(vng.createRandomDiagram).toHaveBeenCalledWith(3, 50, 60);
            });

            it("connects it's edges", function() {
               expect(vng.connectEdges).toHaveBeenCalled();
            });

            it("returns the edges", function() {
                expect(network).toBe('some edges');
            });
        });
    });
});