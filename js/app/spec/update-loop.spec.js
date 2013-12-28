describe("an Update Loop", function() {

    var updateLoop,
        update = jasmine.createSpy('update');

    beforeEach(function() {
        updateLoop = VoronoiDrip.UpdateLoop.create({
            update: update,
            timeout: 60
        });
    });

    describe("when tick is called", function() {

        beforeEach(function() {
            spyOn(updateLoop, 'tick').andCallThrough();
            jasmine.Clock.useMock();
            updateLoop.tick();
        });

        it("should call the provided update function", function() {
            expect(update).toHaveBeenCalled();
        });

        it("should call itself again in the allotted time", function() {
            expect(updateLoop.tick.callCount).toBe(1);
            jasmine.Clock.tick(60 + 1);
            expect(updateLoop.tick.callCount).toBe(2);
        });
    });

    describe("when start is called", function() {

        beforeEach(function() {
            spyOn(updateLoop, 'tick');
            updateLoop.start();
        });

        it("starts the tick loop", function() {
            expect(updateLoop.tick).toHaveBeenCalled();
        });
    });

    it("should stop the tick loop when stop is called", function() {
        spyOn(updateLoop, 'tick').andCallThrough();
        jasmine.Clock.useMock();
        updateLoop.tick();
        updateLoop.stop();
        jasmine.Clock.tick(11);
        expect(updateLoop.tick.callCount).toBe(1);
    });
});