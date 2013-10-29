var VoronoiDrip = VoronoiDrip || {};
VoronoiDrip.Display = VoronoiDrip.Display || {};

VoronoiDrip.Display.create = function(spec) {
    var that = {};

    that.start = function() {
        that.canvas = that.createCanvas(spec.width, spec.height);
        that.ctx = that.canvas.getContext('2d');
    };

    that.createCanvas = function(width, height) {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };

    that.destroyCanvas = function(canvas) {
        document.body.removeChild(canvas);
        delete(canvas);
    };

    that.drawLine = function(pointA, pointB, colour) {
        that.ctx.beginPath();
        that.ctx.strokeStyle = colour;
        that.ctx.lineWidth = 5;
        that.ctx.moveTo(pointA.x, pointA.y);
        that.ctx.lineTo(pointB.x, pointB.y);
        that.ctx.stroke();
    };

    that.clear = function() {
        that.ctx.clearRect(0, 0, spec.width, spec.height);
    };

    return that;
};