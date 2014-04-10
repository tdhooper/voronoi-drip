define(['lib/Squire'], function(Squire) {


    describe("a Network Designer", function() {

        var NetworkDesigner,
            designer,
            UpdateLoop,
            mockUpdateLoop = jasmine.createSpyObj('updateLoop', ['start', 'stop']),
            Display,
            mockDisplay,
            canvas,
            injector;

        var mouseEvent = function(target, type, x, y) {
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(type, true, true, window,
                0, 0, 0, target.offsetLeft + x, target.offsetTop + y, false, false, false, false, 0, null);
            target.dispatchEvent(evt);
        };

        // from http://jsbin.com/awenaq/3
        var keyEvent = function(k) {
            var eventObj = document.createEventObject ?
                document.createEventObject() : document.createEvent("Events");
          
            if(eventObj.initEvent){
              eventObj.initEvent("keydown", true, true);
            }
          
            eventObj.keyCode = k;
            eventObj.which = k;
            
            document.dispatchEvent ? document.dispatchEvent(eventObj) : document.fireEvent("onkeydown", eventObj); 
        };

        beforeEach(function(done) {
            mockDisplay = jasmine.createSpyObj('display', ['start', 'drawLine', 'drawPoint', 'clear']);
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            mockDisplay.canvas = canvas;

            UpdateLoop = jasmine.createSpyObj('UpdateLoop', ['create']);
            UpdateLoop.create.and.returnValue(mockUpdateLoop);

            Display = jasmine.createSpyObj('Display', ['create']);
            Display.create.and.returnValue(mockDisplay);

            injector = new Squire();
            injector.mock('app/update-loop', UpdateLoop);
            injector.mock('app/display', Display);

            injector.require(['app/network-designer'], function(MockedNetworkDesigner) {
                NetworkDesigner = MockedNetworkDesigner;
                designer = NetworkDesigner.create({
                    width: 500,
                    height: 500,
                    timeout: 60
                });
                designer.start();
                done();
            });
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
                        vb: {x: 18, y: 160},
                        ca: [],
                        cb: []
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
                        expect(designer.network[0].vb).toEqual({x: 3, y: 5});
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
                                    vb: {x: 133, y: 189},
                                    ca: [],
                                    cb: []
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
                                    expect(designer.network[1].va).toEqual({x: 80, y: 92});
                                });

                                it("highlights the other edges sharing the vertex", function() {
                                    expect(designer.highlightEdges[0]).toBe(designer.network[0]);
                                });

                                it("connects the edges", function() {
                                    expect(designer.network[0].ca).toEqual([1]);
                                    expect(designer.network[1].cb).toEqual([0]);
                                });

                                describe("when the mouse moves again", function() {

                                    beforeEach(function() {
                                        mouseEvent(canvas, 'mousemove', 11, 21);
                                    });

                                    it("doesn't add more connections", function() {
                                        expect(designer.network[0].ca).toEqual([1]);
                                        expect(designer.network[1].cb).toEqual([0]);
                                    });
                                });

                                describe("when the mouse moves away from the existing vertex", function() {

                                    beforeEach(function() {
                                        mouseEvent(canvas, 'mousemove', 100, 300);
                                    });

                                    it("removes the highlights", function() {
                                        expect(designer.highlightEdges.length).toBe(0);
                                    });

                                    it("disconnects the edges", function() {
                                        expect(designer.network[0].ca).toEqual([]);
                                        expect(designer.network[1].cb).toEqual([]);
                                    });

                                });
                            });

                            describe("when the mouse moves near it's own vertex", function() {

                                beforeEach(function() {
                                    mouseEvent(canvas, 'mousemove', 135, 190);
                                });

                                it("does not snap to it", function() {
                                    expect(designer.network[1].vb).toEqual({x: 135, y: 190});
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
                        // 0
                        va: {x: 0, y: 0},
                        vb: {x: 0, y: 10},
                        ca: [],
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
                        cb: [],
                    },{
                        // 3
                        va: {x: 10, y: 20},
                        vb: {x: 10, y: -10},
                        ca: [1, 4],
                        cb: [],
                    },{
                        // 4
                        va: {x: 10, y: 20},
                        vb: {x: 0, y: 30},
                        ca: [1, 3],
                        cb: [],
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
                    });

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

                        it("updates the connection indices", function() {
                            expect(designer.network[0].ca).toEqual([]);
                            expect(designer.network[0].cb).toEqual([1, 2]);

                            expect(designer.network[1].ca).toEqual([3]);
                            expect(designer.network[1].cb).toEqual([0, 2]);

                            expect(designer.network[2].ca).toEqual([0, 1]);
                            expect(designer.network[2].cb).toEqual([]);

                            expect(designer.network[3].ca).toEqual([1]);
                            expect(designer.network[3].cb).toEqual([]);
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

            describe("and the mouse moves near an A vertex", function() {

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
                    });

                    describe("and the mouse is moved", function() {

                        beforeEach(function() {
                            mouseEvent(canvas, 'mousemove', 305, 50);
                        });

                        it("moves the vertex", function() {
                            expect(designer.network[3].va).toEqual({x: 305, y: 50});
                        });

                        it("disconnects the vertices", function() {
                            expect(designer.network[3].ca).toEqual([]);
                            expect(designer.network[1].ca).toEqual([4]);
                            expect(designer.network[4].ca).toEqual([1]);
                        });
                    });
                });
            });

            describe("and the mouse moves near a B vertex", function() {

                beforeEach(function() {
                    mouseEvent(canvas, 'mousemove', 1, 11);
                });

                it("highlights the vertex and nearest edge", function() {
                    expect(designer.highlightVertex).toEqual(designer.network[1].vb);
                    expect(designer.highlightEdges[0]).toEqual(designer.network[1]);
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
                        mouseEvent(canvas, 'mousedown', 1, 11);
                    });

                    it("makes the edge's vertex movable", function() {
                        expect(designer.moveTarget.edge).toEqual(designer.network[1]);
                        expect(designer.moveTarget.vertex).toEqual(designer.network[1].vb);
                    });

                    it("removes the highlight", function() {
                       expect(designer.highlightEdges.length).toBe(0);
                       expect(designer.highlightVertex).toBe(null);
                    });

                    describe("and the mouse is moved", function() {

                        beforeEach(function() {
                            mouseEvent(canvas, 'mousemove', 305, 50);
                        });

                        it("moves the vertex", function() {
                            expect(designer.network[1].vb).toEqual({x: 305, y: 50});
                        });

                        it("disconnects the vertices", function() {
                            expect(designer.network[1].cb).toEqual([]);
                            expect(designer.network[0].cb).toEqual([2]);
                            expect(designer.network[2].ca).toEqual([0]);
                        });
                    });
                });
            });

            describe("and drawNetwork is called", function() {

                it("draws the network", function() {
                    designer.drawNetwork();
                    designer.network.forEach(function(edge) {
                        expect(mockDisplay.drawLine).toHaveBeenCalledWith(
                            {x: edge.va.x, y: edge.va.y},
                            {x: edge.vb.x, y: edge.vb.y},
                            NetworkDesigner.EDGE_COLOUR
                        );
                    });
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
                            NetworkDesigner.HIGHLIGHT_COLOUR
                        );
                    });

                    it("draws the highlighted vertex in the vertex highlight colour", function() {
                        designer.drawNetwork();
                        expect(mockDisplay.drawPoint).toHaveBeenCalledWith(
                            designer.network[1].vb.x,
                            designer.network[1].vb.y,
                            NetworkDesigner.VERTEX_SIZE,
                            NetworkDesigner.HIGHLIGHT_COLOUR
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
                            NetworkDesigner.MOVE_COLOUR
                        );
                    });

                    it("draws the vertex in the move colour", function() {
                        designer.drawNetwork();
                        expect(mockDisplay.drawPoint).toHaveBeenCalledWith(
                            designer.network[1].vb.x,
                            designer.network[1].vb.y,
                            NetworkDesigner.VERTEX_SIZE,
                            NetworkDesigner.MOVE_COLOUR
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
                            NetworkDesigner.SELECTED_COLOUR
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
                };
                expect(Display.create).toHaveBeenCalledWith(expectedSpec);
            });

            it("starts the display", function() {
                expect(mockDisplay.start).toHaveBeenCalled();
            });

            it("creates a new update loop with the specified timeout and update function", function() {
                var expectedSpec = {
                    update: designer.update,
                    timeout: 60
                };
                expect(UpdateLoop.create).toHaveBeenCalledWith(expectedSpec);
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
});
