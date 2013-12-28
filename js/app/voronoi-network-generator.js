/*

    Generate a network of pipes for use in the VoronoiDrip simulation

    generate
        returns a randomly generated network of pipes

*/

define(['lib/Javascript-Voronoi/rhill-voronoi-core'], function(RhillVoronoi) {

    var VoronoiNetworkGenerator = {};

    VoronoiNetworkGenerator.create = function() {
        var that = {};
        that.voronoi = new RhillVoronoi();

        that.createRandomDiagram = function(numSites, width, height) {
            var sites = [];
            for (var i = 0; i < numSites; i++) {
                sites.push({
                    x: Math.random() * width,
                    y: Math.random() * height
                });
            }

            var boundingBox = {
                xl: 0,
                xr: width,
                yt: 0,
                yb: height
            };

            that.diagram = that.voronoi.compute(sites, boundingBox);
        };

        that.getCell = function(id) {
            var cellCount = that.diagram.cells.length;
            while (cellCount--) {
                var cell = that.diagram.cells[cellCount];
                if (cell.site.voronoiId == id) {
                    return cell;
                }
            }
        };

        that.getEdgesForPoint = function(point, originalEdge) {
            var edges = [],
                sites = [originalEdge.lSite, originalEdge.rSite];

            var addNewEdgeForSite = function(site) {
                if ( ! site) {
                    return;
                }
                var cell = that.getCell(site.voronoiId);
                var halfedgeCount = cell.halfedges.length;
                while (halfedgeCount--) {
                    var edge = cell.halfedges[halfedgeCount].edge;
                    if (edge == originalEdge || edges.indexOf(edge) !== -1) {
                        continue;
                    }
                    if (
                        (edge.va.x == point.x && edge.va.y == point.y)
                        || (edge.vb.x == point.x && edge.vb.y == point.y)
                    ) {
                        // edges.push(edge);
                        edges.push(that.diagram.edges.indexOf(edge));
                        return;
                    }
                }
            };

            addNewEdgeForSite(originalEdge.lSite);
            addNewEdgeForSite(originalEdge.rSite);

            var edgesCount = edges.length;
            while (edgesCount--) {
                var edge = edges[edgesCount];
                if (sites.indexOf(edge.lSite) == -1) {
                    addNewEdgeForSite(edge.lSite);
                }
                if (sites.indexOf(edge.rSite) == -1) {
                    addNewEdgeForSite(edge.rSite);
                }
            }
            return edges;
        };

        that.connectEdges = function() {
            var edgeCount = that.diagram.edges.length,
                edge;

            while(edgeCount--) {
                edge = that.diagram.edges[edgeCount];
                edge.ca = that.getEdgesForPoint(edge.va, edge);
                edge.cb = that.getEdgesForPoint(edge.vb, edge);
            }
        };

        that.generate = function(numSites, width, height) {
            that.createRandomDiagram(numSites, width, height);
            that.connectEdges();
            return that.diagram.edges;
        };

        return that;
    };

    return VoronoiNetworkGenerator;
});