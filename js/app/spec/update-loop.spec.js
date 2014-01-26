define(['app/update-loop'], function(UpdateLoop) {

    describe("an Update Loop", function() {

        var updateLoop,
            update = jasmine.createSpy('update');

        beforeEach(function() {
            jasmine.clock().install();
            updateLoop = UpdateLoop.create({
                update: update,
                timeout: 60
            });
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        describe("when tick is called", function() {

            beforeEach(function() {
                spyOn(updateLoop, 'tick').and.callThrough();
                updateLoop.tick();
            });

            it("should call the provided update function", function() {
                expect(update).toHaveBeenCalled();
            });

            it("should call itself again in the allotted time", function() {
                expect(updateLoop.tick.calls.count()).toBe(1);
                jasmine.clock().tick(60 + 1);
                expect(updateLoop.tick.calls.count()).toBe(2);
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
            spyOn(updateLoop, 'tick').and.callThrough();
            updateLoop.tick();
            updateLoop.stop();
            jasmine.clock().tick(11);
            expect(updateLoop.tick.calls.count()).toBe(1);
        });
    });
});