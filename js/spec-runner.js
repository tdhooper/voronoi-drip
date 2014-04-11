require(['global.config', 'dev.config'], function() {
  // From http://stackoverflow.com/a/20851265/2443435
  (function() {
    'use strict';

    // Define all of your specs here. These are RequireJS modules.
    var specs = [
          'app/spec/display.spec',
          'app/spec/fluid-adder.spec',
          'app/spec/fluid-mover.spec',
          'app/spec/metrics.spec',
          'app/spec/network-designer.spec',
          'app/spec/overlap-solver.spec',
          'app/spec/pressure-solver.spec',
          'app/spec/sandbox.spec',
          'app/spec/target-calculator.spec',
          'app/spec/update-loop.spec',
          'app/spec/voronoi-drip.spec',
          'app/spec/voronoi-network-generator.spec'
    ];

    // Load Jasmine - This will still create all of the normal Jasmine browser globals unless `boot.js` is re-written to use the
    // AMD or UMD specs. `boot.js` will do a bunch of configuration and attach it's initializers to `window.onload()`. Because
    // we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again. This will
    // initialize the HTML Reporter and execute the environment.
    require(['dev/boot'], function () {

      // Load the specs
      require(specs, function () {

        // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
        window.onload();
      });
    });
  })();
});