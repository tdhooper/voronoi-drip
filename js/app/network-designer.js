define(['app/display', 'app/update-loop', 'lib/toxi/geom/Vec2D', 'lib/toxi/geom/Line2D'], function(Display, UpdateLoop, Vec2D, Line2D) {
    var NetworkDesigner = {};

    NetworkDesigner.EDGE_COLOUR = '#000',
    NetworkDesigner.HIGHLIGHT_COLOUR = '#5df';
    NetworkDesigner.SELECTED_COLOUR = '#09f';
    NetworkDesigner.MOVE_COLOUR = NetworkDesigner.HIGHLIGHT_COLOUR;
    NetworkDesigner.VERTEX_SIZE = 10;
    NetworkDesigner.HIGHLIGHT_DISTANCE = 10;

    NetworkDesigner.create = function(spec) {
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
                    colour = NetworkDesigner.EDGE_COLOUR;

                if (isHighlighted) {
                    colour = NetworkDesigner.HIGHLIGHT_COLOUR;
                } else if (isActive) {
                    colour = NetworkDesigner.SELECTED_COLOUR;
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
                    NetworkDesigner.VERTEX_SIZE,
                    NetworkDesigner.HIGHLIGHT_COLOUR
                );
            }
        };

        var findCloseTargets = function(x, y) {
            var vertex = new Vec2D(x, y);

            var targets = that.network.map(function(edge) {
                var va = new Vec2D(edge.va.x, edge.va.y),
                    vb = new Vec2D(edge.vb.x, edge.vb.y),
                    edgeLine = new Line2D(va, vb),
                    closestPoint = edgeLine.closestPointTo(vertex);

                return {
                    distance: closestPoint.distanceTo(vertex),
                    edge: edge
                };
            });

            targets = targets.filter(function(target) {
                var withinRange = target.distance < NetworkDesigner.HIGHLIGHT_DISTANCE;
                return withinRange;
            });

            targets = targets.sort(function(targetA, targetB) {
                return targetA.distance > targetB.distance;
            });

            targets = targets.map(function(target) {
                var edge = target.edge;
                var va = new Vec2D(edge.va.x, edge.va.y);
                if (va.distanceTo(vertex) < NetworkDesigner.HIGHLIGHT_DISTANCE) {
                    target.vertex = edge.va;
                }
                var vb = new Vec2D(edge.vb.x, edge.vb.y);
                if (vb.distanceTo(vertex) < NetworkDesigner.HIGHLIGHT_DISTANCE) {
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

        var connectTargetToOthers = function(target) {
            var vertex = target.vertex,
                edge = target.edge,
                connections = edge.va.x == vertex.x && edge.va.y == vertex.y ? edge.ca : edge.cb,
                targetIndex = that.network.indexOf(edge);

            that.network.forEach(function(edge, index) {
                if (edge == target.edge) {
                    return;
                }
                if (edge.ca.indexOf(targetIndex) !== -1) {
                    return;
                }
                if (edge.cb.indexOf(targetIndex) !== -1) {
                    return;
                }
                if (edge.va.x == vertex.x && edge.va.y == vertex.y) {
                    edge.ca.push(targetIndex);
                    connections.push(index);
                }
                if (edge.vb.x == vertex.x && edge.vb.y == vertex.y) {
                    edge.cb.push(targetIndex);
                    connections.push(index);
                }
            });
        };

        var disconnectTargetFromOthers = function(target) {
            var vertex = target.vertex,
                edge = target.edge,
                connections = edge.va.x == vertex.x && edge.va.y == vertex.y ? edge.ca : edge.cb,
                connectionsCount = connections.length,
                targetIndex = that.network.indexOf(edge);

            // Count backwards so we can remove items as we go
            while (connectionsCount--) {
                var index = connections[connectionsCount],
                    edge = that.network[index];

                var connectedIndexA = edge.ca.indexOf(targetIndex);
                if (connectedIndexA !== -1) {
                    if (edge.va.x !== vertex.x || edge.va.y !== vertex.y) {
                        edge.ca.splice(connectedIndexA, 1);
                        connections.splice(connectionsCount, 1);
                    }
                }

                var connectedIndexB = edge.cb.indexOf(targetIndex);
                if (connectedIndexB !== -1) {
                    if (edge.vb.x !== vertex.x || edge.vb.y !== vertex.y) {
                        edge.cb.splice(connectedIndexB, 1);
                        connections.splice(connectionsCount, 1);
                    }
                }
            };
        };

        var deleteEdge = function(edge) {
            var deleteIndex = that.network.indexOf(edge);

            var removeDeleted = function(connectedIndex) {
                return connectedIndex !== deleteIndex;
            }

            var updateIndex = function(connectedIndex) {
                if (connectedIndex > deleteIndex) {
                    return connectedIndex - 1;
                }
                return connectedIndex;
            }

            that.network.forEach(function(edge, index) {
                edge.ca = edge.ca.filter(removeDeleted).map(updateIndex);
                edge.cb = edge.cb.filter(removeDeleted).map(updateIndex);
            });

            that.network.splice(deleteIndex, 1);
        }

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
                    vb: {x: evt.offsetX, y: evt.offsetY},
                    ca: [],
                    cb: []
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
                    connectTargetToOthers(that.moveTarget);
                } else {
                    that.highlightEdges = [];
                    that.moveTarget.vertex.x = evt.offsetX;
                    that.moveTarget.vertex.y = evt.offsetY;
                    disconnectTargetFromOthers(that.moveTarget);
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
                    deleteEdge(that.selectedEdge);
                    that.selectedEdge = null;
                    evt.preventDefault();
                }
            }
        };

        that.start = function() {
            display = Display.create({
                width: spec.width,
                height: spec.height
            });
            display.start();

            display.canvas.addEventListener('mousedown', mouseDownListener);
            display.canvas.addEventListener('mousemove', mouseMoveListener);
            display.canvas.addEventListener('mouseup', mouseUpListener);
            document.addEventListener('keydown', keydownListener);

            updateLoop = UpdateLoop.create({
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

    return NetworkDesigner;
});