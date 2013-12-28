define(function() {
    var Display = {};

    Display.create = function(spec) {
        var that = {};

        that.start = function() {
            that.canvas = that.createCanvas(spec.width, spec.height, spec.container);
            that.ctx = that.canvas.getContext('2d');
        };

        that.createCanvas = function(width, height, container) {
            if ( ! container) {
                container = document.body;
            }
            var canvas = document.createElement('canvas');
            container.appendChild(canvas);
            canvas.width = width;
            canvas.height = height;
            return canvas;
        };

        that.drawLine = function(pointA, pointB, colour) {
            that.ctx.beginPath();
            that.ctx.strokeStyle = colour;
            that.ctx.lineWidth = 5;
            that.ctx.moveTo(pointA.x, pointA.y);
            that.ctx.lineTo(pointB.x, pointB.y);
            that.ctx.stroke();
        };

        that.drawPoint = function(x, y, size, colour) {
            var offset = size / 2;
            that.ctx.fillStyle = colour;
            that.ctx.fillRect(x - offset, y - offset, size, size);
        };

        that.clear = function() {
            that.ctx.clearRect(0, 0, spec.width, spec.height);
        };

        return that;
    };

    return Display;
});