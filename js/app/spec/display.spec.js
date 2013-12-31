define(['app/display'], function(Display) {

    describe("a Display", function() {
        var display,
            mockContext = jasmine.createSpyObj('context', ['beginPath', 'moveTo', 'lineTo', 'stroke', 'clearRect', 'fillRect']),
            mockCanvas = {
                getContext: function() {
                    return mockContext;
                }
            },
            container = document.createElement('div');

        beforeEach(function() {
            display = Display.create({
                width: 300,
                height: 300,
                container: container
            });
        });

        describe("when createCanvas is called", function() {

            var canvas;

            describe("with no container", function() {

                beforeEach(function(){
                    canvas = display.createCanvas(100, 200);
                });

                afterEach(function() {
                    document.body.removeChild(canvas);
                })

                it("returns a new canvas element", function() {
                    expect(canvas.nodeName).toBe('CANVAS');
                })

                it("appends the new canvas element to the body", function() {
                    expect(canvas.parentNode).toBe(document.body);
                });

                it("sets the width and height as specified", function() {
                    expect(canvas.width).toBe(100);
                    expect(canvas.height).toBe(200);
                });
            });

            describe("with a container", function() {

                beforeEach(function(){
                    canvas = display.createCanvas(100, 200, container);
                });

                it("appends the new canvas element to the container", function() {
                    expect(canvas.parentNode).toBe(container);
                });
            });
        });

        describe("when start is called", function() {

            beforeEach(function() {
                spyOn(display, 'createCanvas').andReturn(mockCanvas);
                display.start();
            });

            it("creates a canvas at the specified size in the container", function() {
                expect(display.createCanvas).toHaveBeenCalledWith(300, 300, container);
            });

            it("attaches the canvas and context to the display", function() {
                expect(display.canvas).toBe(mockCanvas);
                expect(display.ctx).toBe(mockContext);
            });
        });

        describe("when drawLine is called", function() {

            beforeEach(function() {
                display.ctx = mockContext;
                display.drawLine(
                    {x: 10, y: 12},
                    {x: 39, y: 53},
                    '#f0f'
                );
            });

            it("draws a line between two points in the specified colour", function() {
                expect(mockContext.beginPath.callCount).toBe(1);
                expect(mockContext.strokeStyle).toBe('#f0f');
                expect(mockContext.lineWidth).toBe(5);
                expect(mockContext.moveTo).toHaveBeenCalledWith(10, 12);
                expect(mockContext.lineTo).toHaveBeenCalledWith(39, 53);
                expect(mockContext.stroke.callCount).toBe(1);
            });
        });

        describe("when drawPoint is called", function() {
            beforeEach(function() {
                display.ctx = mockContext;
                display.drawPoint(8, 32, 10, '#00f');
            });

            it("draws a square at the point and size in the specified colour", function() {
                expect(mockContext.fillStyle).toBe('#00f');
                // expect(mockContext.lineWidth).toBe(0);
                expect(mockContext.fillRect).toHaveBeenCalledWith(3, 27, 10, 10);
            });
        });

        it("clears the canvas when clear is called", function() {
            display.ctx = mockContext;
            display.clear();
            expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 300, 300);
        });
    });
});