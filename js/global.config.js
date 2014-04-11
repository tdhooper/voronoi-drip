require.config({
    paths: {   
        'lib/rhill-voronoi': '../bower_components/rhill-voronoi/rhill-voronoi-core',
        'lib/toxi' : "../bower_components/toxiclibsjs/lib/toxi"
    },
    shim: {
        'lib/rhill-voronoi': {
            exports: 'Voronoi'
        }
    }
});