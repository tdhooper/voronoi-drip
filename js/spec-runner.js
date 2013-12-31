require.config({
    paths: {
        jasmine: 'lib/jasmine-1.3.1/jasmine',
        'jasmine-html': 'lib/jasmine-1.3.1/jasmine-html'
    },
    shim: {
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});

var jasmineEnv;

require(['jasmine-html'], function (jasmine) {

    jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

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

    if (document.readyState == 'complete') {
        execJasmine();
    } else {
        window.onload = function() {
            execJasmine();
        };
    }

    function execJasmine() {
        require(specs, function(spec) {
            jasmineEnv.execute();
        });
    }
});