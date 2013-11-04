describe("a Network Designer", function() {

    var designer,
        mockUpdateLoop = jasmine.createSpyObj('updateLoop', ['start', 'stop']),
        mockDisplay,
        canvas;

    var mouseEvent = function(target, type, x, y) {
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent(type, true, true, window,
            0, 0, 0, target.offsetLeft + x, target.offsetTop + y, false, false, false, false, 0, null);
        target.dispatchEvent(evt);
    };

    // from http://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
    var keyEvent = function(k) {
        var oEvent = document.createEvent('KeyboardEvent');
        // Chromium Hack
        Object.defineProperty(oEvent, 'keyCode', {
            get : function() {
                return this.keyCodeVal;
            }
        });
        Object.defineProperty(oEvent, 'which', {
            get : function() {
                return this.keyCodeVal;
            }
        });
        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
        } else {
            oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
        }
        oEvent.keyCodeVal = k;
        if (oEvent.keyCode !== k) {
            alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
        }
        document.dispatchEvent(oEvent);
    };

    beforeEach(function() {
        spyOn(VoronoiDrip.UpdateLoop, 'create').andReturn(mockUpdateLoop);
        mockDisplay = jasmine.createSpyObj('display', ['start', 'drawLine', 'drawPoint', 'clear']);
        spyOn(VoronoiDrip.Display, 'create').andReturn(mockDisplay);

        canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        mockDisplay.canvas = canvas;

        designer = VoronoiDrip.NetworkDesigner.create({
            width: 500,
            height: 500,
            timeout: 60
        });

        designer.start();
    });

    afterEach(function() {
        document.body.removeChild(canvas);
    });

    // if over nothing
        // if click and release, create new edge with vertex
            // other vertex is being moved
            // place when clicked again
        // if click, create new edge with vertex
            // other vertex is being moved
            // place when released

    // if over vertex, highlight vertex and nearest edge
        // if click and release, perma-highlight vertex and edge
            // if delete, delete edge
        // if click and move, move vertex
            // place when released

    describe("when the mouse is pressed on the canvas", function() {

        beforeEach(function() {
            mouseEvent(canvas, 'mousedown', 10, 20);
        });

        describe("and immediately released", function() {

            beforeEach(function() {
                mouseEvent(canvas, 'mouseup', 10, 20);
            });

            it("does not create an edge", function() {
                expect(designer.network).toEqual([]);
            });

            describe("when the mouse moves", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mousemove', 18, 60);
                });

                it("does not create an edge", function() {
                    expect(designer.network).toEqual([]);
                });
            });
        });

        describe("when the mouse moves", function() {

            beforeEach(function() {
                mouseEvent(canvas, 'mousemove', 18, 160);
            });

            it("creates a new edge between the pressed and moved to points", function() {
                expect(designer.network[0]).toEqual({
                    va: {x: 10, y: 20},
                    vb: {x: 18, y: 160}
                });
            });

            it("selects the edge", function() {
                expect(designer.selectedEdge).toBe(designer.network[0]);
            });

            it("makes the edge's vertex movable", function() {
                expect(designer.moveTarget.edge).toBe(designer.network[0]);
                expect(designer.moveTarget.vertex).toBe(designer.network[0].vb);
            });

            it("doesn't highlight the edge", function() {
                expect(designer.highlightEdges.length).toBe(0);
            });

            describe("when the mouse moves again", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mousemove', 3, 5);
                });

                it("moves the other vertex", function() {
                    expect(designer.network[0]).toEqual({
                        va: {x: 10, y: 20},
                        vb: {x: 3, y: 5}
                    });
                });
            });

            describe("when the mouse is released", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mouseup', 18, 160);
                });

                it("makes the vertex unmovable", function() {
                    expect(designer.moveTarget).toBe(null);
                });

                describe("and the mouse is moved to a new position and pressed", function() {

                    beforeEach(function() {
                        mouseEvent(canvas, 'mousemove', 80, 92);
                        mouseEvent(canvas, 'mousedown', 80, 92);
                    });

                    it("does not create an edge", function() {
                        expect(designer.network.length).toEqual(1);
                    });

                    describe("when the mouse moves", function() {

                        beforeEach(function() {
                            mouseEvent(canvas, 'mousemove', 133, 189);
                        });

                        it("creates a new edge between the pressed and moved to points", function() {
                            expect(designer.network[1]).toEqual({
                                va: {x: 80, y: 92},
                                vb: {x: 133, y: 189}
                            });
                        });

                        it("makes the edge's vertex movable", function() {
                            expect(designer.moveTarget.edge).toBe(designer.network[1]);
                            expect(designer.moveTarget.vertex).toBe(designer.network[1].vb);
                        });

                        describe("and the mouse moves near an existing edge", function() {

                            beforeEach(function() {
                                mouseEvent(canvas, 'mousemove', 6, 90);
                            });

                            it("doesn't highlight the edge", function() {
                                expect(designer.highlightEdges.length).toBe(0);
                            });
                        });

                        describe("when the mouse moves near an existing vertex", function() {

                            beforeEach(function() {
                                mouseEvent(canvas, 'mousemove', 12, 22);
                            });

                            it("snaps to it", function() {
                                expect(designer.network[1]).toEqual({
                                    va: {x: 80, y: 92},
                                    vb: {x: 10, y: 20}
                                });
                            });

                            it("highlights the other edges sharing the vertex", function() {
                                expect(designer.highlightEdges[0]).toBe(designer.network[0]);
                            });

                            describe("when the mouse moves away from the existing vertex", function() {

                                beforeEach(function() {
                                    mouseEvent(canvas, 'mousemove', 100, 300);
                                });

                                it("removes the highlights", function() {
                                    expect(designer.highlightEdges.length).toBe(0);
                                });
                            });
                        });

                        describe("when the mouse moves near it's own vertex", function() {

                            beforeEach(function() {
                                mouseEvent(canvas, 'mousemove', 135, 190);
                            });

                            it("does not snap to it", function() {
                                expect(designer.network[1]).toEqual({
                                    va: {x: 80, y: 92},
                                    vb: {x: 135, y: 190}
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe("when there is a network", function() {

        beforeEach(function() {
            designer.network = [
                {
                    va: {x: 0, y: 0},
                    vb: {x: 0, y: 10}
                },{
                    va: {x: 10, y: 20},
                    vb: {x: 0, y: 10}
                },{
                    va: {x: 0, y: 10},
                    vb: {x: -20, y: 10}
                },{
                    va: {x: 10, y: 20},
                    vb: {x: 10, y: -10}
                },{
                    va: {x: 10, y: 20},
                    vb: {x: 0, y: 30}
                }
            ];
        });

        describe("and the mouse moves near an edge", function() {

            beforeEach(function() {
                mouseEvent(canvas, 'mousemove', 12, 5);
            });

            it("highlights the edge", function() {
                expect(designer.highlightEdges[0]).toEqual(designer.network[3]);
            });

            describe("then the mouse moves away from the edge", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mousemove', 50, 50);
                });

                it("removes the highlight", function() {
                    expect(designer.highlightEdges.length).toBe(0);
                });
            });

            describe("and the mouse is pressed", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mousedown', 12, 5);
                });

                it("selects the edge", function() {
                    expect(designer.selectedEdge).toEqual(designer.network[3]);
                });

                it("keeps the edge highlighted", function() {
                    expect(designer.highlightEdges[0]).toEqual(designer.network[3]);
                })

                describe("when the mouse is released and moved a little", function() {

                    beforeEach(function() {
                        mouseEvent(canvas, 'mouseup', 12, 5);
                        mouseEvent(canvas, 'mousemove', 11, 5);
                    });

                    it("keeps the edge highlighted", function() {
                        expect(designer.highlightEdges[0]).toBe(designer.network[3]);
                    });
                });

                describe("when the mouse is released and moved near one of it's vertices", function() {

                    beforeEach(function() {
                        mouseEvent(canvas, 'mouseup', 12, 5);
                        mouseEvent(canvas, 'mousemove', 10, -10);
                    });

                    it("highlights the vertex", function() {
                        expect(designer.highlightVertex).toBe(designer.network[3].vb);
                    });
                });

                describe("when delete is pressed", function() {

                    var selectedEdge;

                    beforeEach(function() {
                        selectedEdge = designer.selectedEdge;
                        keyEvent(46); // delete
                    });

                    it("deletes the edge", function() {
                        expect(designer.network.indexOf(selectedEdge)).toBe(-1);
                        expect(designer.selectedEdge).toBe(null);
                    });
                });

                describe("when backspace is pressed", function() {

                    var selectedEdge;

                    beforeEach(function() {
                        selectedEdge = designer.selectedEdge;
                        keyEvent(8); // backspace
                    });

                    it("deletes the edge", function() {
                        expect(designer.network.indexOf(selectedEdge)).toBe(-1);
                        expect(designer.selectedEdge).toBe(null);
                    });
                });

                describe("then the mouse moves away and is pressed", function() {

                    beforeEach(function() {
                        mouseEvent(canvas, 'mousemove', 50, 50);
                        mouseEvent(canvas, 'mousedown', 50, 50);
                    });

                    it("deselects the edge", function() {
                        expect(designer.selectedEdge).toBe(null);
                    });
                });
            });
        });

        describe("and the mouse moves near a vertex", function() {

            beforeEach(function() {
                mouseEvent(canvas, 'mousemove', 12, 18);
            });

            it("highlights the vertex and nearest edge", function() {
                expect(designer.highlightVertex).toEqual(designer.network[3].va);
                expect(designer.highlightEdges[0]).toEqual(designer.network[3]);
            });

            describe("then the mouse moves away from the vertex", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mousemove', 50, 50);
                });

                it("removes the highlight", function() {
                    expect(designer.highlightEdges.length).toBe(0);
                    expect(designer.highlightVertex).toBe(null);
                });
            });

            describe("and the mouse is pressed", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mousedown', 12, 5);
                });

                it("makes the edge's vertex movable", function() {
                    expect(designer.moveTarget.edge).toEqual(designer.network[3]);
                    expect(designer.moveTarget.vertex).toEqual(designer.network[3].va);
                });

                it("removes the highlight", function() {
                   expect(designer.highlightEdges.length).toBe(0);
                   expect(designer.highlightVertex).toBe(null);
                })
            });
        });

        describe("and drawNetwork is called", function() {

            it("draws the network", function() {
                designer.drawNetwork();
                designer.network.forEach(function(edge) {
                    expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                        {x: edge.va.x, y: edge.va.y},
                        {x: edge.vb.x, y: edge.vb.y},
                        VoronoiDrip.NetworkDesigner.EDGE_COLOUR
                    );
                })
            });

            describe("and an edge and vertex are highlighted", function() {

                beforeEach(function() {
                    designer.highlightEdges = [designer.network[1]];
                    designer.highlightVertex = designer.network[1].vb;
                });

                it("draws the highlighted edge in the highlight colour", function() {
                    designer.drawNetwork();
                    expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                        {x: designer.network[1].va.x, y: designer.network[1].va.y},
                        {x: designer.network[1].vb.x, y: designer.network[1].vb.y},
                        VoronoiDrip.NetworkDesigner.HIGHLIGHT_COLOUR
                    );
                });

                it("draws the highlighted vertex in the vertex highlight colour", function() {
                    designer.drawNetwork();
                    expect(mockDisplay.drawPoint).toHaveBeenCalledWith(
                        designer.network[1].vb.x,
                        designer.network[1].vb.y,
                        VoronoiDrip.NetworkDesigner.VERTEX_SIZE,
                        VoronoiDrip.NetworkDesigner.HIGHLIGHT_COLOUR
                    );
                });
            });

            describe("and an edge's vertex is being moved", function() {

                beforeEach(function() {
                    designer.moveTarget = {
                        edge: designer.network[1],
                        vertex: designer.network[1].vb
                    };
                });

                it("draws the edge in the move colour", function() {
                    designer.drawNetwork();
                    expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                        {x: designer.network[1].va.x, y: designer.network[1].va.y},
                        {x: designer.network[1].vb.x, y: designer.network[1].vb.y},
                        VoronoiDrip.NetworkDesigner.MOVE_COLOUR
                    );
                });

                it("draws the vertex in the move colour", function() {
                    designer.drawNetwork();
                    expect(mockDisplay.drawPoint).toHaveBeenCalledWith(
                        designer.network[1].vb.x,
                        designer.network[1].vb.y,
                        VoronoiDrip.NetworkDesigner.VERTEX_SIZE,
                        VoronoiDrip.NetworkDesigner.MOVE_COLOUR
                    );
                });
            });

            describe("and an edge is selected", function() {

                beforeEach(function() {
                    designer.selectedEdge = designer.network[1];
                });

                it("draws the selected edge in the selected colour", function() {
                    designer.drawNetwork();
                    expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                        {x: designer.network[1].va.x, y: designer.network[1].va.y},
                        {x: designer.network[1].vb.x, y: designer.network[1].vb.y},
                        VoronoiDrip.NetworkDesigner.SELECTED_COLOUR
                    );
                });
            });
        });
    });

    describe("when update is called", function() {

        beforeEach(function() {
            spyOn(designer, 'drawNetwork');
            designer.update();
        });

        it("clears the display", function() {
            expect(mockDisplay.clear).toHaveBeenCalled();
        });

        it("draws the current network", function() {
            expect(designer.drawNetwork).toHaveBeenCalled();
        });
    });

    describe("when start is called", function() {

        it("creates a new display at the specified width and height", function() {
            var expectedSpec = {
                width: 500,
                height: 500
            }
            expect(VoronoiDrip.Display.create).toHaveBeenCalledWith(expectedSpec);
        });

        it("starts the display", function() {
            expect(mockDisplay.start).toHaveBeenCalled();
        });

        it("creates a new update loop with the specified timeout and update function", function() {
            var expectedSpec = {
                update: designer.update,
                timeout: 60
            }
            expect(VoronoiDrip.UpdateLoop.create).toHaveBeenCalledWith(expectedSpec);
        });

        it("starts the update loop", function() {
            expect(mockUpdateLoop.start).toHaveBeenCalled();
        });
    });

    it("should stop the update loop when stop is called", function() {
        designer.stop();
        expect(mockUpdateLoop.stop).toHaveBeenCalled();
    });
});