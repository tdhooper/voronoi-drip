var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.NetworkDesigner = VoronoiDrip.NetworkDesigner || {};

VoronoiDrip.NetworkDesigner.EDGE_COLOUR = '#000',
VoronoiDrip.NetworkDesigner.EDGE_HIGHLIGHT_COLOUR = '#5df';
VoronoiDrip.NetworkDesigner.SELECTED_COLOUR = '#09f';
VoronoiDrip.NetworkDesigner.VERTEX_HIGHLIGHT_COLOUR = VoronoiDrip.NetworkDesigner.MOVE_COLOUR = VoronoiDrip.NetworkDesigner.EDGE_HIGHLIGHT_COLOUR;
VoronoiDrip.NetworkDesigner.VERTEX_SIZE = 10;
VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE = 10;

VoronoiDrip.NetworkDesigner.create = function(spec) {
    var that = {},
        updateLoop,
        display,
        startVertex = null;

    that.highlightEdges = [];
    that.highlightVertex = null;
    that.selectedEdge = null;
    that.moveTarget = null;
    that.network = [];

    that.drawNetwork = function() {
        that.network.forEach(function(edge) {
            var isHighlighted = that.highlightEdges.indexOf(edge) !== -1
                    || that.moveTarget && that.moveTarget.edge == edge,
                isActive = that.selectedEdge == edge,
                colour = VoronoiDrip.NetworkDesigner.EDGE_COLOUR;

            if (isHighlighted) {
                colour = VoronoiDrip.NetworkDesigner.EDGE_HIGHLIGHT_COLOUR;
            } else if (isActive) {
                colour = VoronoiDrip.NetworkDesigner.SELECTED_COLOUR;
            }

            display.drawLine(
                {x: edge.va.x, y: edge.va.y},
                {x: edge.vb.x, y: edge.vb.y},
                colour
            );
        });

        var drawVertex = that.highlightVertex ? that.highlightVertex : that.moveTarget ? that.moveTarget.vertex : null;
        if (drawVertex) {
            display.drawPoint(
                drawVertex.x,
                drawVertex.y,
                VoronoiDrip.NetworkDesigner.VERTEX_SIZE,
                VoronoiDrip.NetworkDesigner.VERTEX_HIGHLIGHT_COLOUR
            );
        }
    };

    var findCloseTargets = function(x, y) {
        var vertex = new toxi.geom.Vec2D(x, y);

        var targets = that.network.map(function(edge) {
            var va = new toxi.geom.Vec2D(edge.va.x, edge.va.y),
                vb = new toxi.geom.Vec2D(edge.vb.x, edge.vb.y),
                edgeLine = new toxi.geom.Line2D(va, vb),
                closestPoint = edgeLine.closestPointTo(vertex);

            return {
                distance: closestPoint.distanceTo(vertex),
                edge: edge
            };
        });

        targets = targets.filter(function(target) {
            var withinRange = target.distance < VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE;
            return withinRange;
        });

        targets = targets.sort(function(targetA, targetB) {
            return targetA.distance > targetB.distance;
        });

        targets = targets.map(function(target) {
            var edge = target.edge;
            var va = new toxi.geom.Vec2D(edge.va.x, edge.va.y);
            if (va.distanceTo(vertex) < VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE) {
                target.vertex = edge.va;
            }
            var vb = new toxi.geom.Vec2D(edge.vb.x, edge.vb.y);
            if (vb.distanceTo(vertex) < VoronoiDrip.NetworkDesigner.HIGHLIGHT_DISTANCE) {
                target.vertex = edge.vb;
            }
            return target;
        });

        return targets;
    };

    var highlightEdgesWithVertex = function(vertex) {
        that.network.forEach(function(edge) {
            if (
                (edge.va.x == vertex.x && edge.va.y == vertex.y)
                || (edge.vb.x == vertex.x && edge.vb.y == vertex.y)
            ) {
                that.highlightEdges.push(edge);
            }
        });
    };

    var mouseDownListener = function(evt) {
        that.selectedEdge = null;
        if (that.highlightEdges.length > 0) {
            that.selectedEdge = that.highlightEdges[0];
            if (that.highlightVertex) {
                that.moveTarget = {
                    edge: that.selectedEdge,
                    vertex: that.highlightVertex
                };
                that.highlightEdges = [];
                that.highlightVertex = null;
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
            that.selectedEdge = edge;
            that.moveTarget = {
                edge: edge,
                vertex: edge.vb
            };
            startVertex = null;
            return;
        }

        var closeTargets = findCloseTargets(evt.offsetX, evt.offsetY);

        if (that.moveTarget) {
            var otherCloseTargets = closeTargets.filter(function(target) {
                return target.edge !== that.moveTarget.edge;
            });
            var closeVertex = otherCloseTargets.length > 0 ? otherCloseTargets[0].vertex : 0;
            if (closeVertex) {
                highlightEdgesWithVertex(closeVertex);
                that.moveTarget.vertex.x = closeVertex.x;
                that.moveTarget.vertex.y = closeVertex.y;
            } else {
                that.highlightEdges = [];
                that.moveTarget.vertex.x = evt.offsetX;
                that.moveTarget.vertex.y = evt.offsetY;
            }
            return;
        };

        if (closeTargets.length > 0) {
            that.highlightEdges = [closeTargets[0].edge];
            that.highlightVertex = closeTargets[0].vertex;
        } else {
            that.highlightEdges = [];
            that.highlightVertex = null;
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