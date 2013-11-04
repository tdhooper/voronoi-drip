var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.NetworkDesigner = VoronoiDrip.NetworkDesigner || {};

VoronoiDrip.NetworkDesigner.EDGE_COLOUR = '#000',
VoronoiDrip.NetworkDesigner.EDGE_HIGHLIGHT_COLOUR = '#5df';
VoronoiDrip.NetworkDesigner.EDGE_ACTIVE_COLOUR = '#09f';
VoronoiDrip.NetworkDesigner.VERTEX_HIGHLIGHT_COLOUR = VoronoiDrip.NetworkDesigner.EDGE_HIGHLIGHT_COLOUR;
VoronoiDrip.NetworkDesigner.VERTEX_SIZE = 10;
VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE = 10;

VoronoiDrip.NetworkDesigner.create = function(spec) {
    var that = {},
        updateLoop,
        display,
        startVertex = null;

    that.highlightTarget = null;
    that.selectedEdge = null;
    that.moveTarget = null;
    that.network = [];

    that.drawNetwork = function() {
        that.network.forEach(function(edge) {
            var isHighlighted = that.highlightTarget && that.highlightTarget.edge && that.highlightTarget.edge == edge,
                isActive = that.selectedEdge == edge,
                colour = VoronoiDrip.NetworkDesigner.EDGE_COLOUR;

            if (isHighlighted) {
                colour = VoronoiDrip.NetworkDesigner.EDGE_HIGHLIGHT_COLOUR;
            } else if (isActive) {
                colour = VoronoiDrip.NetworkDesigner.EDGE_ACTIVE_COLOUR;
            }

            display.drawLine(
                {x: edge.va.x, y: edge.va.y},
                {x: edge.vb.x, y: edge.vb.y},
                colour
            );
        });

        if (that.highlightTarget && that.highlightTarget.vertex) {
            display.drawPoint(
                that.highlightTarget.vertex.x,
                that.highlightTarget.vertex.y,
                VoronoiDrip.NetworkDesigner.VERTEX_SIZE,
                VoronoiDrip.NetworkDesigner.VERTEX_HIGHLIGHT_COLOUR
            );
        }
    };

    var findCloseTarget = function(x, y, excludeTarget) {
        var target = null,
            vertex = new toxi.geom.Vec2D(x, y);

        var edgeDistances = that.network.map(function(edge) {
            var va = new toxi.geom.Vec2D(edge.va.x, edge.va.y),
                vb = new toxi.geom.Vec2D(edge.vb.x, edge.vb.y),
                edgeLine = new toxi.geom.Line2D(va, vb),
                closestPoint = edgeLine.closestPointTo(vertex);

            return {
                distance: closestPoint.distanceTo(vertex),
                originalEdge: edge
            };
        });

        edgeDistances = edgeDistances.filter(function(edge) {
            var withinRange = edge.distance < VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE,
                isExcluded = excludeTarget && excludeTarget.edge && excludeTarget.edge == edge.originalEdge;
            return withinRange && ! isExcluded;
        });

        edgeDistances = edgeDistances.sort(function(edgeA, edgeB) {
            return edgeA.distance > edgeB.distance;
        });

        if (edgeDistances.length) {
            var edge = edgeDistances[0].originalEdge;
            target = {
                edge: edge
            };

            var va = new toxi.geom.Vec2D(edge.va.x, edge.va.y);
            if (va.distanceTo(vertex) < VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE) {
                target.vertex = edge.va;
                return target;
            }

            var vb = new toxi.geom.Vec2D(edge.vb.x, edge.vb.y);
            if (vb.distanceTo(vertex) < VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE) {
                target.vertex = edge.vb;
                return target;
            }
        };

        return target;
    };

    var mouseDownListener = function(evt) {
        that.selectedEdge = null;
        if (that.highlightTarget) {
            that.selectedEdge = that.highlightTarget.edge;
            if (that.highlightTarget.vertex) {
                that.moveTarget = {
                    edge: that.highlightTarget.edge,
                    vertex: that.highlightTarget.vertex
                };
            }
        } else {
            startVertex = {x: evt.offsetX, y: evt.offsetY};
        }
    };

    var mouseMoveListener = function(evt) {
        if (startVertex) {
            var edge = {
                va: startVertex,
                vb: {x: evt.offsetX, y: evt.offsetY}
            };
            that.network.push(edge);
            that.highlightTarget = that.moveTarget = {
                edge: edge,
                vertex: edge.vb
            };
            that.selectedEdge = edge;
            startVertex = null;
            return;
        }

        if (that.moveTarget) {
            var closeTarget = findCloseTarget(evt.offsetX, evt.offsetY, that.moveTarget);
        } else {
            var closeTarget = findCloseTarget(evt.offsetX, evt.offsetY);
        }

        if (that.moveTarget) {
            if (closeTarget && closeTarget.vertex) {
                that.moveTarget.vertex.x = closeTarget.vertex.x;
                that.moveTarget.vertex.y = closeTarget.vertex.y;
            } else {
                that.moveTarget.vertex.x = evt.offsetX;
                that.moveTarget.vertex.y = evt.offsetY;
            }
            return;
        }

        if (closeTarget) {
            that.highlightTarget = closeTarget;
        } else {
            that.highlightTarget = null;
        }

    };

    var mouseUpListener = function(evt) {
        startVertex = null;
        that.moveTarget = null;
    };

    var keydownListener = function(evt) {
        if (evt.which == 46 || evt.which == 8) {
            if (that.selectedEdge) {
                var index = that.network.indexOf(that.selectedEdge);
                that.network.splice(index, 1);
                that.selectedEdge = null;
                evt.preventDefault();
            }
        }
    };

    that.start = function() {
        display = VoronoiDrip.Display.create({
            width: spec.width,
            height: spec.height
        });
        display.start();

        display.canvas.addEventListener('mousedown', mouseDownListener);
        display.canvas.addEventListener('mousemove', mouseMoveListener);
        display.canvas.addEventListener('mouseup', mouseUpListener);
        document.addEventListener('keydown', keydownListener);

        updateLoop = VoronoiDrip.UpdateLoop.create({
            timeout: spec.timeout,
            update: that.update
        });
        updateLoop.start();
    };

    that.update = function() {
        display.clear();
        that.drawNetwork();
    };

    that.stop = function() {
        updateLoop.stop();
    };

    return that;
};