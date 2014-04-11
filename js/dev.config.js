// Configure RequireJS to shim Jasmine
require.config({
  paths: {
    'dev/jasmine': '../bower_components/jasmine/lib/jasmine-core/jasmine',
    'dev/jasmine-html': '../bower_components/jasmine/lib/jasmine-core/jasmine-html',
    'dev/boot': '../bower_components/jasmine/lib/jasmine-core/boot',
    'dev/squire': '../bower_components/squire/src/Squire'
  },
  shim: {
    'dev/jasmine': {
      exports: 'jasmine'
    },
    'dev/jasmine-html': {
      deps: ['dev/jasmine'],
      exports: 'jasmine'
    },
    'dev/boot': {
      deps: ['dev/jasmine', 'dev/jasmine-html'],
      exports: 'jasmine'
    }
  }
});