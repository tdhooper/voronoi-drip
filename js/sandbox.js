require(['app/sandbox'], function(Sandbox) {
    var sandbox = Sandbox.create({
        container: document.body
    });
    sandbox.start();

    var network;

    network = [
        {
            va: {x: 200, y: 0},
            vb: {x: 200, y: 100},
            ca: null,
            cb: [1, 2],
        },{
            va: {x: 300, y: 200},
            vb: {x: 200, y: 100},
            ca: [3, 4],
            cb: [0, 2],
        },{
            va: {x: 200, y: 100},
            vb: {x: 0, y: 100},
            ca: [0, 1],
            cb: null,
        },{
            va: {x: 300, y: 200},
            vb: {x: 300, y: -100},
            ca: [1, 4],
            cb: null,
        },{
            va: {x: 300, y: 200},
            vb: {x: 200, y: 300},
            ca: [1, 3],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 10,
        timeout: 100,
        network: network
        },
        addFluid: {
            volume: 200,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 150, y: 200},
            vb: {x: 250, y: 250},
            ca: null,
            cb: [1],
        },{
            va: {x: 250, y: 250},
            vb: {x: 250, y: 300},
            ca: [0],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 20,
        timeout: 500,
        network: network
        },
        addFluid: {
            volume: 100,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 250, y: 250},
            vb: {x: 250, y: 300},
            ca: [0],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 10,
        timeout: 500,
        network: network
        },
        addFluid: {
            volume: 10,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 260, y: 240},
            vb: {x: 250, y: 250},
            ca: [4, 5],
            cb: [2, 3]
        },{
            va: {x: 130, y: 300},
            vb: {x: 150, y: 220},
            ca: null,
            cb: [2]
        },{
            va: {x: 150, y: 220},
            vb: {x: 250, y: 250},
            ca: [1],
            cb: [0, 3]
        },{
            va: {x: 250, y: 250},
            vb: {x: 250, y: 300},
            ca: [0, 2],
            cb: null
        },{
            va: {x: 200, y: 0},
            vb: {x: 260, y: 240},
            ca: null,
            cb: [0, 5]
        },{
            va: {x: 260, y: 240},
            vb: {x: 300, y: 250},
            ca: [0, 4],
            cb: null
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 10,
        timeout: 100,
        network: network
        },
        addFluid: {
            volume: 140,
            pipe: network[4],
            vertex: network[4].va
        }
    });

    network = [
        {
            va: {x: 50, y: 50},
            vb: {x: 150, y: 250},
            ca: null,
            cb: [1],
        },{
            va: {x: 250, y: 50},
            vb: {x: 150, y: 250},
            ca: null,
            cb: [0],
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 90,
        timeout: 500,
        network: network
        },
        addFluid: {
            volume: 140,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 50, y: 50},
            vb: {x: 150, y: 250},
            ca: null,
            cb: [1],
        },{
            va: {x: 250, y: 50},
            vb: {x: 150, y: 250},
            ca: null,
            cb: [0],
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 10,
        timeout: 10,
        network: network
        },
        addFluid: {
            volume: 140,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 50, y: 50},
            vb: {x: 150, y: 250},
            ca: null,
            cb: null
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 100,
        timeout: 500,
        network: network
        },
        addFluid: {
            volume: 140,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 80, y: 50},
            vb: {x: 80, y: 250},
            ca: null,
            cb: [1],
        },{
            va: {x: 80, y: 250},
            vb: {x: 120, y: 290},
            ca: [0],
            cb: [2],
        },{
            va: {x: 120, y: 290},
            vb: {x: 180, y: 290},
            ca: [1],
            cb: [3],
        },{
            va: {x: 180, y: 290},
            vb: {x: 220, y: 250},
            ca: [2],
            cb: [4],
        },{
            va: {x: 220, y: 250},
            vb: {x: 220, y: 50},
            ca: [3],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 10,
        timeout: 500,
        network: network
        },
        addFluid: {
            volume: 300,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 50, y: -100},
            vb: {x: 50, y: 50},
            ca: null,
            cb: [1, 3],
        },{
            va: {x: 50, y: 50},
            vb: {x: 0, y: 100},
            ca: [0],
            cb: [2],
        },{
            va: {x: 0, y: 100},
            vb: {x: 50, y: 150},
            ca: [1],
            cb: [4, 5],
        },{
            va: {x: 50, y: 50},
            vb: {x: 100, y: 100},
            ca: [0],
            cb: [4],
        },{
            va: {x: 100, y: 100},
            vb: {x: 50, y: 150},
            ca: [3],
            cb: [2, 5],
        },{
            va: {x: 50, y: 150},
            vb: {x: 50, y: 200},
            ca: [2, 4],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 100,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 50, y: -350},
            vb: {x: 50, y: 150},
            ca: null,
            cb: [1, 2],
        },{
            va: {x: 50, y: 150},
            vb: {x: 0, y: 250},
            ca: [0],
            cb: [3],
        },{
            va: {x: 50, y: 150},
            vb: {x: 100, y: 250},
            ca: [0],
            cb: [3],
        },{
            va: {x: 0, y: 250},
            vb: {x: 100, y: 250},
            ca: [1],
            cb: [2],
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 350,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: -200, y: 0},
            vb: {x: 50, y: 100},
            ca: null,
            cb: [1],
        },{
            va: {x: 50, y: 100},
            vb: {x: 50, y: 150},
            ca: [0],
            cb: [2, 3],
        },{
            va: {x: 50, y: 150},
            vb: {x: 0, y: 250},
            ca: [1],
            cb: [4],
        },{
            va: {x: 50, y: 150},
            vb: {x: 100, y: 250},
            ca: [1],
            cb: [4],
        },{
            va: {x: 0, y: 250},
            vb: {x: 100, y: 250},
            ca: [2],
            cb: [3],
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 350,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: -200, y: 0},
            vb: {x: 50, y: 100},
            ca: null,
            cb: [1],
        },{
            va: {x: 50, y: 100},
            vb: {x: 50, y: 150},
            ca: [0],
            cb: [2, 3],
        },{
            va: {x: 50, y: 150},
            vb: {x: 0, y: 200},
            ca: [1],
            cb: [4],
        },{
            va: {x: 50, y: 150},
            vb: {x: 100, y: 200},
            ca: [1],
            cb: [5],
        },{
            va: {x: 0, y: 200},
            vb: {x: 50, y: 250},
            ca: [2],
            cb: [5],
        },{
            va: {x: 100, y: 200},
            vb: {x: 50, y: 250},
            ca: [3],
            cb: [4]
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 150,
            pipe: network[0],
            vertex: network[0].va
        }
    });
    network[4].fluids = [{
        volume: network[4].capacity - 4,
        position: 0
    }];
    network[5].fluids = [{
        volume: network[5].capacity - 4,
        position: 0
    }];

    network = [
        {
            va: {x: 0, y: 70},
            vb: {x: 50, y: 100},
            ca: null,
            cb: [1],
        },{
            va: {x: 50, y: 100},
            vb: {x: 50, y: 150},
            ca: [0],
            cb: [2, 3],
        },{
            va: {x: 50, y: 150},
            vb: {x: 0, y: 200},
            ca: [1],
            cb: [4],
        },{
            va: {x: 50, y: 150},
            vb: {x: 100, y: 200},
            ca: [1],
            cb: [5],
        },{
            va: {x: 0, y: 200},
            vb: {x: 50, y: 250},
            ca: [2],
            cb: [5],
        },{
            va: {x: 100, y: 200},
            vb: {x: 50, y: 250},
            ca: [3],
            cb: [4]
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 50,
        network: network
        },
        addFluid: {
            volume: 50,
            pipe: network[0],
            vertex: network[0].va
        }
    });
    network[4].fluids = [{
        volume: network[4].capacity - 4,
        position: 0
    }];
    network[5].fluids = [{
        volume: network[5].capacity - 4,
        position: 0
    }];

    network = [
        {
            va: {x: 50, y: 0},
            vb: {x: 100, y: 100},
            ca: null,
            cb: [2, 1],
        },{
            va: {x: 30, y: 60},
            vb: {x: 100, y: 100},
            ca: null,
            cb: [2, 0],
        },{
            va: {x: 100, y: 100},
            vb: {x: 100, y: 200},
            ca: [0, 1],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 50,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 0, y: 0},
            vb: {x: 100, y: 150},
            ca: null,
            cb: [2, 1],
        },{
            va: {x: 200, y: 100},
            vb: {x: 100, y: 150},
            ca: null,
            cb: [2, 0],
        },{
            va: {x: 100, y: 150},
            vb: {x: 100, y: 200},
            ca: [0, 1],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 100,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            va: {x: 0, y: 0},
            vb: {x: 100, y: 150},
            ca: null,
            cb: [2, 1],
        },{
            va: {x: 130, y: 100},
            vb: {x: 100, y: 150},
            ca: null,
            cb: [2, 0],
        },{
            va: {x: 100, y: 150},
            vb: {x: 90, y: 200},
            ca: [0, 1],
            cb: null,
        }
    ];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 50,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [{
        "lSite":{
            "x":180.0047509605065,
            "y":52.26753291208297,
            "voronoiId":0},
        "rSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "vb":{
            "x":261.1008311922286,
            "y":0},
        "va":{
            "x":255.56722286914595,
            "y":113.47396787060615},
        "ca":[1,2],
        "cb":[],
        "incline":-0.96897952874385,
        "capacity":113.60881218185781,
        "ra":9.84489764371925,
        "rb":0.1551023562807502,
        "fluids":[{
                "volume":2.257362312853232,
                "position":0
            }]
    },{
        "lSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "rSite":{
            "x":180.0047509605065,
            "y":52.26753291208297,
            "voronoiId":0},
        "vb":{
            "x":17.017861907166036,
            "y":75.38459719659828},
        "va":{
            "x":255.56722286914595,
            "y":113.47396787060615},
        "ca":[2,0],
        "cb":[3,4],
        "incline":-0.10079873115710525,
        "capacity":241.57110293599058,
        "ra":5.503993655785527,
        "rb":4.496006344214473,
        "fluids":[{
                "volume":121.95549333811765,
                "position":0,
                "movedBy":0
            }]
    },{
        "lSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "rSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "vb":{
            "x":292.6297373129881,
            "y":185.76313465865158},
        "va":{
            "x":255.56722286914595,
            "y":113.47396787060615},
        "ca":[0,1],
        "cb":[9,8],
        "incline":0.6983986044868388,
        "capacity":81.2364057046461,
        "ra":1.5080069775658056,
        "rb":8.491993022434194,
        "fluids":[{
                "volume":1.0079873115710427,
                "position":76.82384649355227
            },{
                "volume":1.0079873115710427,
                "position":69.83986044868388
            },{
                "volume":1.0079873115710427,
                "position":62.85587440381549
            },{
                "volume":1.0079873115710427,
                "position":55.8718883589471
            },{
                "volume":1.0079873115710427,
                "position":48.887902314078715
            },{
                "volume":1.0079873115710427,
                "position":41.90391626921033
            },{
                "volume":1.0079873115710427,
                "position":34.91993022434194
            },{
                "volume":1.0079873115710427,
                "position":27.93594417947355
            },{
                "volume":1.0079873115710427,
                "position":20.951958134605164
            },{
                "volume":1.0079873115710427,
                "position":13.967972089736776
            },{
                "volume":1.0079873115710427,
                "position":6.983986044868388
            },{
                "volume":1.5118187907902723,
                "position":79.72458691385583
            },{
                "volume":1.0079873115710427,
                "position":0
        }]
    },{
        "lSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "rSite":{
            "x":38.3409452624619,
            "y":238.6158772278577,
            "voronoiId":3},
        "vb":{
            "x":105.5604620441726,
            "y":199.00019399302766},
        "va":{
            "x":17.017861907166036,
            "y":75.38459719659828},
        "ca":[1,4],
        "cb":[6,7],
        "incline":0.6042996772295,
        "capacity":152.05462114108613,
        "ra":1.9785016138525002,
        "rb":8.021498386147499,
        "fluids":[{
                "volume":3.9245676272761614,
                "position":148.13005351380997
            }]
    },{
        "lSite":{
            "x":38.3409452624619,
            "y":238.6158772278577,
            "voronoiId":3},
        "rSite":{
            "x":180.0047509605065,
            "y":52.26753291208297,
            "voronoiId":0},
        "vb":{
            "x":0,
            "y":62.44745470968839},
        "va":{
            "x":17.017861907166036,
            "y":75.38459719659828},
        "ca":[3,1],
        "cb":[],
        "incline":-0.4138049620640547,
        "capacity":21.377026912505443,
        "ra":7.069024810320274,
        "rb":2.9309751896797263},
    {
        "lSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "rSite":{
            "x":441.28138618543744,
            "y":264.1879159491509,
            "voronoiId":4},
        "vb":{
            "x":500,
            "y":105.23826032237588},
        "va":{
            "x":321.5068622860838,
            "y":196.59585621624984},
        "ca":[9,11],
        "cb":[],
        "incline":-0.30116210626268797,
        "capacity":200.51436491799643,
        "ra":6.50581053131344,
        "rb":3.49418946868656,
        "fluids":[{
                "volume":38.41414051051561,
                "position":0
            }]
    },{
        "lSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "rSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "vb":{
            "x":195.1587022274967,
            "y":233.0737681877373},
        "va":{
            "x":105.5604620441726,
            "y":199.00019399302766},
        "ca":[3,7],
        "cb":[8,10],
        "incline":0.2313494862029557,
        "capacity":95.85850563382998,
        "ra":3.8432525689852213,
        "rb":6.156747431014779,
        "fluids":[{
                "volume":95.85850563382998,
                "position":6.217248937900877e-15
            }]
    },{
        "lSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "rSite":{
            "x":38.3409452624619,
            "y":238.6158772278577,
            "voronoiId":3},
        "vb":{
            "x":29.204664615241754,
            "y":356.0980026128575},
        "va":{
            "x":105.5604620441726,
            "y":199.00019399302766},
        "ca":[6,3],
        "cb":[12,14],
        "incline":0.7119822280212608,
        "capacity":174.67091708169568,
        "ra":1.4400888598936956,
        "rb":8.559911140106305,
        "fluids":[{
                "volume":174.67091708169568,
                "position":-7.105427357601002e-15
            }]
    },{
        "lSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "rSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "vb":{
            "x":195.1587022274967,
            "y":233.0737681877373},
        "va":{
            "x":292.6297373129881,
            "y":185.76313465865158},
        "ca":[9,2],
        "cb":[10,6],
        "incline":0.28767862953255774,
        "capacity":108.34619848227507,
        "ra":3.5616068523372113,
        "rb":6.438393147662788,
        "fluids":[{
                "volume":108.34619848227507,
                "position":-5.329070518200751e-15
            }]
    },{
        "lSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "rSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "vb":{
            "x":321.5068622860838,
            "y":196.59585621624984},
        "va":{
            "x":292.6297373129881,
            "y":185.76313465865158},
        "ca":[2,8],
        "cb":[5,11],
        "incline":0.22847393910864564,
        "capacity":30.842117356891077,
        "ra":3.8576303044567717,
        "rb":6.142369695543229,
        "fluids":[{
                "volume":30.842117356891077,
                "position":-1.3322676295501878e-15
            }]
    },{
        "lSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "rSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "vb":{
            "x":163.2143246952559,
            "y":355.2663357983656},
        "va":{
            "x":195.1587022274967,
            "y":233.0737681877373},
        "ca":[8,6],
        "cb":[13,12],
        "incline":0.8372139142159054,
        "capacity":126.29911652581067,
        "ra":0.813930428920473,
        "rb":9.186069571079527,
        "fluids":[{
                "volume":126.29911652581067,
                "position":7.105427357601002e-15
            }]
    },{
        "lSite":{
            "x":441.28138618543744,
            "y":264.1879159491509,
            "voronoiId":4},
        "rSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "vb":{
            "x":390.9707363769134,
            "y":500},
        "va":{
            "x":321.5068622860838,
            "y":196.59585621624984},
        "ca":[5,9],
        "cb":[],
        "incline":0.8567164121701709,
        "capacity":311.25440441680047,
        "ra":0.7164179391491454,
        "rb":9.283582060850854,
        "fluids":[{
                "volume":312.2976179557461,
                "position":-1.0432135389456363
            }]
    },{
        "lSite":{
            "x":116.92236026283354,
            "y":434.7817193483934,
            "voronoiId":7},
        "rSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "vb":{
            "x":29.204664615241754,
            "y":356.0980026128575},
        "va":{
            "x":163.2143246952559,
            "y":355.2663357983656},
        "ca":[13,10],
        "cb":[14,7],
        "incline":0.00395082519196388,
        "capacity":134.0122407261787,
        "ra":4.980245874040181,
        "rb":5.019754125959819,
        "fluids":[{
                "volume":134.0122407261787,
                "position":7.993605777301127e-15
            }]
    },{
        "lSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "rSite":{
            "x":116.92236026283354,
            "y":434.7817193483934,
            "voronoiId":7},
        "vb":{
            "x":306.87451575143393,
            "y":500},
        "va":{
            "x":163.2143246952559,
            "y":355.2663357983656},
        "ca":[10,12],
        "cb":[],
        "incline":0.5023696450562314,
        "capacity":203.9266634050806,
        "ra":2.488151774718843,
        "rb":7.511848225281157,
        "fluids":[{
                "volume":204.16793559765472,
                "position":-0.2412721925741188
            }]
    },{
        "lSite":{
            "x":116.92236026283354,
            "y":434.7817193483934,
            "voronoiId":7},
        "rSite":{
            "x":38.3409452624619,
            "y":238.6158772278577,
            "voronoiId":3},
        "vb":{
            "x":0,
            "y":367.79700099743275},
        "va":{
            "x":29.204664615241754,
            "y":356.0980026128575},
        "ca":[12,7],
        "cb":[],
        "incline":0.24255977041012988,
        "capacity":31.46075330457057,
        "ra":3.7872011479493506,
        "rb":6.21279885205065,
        "fluids":[{
                "volume":33.34612032150238,
                "position":-1.8853670169318137
            }]
    }];
    sandbox.add({
        voronoiDrip: {
        width: 500,
        height: 500,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {}
    });

    network = [{
        "lSite":{
            "x":180.0047509605065,
            "y":52.26753291208297,
            "voronoiId":0},
        "rSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "vb":{
            "x":261.1008311922286,
            "y":0},
        "va":{
            "x":255.56722286914595,
            "y":113.47396787060615},
        "ca":[1,2],
        "cb":[],
        "incline":-0.96897952874385,
        "capacity":113.60881218185781,
        "ra":9.84489764371925,
        "rb":0.1551023562807502,
        "fluids":[{
                "volume":2.257362312853232,
                "position":0
            }]
    },{
        "lSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "rSite":{
            "x":180.0047509605065,
            "y":52.26753291208297,
            "voronoiId":0},
        "vb":{
            "x":17.017861907166036,
            "y":75.38459719659828},
        "va":{
            "x":255.56722286914595,
            "y":113.47396787060615},
        "ca":[2,0],
        "cb":[3,4],
        "incline":-0.10079873115710525,
        "capacity":241.57110293599058,
        "ra":5.503993655785527,
        "rb":4.496006344214473,
        "fluids":[{
                "volume":121.95549333811765,
                "position":0,
                "movedBy":0
            }]
    },{
        "lSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "rSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "vb":{
            "x":292.6297373129881,
            "y":185.76313465865158},
        "va":{
            "x":255.56722286914595,
            "y":113.47396787060615},
        "ca":[0,1],
        "cb":[9,8],
        "incline":0.6983986044868388,
        "capacity":81.2364057046461,
        "ra":1.5080069775658056,
        "rb":8.491993022434194,
        "fluids":[{
                "volume":1.0079873115710427,
                "position":76.82384649355227
            },{
                "volume":1.0079873115710427,
                "position":69.83986044868388
            },{
                "volume":1.0079873115710427,
                "position":62.85587440381549
            },{
                "volume":1.0079873115710427,
                "position":55.8718883589471
            },{
                "volume":1.0079873115710427,
                "position":48.887902314078715
            },{
                "volume":1.0079873115710427,
                "position":41.90391626921033
            },{
                "volume":1.0079873115710427,
                "position":34.91993022434194
            },{
                "volume":1.0079873115710427,
                "position":27.93594417947355
            },{
                "volume":1.0079873115710427,
                "position":20.951958134605164
            },{
                "volume":1.0079873115710427,
                "position":13.967972089736776
            },{
                "volume":1.0079873115710427,
                "position":6.983986044868388
            },{
                "volume":1.5118187907902723,
                "position":79.72458691385583
            },{
                "volume":1.0079873115710427,
                "position":0
        }]
    },{
        "lSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "rSite":{
            "x":38.3409452624619,
            "y":238.6158772278577,
            "voronoiId":3},
        "vb":{
            // removing this causes other bug
            "x":105.5604620441726,
            "y":199.00019399302766},
        "va":{
            "x":17.017861907166036,
            "y":75.38459719659828},
        "ca":[1,4],
        "cb":[6,7],
        "incline":0.6042996772295,
        "capacity":152.05462114108613,
        "ra":1.9785016138525002,
        "rb":8.021498386147499,
        "fluids":[{
                "volume":3.9245676272761614,
                "position":148.13005351380997
            }]
    },{
        "lSite":{
            "x":38.3409452624619,
            "y":238.6158772278577,
            "voronoiId":3},
        "rSite":{
            "x":180.0047509605065,
            "y":52.26753291208297,
            "voronoiId":0},
        "vb":{
            "x":0,
            "y":62.44745470968839},
        "va":{
            "x":17.017861907166036,
            "y":75.38459719659828},
        "ca":[3,1],
        "cb":[],
        "incline":-0.4138049620640547,
        "capacity":21.377026912505443,
        "ra":7.069024810320274,
        "rb":2.9309751896797263},
    {
        "lSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "rSite":{
            "x":441.28138618543744,
            "y":264.1879159491509,
            "voronoiId":4},
        "vb":{
            "x":500,
            "y":105.23826032237588},
        "va":{
            "x":321.5068622860838,
            "y":196.59585621624984},
        "ca":[9],
        "cb":[],
        "incline":-0.30116210626268797,
        "capacity":200.51436491799643,
        "ra":6.50581053131344,
        "rb":3.49418946868656,
        "fluids":[{
                "volume":38.41414051051561,
                "position":0
            }]
    },{
        "lSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "rSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "vb":{
            "x":195.1587022274967,
            "y":233.0737681877373},
        "va":{
            "x":105.5604620441726,
            "y":199.00019399302766},
        "ca":[3,7],
        "cb":[8,10],
        "incline":0.2313494862029557,
        "capacity":95.85850563382998,
        "ra":3.8432525689852213,
        "rb":6.156747431014779,
        "fluids":[{
                "volume":95.85850563382998,
                "position":6.217248937900877e-15
            }]
    },{
        "lSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "rSite":{
            "x":38.3409452624619,
            "y":238.6158772278577,
            "voronoiId":3},
        "vb":{
            "x":29.204664615241754,
            "y":356.0980026128575},
        "va":{
            "x":105.5604620441726,
            "y":199.00019399302766},
        "ca":[6,3],
        "cb":[11],
        "incline":0.7119822280212608,
        "capacity":174.67091708169568,
        "ra":1.4400888598936956,
        "rb":8.559911140106305,
        "fluids":[{
                "volume":174.67091708169568,
                "position":-7.105427357601002e-15
            }]
    },{
        "lSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "rSite":{
            "x":164.70202337950468,
            "y":148.1067610438913,
            "voronoiId":2},
        "vb":{
            "x":195.1587022274967,
            "y":233.0737681877373},
        "va":{
            "x":292.6297373129881,
            "y":185.76313465865158},
        "ca":[9,2],
        "cb":[10,6],
        "incline":0.28767862953255774,
        "capacity":108.34619848227507,
        "ra":3.5616068523372113,
        "rb":6.438393147662788,
        "fluids":[{
                "volume":108.34619848227507,
                "position":-5.329070518200751e-15
            }]
    },{
        "lSite":{
            "x":336.72651753295213,
            "y":59.91013930179179,
            "voronoiId":1},
        "rSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "vb":{
            "x":321.5068622860838,
            "y":196.59585621624984},
        "va":{
            "x":292.6297373129881,
            "y":185.76313465865158},
        "ca":[2,8],
        "cb":[5],
        "incline":0.22847393910864564,
        "capacity":30.842117356891077,
        "ra":3.8576303044567717,
        "rb":6.142369695543229,
        "fluids":[{
                "volume":30.842117356891077,
                "position":-1.3322676295501878e-15
            }]
    },{
        "lSite":{
            "x":243.0721203563735,
            "y":309.567597694695,
            "voronoiId":6},
        "rSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "vb":{
            "x":163.2143246952559,
            "y":355.2663357983656},
        "va":{
            "x":195.1587022274967,
            "y":233.0737681877373},
        "ca":[8,6],
        "cb":[11],
        "incline":0.8372139142159054,
        "capacity":126.29911652581067,
        "ra":0.813930428920473,
        "rb":9.186069571079527,
        "fluids":[{
                "volume":126.29911652581067,
                "position":7.105427357601002e-15
            }]
    },{
        "lSite":{
            "x":116.92236026283354,
            "y":434.7817193483934,
            "voronoiId":7},
        "rSite":{
            "x":115.93901563901454,
            "y":276.33163274731487,
            "voronoiId":5},
        "vb":{
            "x":29.204664615241754,
            "y":356.0980026128575},
        "va":{
            "x":163.2143246952559,
            "y":355.2663357983656},
        "ca":[10],
        "cb":[7],
        "incline":0.00395082519196388,
        "capacity":134.0122407261787,
        "ra":4.980245874040181,
        "rb":5.019754125959819,
        "fluids":[{
                "volume":134.0122407261787,
                "position":7.993605777301127e-15
            }]
    }];
    sandbox.add({
        voronoiDrip: {
        width: 500,
        height: 500,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {}
    });

    network = [{"va":{"x":15,"y":8},"vb":{"x":128,"y":105},"ca":[],"cb":[1]},{"va":{"x":128,"y":105},"vb":{"x":186,"y":122},"ca":[0],"cb":[3,4]},{"va":{"x":222,"y":137},"vb":{"x":220,"y":87},"ca":[6],"cb":[3]},{"va":{"x":186,"y":122},"vb":{"x":220,"y":87},"ca":[1,4],"cb":[2]},{"va":{"x":190,"y":158},"vb":{"x":186,"y":122},"ca":[5,6],"cb":[1,3]},{"va":{"x":153,"y":150},"vb":{"x":190,"y":158},"ca":[],"cb":[4,6]},{"va":{"x":222,"y":137},"vb":{"x":190,"y":158},"ca":[2],"cb":[4,5]}];
    sandbox.add({
        voronoiDrip: {
        width: 300,
        height: 300,
        pipeColour: "#eee",
        fluidColour: "#000",
        startVolume: 200,
        gravity: 5,
        timeout: 5,
        network: network
        },
        addFluid: {
            volume: 180,
            pipe: network[0],
            vertex: network[0].va
        }
    });

    network = [
        {
            "index": 0, "label": "top-right",
            "va":{"x":138,"y":340},"vb":{"x":188,"y":374},"ca":[2,3],"cb":[1]
        },{
            "index": 1, "label": "botto-right",
            "va":{"x":193,"y":413},"vb":{"x":188,"y":374},"ca":[4],"cb":[0]
        },{
            "index": 2, "label": "top-left",
            "va":{"x":125,"y":401},"vb":{"x":138,"y":340},"ca":[4],"cb":[3,0]
        },{
            "index": 3, "label": "top",
            "va":{"x":135,"y":199},"vb":{"x":138,"y":340},"ca":[],"cb":[2,0]
        },{
            "index": 4, "label": "bottom-left",
            "va":{"x":193,"y":413},"vb":{"x":125,"y":401},"ca":[1],"cb":[2]
        }
    ];
    sandbox.add({
        voronoiDrip: {
            width: 400,
            height: 450,
            network: network
        },
        addFluid: {
            volume: 180
        }
    });

    network = [{"lSite":{"x":154.31562401354313,"y":64.80927672237158,"voronoiId":1},"rSite":{"x":94.5085606072098,"y":27.47400407679379,"voronoiId":0},"vb":{"x":94.73631776878052,"y":93.67901735915609},"va":{"x":153.21656165755724,"y":0},"ca":[],"cb":[6,9],"incline":0.6447226285314873,"capacity":110.43413067828205,"ra":1.7763868573425634,"rb":8.223613142657436},{"lSite":{"x":192.9824194405228,"y":69.28059458732605,"voronoiId":2},"rSite":{"x":154.31562401354313,"y":64.80927672237158,"voronoiId":1},"vb":{"x":174.87562509712106,"y":56.43758833271356},"va":{"x":181.40190673438678,"y":0},"ca":[],"cb":[2,3],"incline":0.9267086324971154,"capacity":56.813675544025116,"ra":0.3664568375144228,"rb":9.633543162485577,"fluids":[]},{"lSite":{"x":192.9824194405228,"y":69.28059458732605,"voronoiId":2},"rSite":{"x":182.9804087523371,"y":77.10425939876586,"voronoiId":3},"vb":{"x":200,"y":88.55735219902024},"va":{"x":174.87562509712106,"y":56.43758833271356},"ca":[1,3],"cb":[],"incline":0.5774128366522647,"capacity":40.77883574953696,"ra":2.112935816738677,"rb":7.887064183261323},{"lSite":{"x":182.9804087523371,"y":77.10425939876586,"voronoiId":3},"rSite":{"x":154.31562401354313,"y":64.80927672237158,"voronoiId":1},"vb":{"x":151.18063786842652,"y":111.68058673099937},"va":{"x":174.87562509712106,"y":56.43758833271356},"ca":[2,1],"cb":[7,6],"incline":0.7420488725049726,"capacity":60.11024281934823,"ra":1.2897556374751362,"rb":8.710244362524865,"fluids":[]},{"lSite":{"x":198.9816077053547,"y":114.20135386288166,"voronoiId":4},"rSite":{"x":182.9804087523371,"y":77.10425939876586,"voronoiId":3},"vb":{"x":152.14054550825898,"y":112.4059777456276},"va":{"x":200,"y":91.76261836215863},"ca":[],"cb":[8,7],"incline":0.25924586709450514,"capacity":52.121738947219384,"ra":3.703770664527475,"rb":6.296229335472525},{"lSite":{"x":54.06101797707379,"y":146.70457772444934,"voronoiId":5},"rSite":{"x":94.5085606072098,"y":27.47400407679379,"voronoiId":0},"vb":{"x":0,"y":61.889066748855456},"va":{"x":94.15358281581608,"y":93.8295408924825},"ca":[10,9],"cb":[],"incline":-0.2082098817079201,"capacity":99.42379516782913,"ra":6.0410494085396005,"rb":3.9589505914603995},{"lSite":{"x":126.59997479058802,"y":151.71230968553573,"voronoiId":6},"rSite":{"x":154.31562401354313,"y":64.80927672237158,"voronoiId":1},"vb":{"x":94.73631776878052,"y":93.67901735915609},"va":{"x":151.18063786842652,"y":111.68058673099937},"ca":[7,3],"cb":[9,0],"incline":-0.1965426889747952,"capacity":59.245402955508595,"ra":5.982713444873976,"rb":4.017286555126024},{"lSite":{"x":182.9804087523371,"y":77.10425939876586,"voronoiId":3},"rSite":{"x":126.59997479058802,"y":151.71230968553573,"voronoiId":6},"vb":{"x":152.14054550825898,"y":112.4059777456276},"va":{"x":151.18063786842652,"y":111.68058673099937},"ca":[3,6],"cb":[4,8],"incline":0.4119768481799379,"capacity":1.2031686503196908,"ra":2.94011575910031,"rb":7.05988424089969,"fluids":[]},{"lSite":{"x":198.9816077053547,"y":114.20135386288166,"voronoiId":4},"rSite":{"x":126.59997479058802,"y":151.71230968553573,"voronoiId":6},"vb":{"x":180.3300740544107,"y":166.8008621872451},"va":{"x":152.14054550825898,"y":112.4059777456276},"ca":[4,7],"cb":[18,17],"incline":0.6956118442393072,"capacity":61.265430489560934,"ra":1.5219407788034633,"rb":8.478059221196537,"fluids":[]},{"lSite":{"x":126.59997479058802,"y":151.71230968553573,"voronoiId":6},"rSite":{"x":94.5085606072098,"y":27.47400407679379,"voronoiId":0},"vb":{"x":94.15358281581608,"y":93.8295408924825},"va":{"x":94.73631776878052,"y":93.67901735915609},"ca":[6,0],"cb":[10,5],"incline":0.16092476045267512,"capacity":0.6018615783479938,"ra":4.195376197736625,"rb":5.804623802263375},{"lSite":{"x":126.59997479058802,"y":151.71230968553573,"voronoiId":6},"rSite":{"x":54.06101797707379,"y":146.70457772444934,"voronoiId":5},"vb":{"x":89.10170579792808,"y":167.00795612624472},"va":{"x":94.15358281581608,"y":93.8295408924825},"ca":[9,5],"cb":[16,14],"incline":0.9561205286096491,"capacity":73.35258630429324,"ra":0.21939735695175377,"rb":9.780602643048246},{"lSite":{"x":43.09869548305869,"y":162.75222541298717,"voronoiId":7},"rSite":{"x":54.06101797707379,"y":146.70457772444934,"voronoiId":5},"vb":{"x":0,"y":121.54297361541063},"va":{"x":72.87744881473762,"y":171.3263507155234},"ca":[12,13],"cb":[],"incline":-0.38152674836461986,"capacity":88.25818478326379,"ra":6.9076337418230995,"rb":3.0923662581769005},{"lSite":{"x":44.97683406807482,"y":184.81135985348374,"voronoiId":8},"rSite":{"x":43.09869548305869,"y":162.75222541298717,"voronoiId":7},"vb":{"x":0,"y":177.53121559658697},"va":{"x":72.87744881473762,"y":171.3263507155234},"ca":[13,11],"cb":[],"incline":0.05407209189679185,"capacity":73.14111630223425,"ra":4.7296395405160405,"rb":5.2703604594839595},{"lSite":{"x":54.06101797707379,"y":146.70457772444934,"voronoiId":5},"rSite":{"x":44.97683406807482,"y":184.81135985348374,"voronoiId":8},"vb":{"x":75.67131920895508,"y":171.99237474224492},"va":{"x":72.87744881473762,"y":171.3263507155234},"ca":[11,12],"cb":[14,15],"incline":0.1489816504587771,"capacity":2.872159428697368,"ra":4.255091747706114,"rb":5.744908252293886},{"lSite":{"x":54.06101797707379,"y":146.70457772444934,"voronoiId":5},"rSite":{"x":75.79117426648736,"y":205.2559198345989,"voronoiId":9},"vb":{"x":89.10170579792808,"y":167.00795612624472},"va":{"x":75.67131920895508,"y":171.99237474224492},"ca":[13,15],"cb":[10,16],"incline":-0.22623775505100438,"capacity":14.325491714729898,"ra":6.131188775255022,"rb":3.868811224744978},{"lSite":{"x":75.79117426648736,"y":205.2559198345989,"voronoiId":9},"rSite":{"x":44.97683406807482,"y":184.81135985348374,"voronoiId":8},"vb":{"x":19.510417046913744,"y":256.638908914144},"va":{"x":75.67131920895508,"y":171.99237474224492},"ca":[14,13],"cb":[22,24],"incline":0.6270744500917034,"capacity":101.58288575822631,"ra":1.8646277495414831,"rb":8.135372250458516,"fluids":[{"volume":48.259098172281696,"position":53.32378758594463}]},{"lSite":{"x":126.59997479058802,"y":151.71230968553573,"voronoiId":6},"rSite":{"x":75.79117426648736,"y":205.2559198345989,"voronoiId":9},"vb":{"x":116.42879534652401,"y":192.93927898462954},"va":{"x":89.10170579792808,"y":167.00795612624472},"ca":[10,14],"cb":[17,19],"incline":0.483319643161173,"capacity":37.6723151449811,"ra":2.583401784194135,"rb":7.416598215805865},{"lSite":{"x":152.57719797082245,"y":215.21951409522444,"voronoiId":10},"rSite":{"x":126.59997479058802,"y":151.71230968553573,"voronoiId":6},"vb":{"x":116.42879534652401,"y":192.93927898462954},"va":{"x":180.3300740544107,"y":166.8008621872451},"ca":[18,8],"cb":[19,16],"incline":0.24718563922890646,"capacity":69.04049719676706,"ra":3.764071803855468,"rb":6.235928196144532,"fluids":[{"volume":17.131512958696725,"position":51.908984238070346,"movedBy":0},{"volume":1.211157594198184,"position":49.43712784578128,"movedBy":0},{"volume":1.2031686503196894,"position":46.96527145349222,"movedBy":0},{"volume":0.7463330189504092,"position":44.49341506120316,"movedBy":0}]},{"lSite":{"x":198.9816077053547,"y":114.20135386288166,"voronoiId":4},"rSite":{"x":152.57719797082245,"y":215.21951409522444,"voronoiId":10},"vb":{"x":200,"y":175.83657716094535},"va":{"x":180.3300740544107,"y":166.8008621872451},"ca":[8,17],"cb":[],"incline":0.2741387679958523,"capacity":21.646018843910277,"ra":3.6293061600207386,"rb":6.370693839979261,"fluids":[{"volume":21.646018843910277,"position":0}]},{"lSite":{"x":152.57719797082245,"y":215.21951409522444,"voronoiId":10},"rSite":{"x":75.79117426648736,"y":205.2559198345989,"voronoiId":9},"vb":{"x":112.78803100201687,"y":220.99740840525402},"va":{"x":116.42879534652401,"y":192.93927898462954},"ca":[17,16],"cb":[20,21],"incline":0.9178525364816198,"capacity":28.293352427677206,"ra":0.41073731759190046,"rb":9.5892626824081,"fluids":[{"volume":0.7577763332286125,"position":27.535576094448594},{"volume":2.4718563922890553,"position":18.357050729632395},{"volume":2.4718563922890695,"position":9.178525364816197},{"volume":2.4718563922890553,"position":0}]},{"lSite":{"x":152.57719797082245,"y":215.21951409522444,"voronoiId":10},"rSite":{"x":126.1531135533005,"y":258.91754077747464,"voronoiId":11},"vb":{"x":200,"y":273.7342618970178},"va":{"x":112.78803100201687,"y":220.99740840525402},"ca":[19,21],"cb":[],"incline":0.3462360629010178,"capacity":101.91713915096386,"ra":3.2688196854949103,"rb":6.73118031450509},{"lSite":{"x":126.1531135533005,"y":258.91754077747464,"voronoiId":11},"rSite":{"x":75.79117426648736,"y":205.2559198345989,"voronoiId":9},"vb":{"x":67.33079396489282,"y":263.6594557229627},"va":{"x":112.78803100201687,"y":220.99740840525402},"ca":[20,19],"cb":[23,22],"incline":0.47981285724522516,"capacity":62.34108340723393,"ra":2.6009357137738744,"rb":7.3990642862261256,"fluids":[{"volume":1.7596311294266584,"position":38.385028579618},{"volume":2.4718563922890695,"position":33.58690000716575},{"volume":2.4718563922890695,"position":28.788771434713503},{"volume":2.4718563922890553,"position":23.990642862261254},{"volume":2.4718563922890695,"position":19.192514289809004},{"volume":2.4718563922890553,"position":14.394385717356753},{"volume":2.4718563922890695,"position":9.596257144904502},{"volume":2.4718563922890553,"position":4.798128572452251},{"volume":2.4718563922890695,"position":0},{"volume":19.44338039207667,"position":42.89770301515727}]},{"lSite":{"x":58.64744279533625,"y":322.0302570844069,"voronoiId":12},"rSite":{"x":75.79117426648736,"y":205.2559198345989,"voronoiId":9},"vb":{"x":19.510417046913744,"y":256.638908914144},"va":{"x":67.33079396489282,"y":263.6594557229627},"ca":[23,21],"cb":[24,15],"incline":-0.09279971769742712,"capacity":48.33297555574662,"ra":5.463998588487136,"rb":4.536001411512864,"fluids":[{"volume":49.222395630436715,"position":0}]},{"lSite":{"x":126.1531135533005,"y":258.91754077747464,"voronoiId":11},"rSite":{"x":58.64744279533625,"y":322.0302570844069,"voronoiId":12},"vb":{"x":129.46237232659297,"y":330.11569652489595},"va":{"x":67.33079396489282,"y":263.6594557229627},"ca":[21,22],"cb":[28,29],"incline":0.5214027136930678,"capacity":90.97672763537179,"ra":2.3929864315346605,"rb":7.607013568465339,"fluids":[{"volume":90.97672763537179,"position":0}]},{"lSite":{"x":58.64744279533625,"y":322.0302570844069,"voronoiId":12},"rSite":{"x":44.97683406807482,"y":184.81135985348374,"voronoiId":8},"vb":{"x":0,"y":258.58265924982254},"va":{"x":19.510417046913744,"y":256.638908914144},"ca":[22,15],"cb":[],"incline":0.06321546630243458,"capacity":19.607002287753037,"ra":4.683922668487828,"rb":5.316077331512172,"fluids":[{"volume":19.607002287753037,"position":6.661338147750939e-16}]},{"lSite":{"x":51.84075105935335,"y":346.5824850136414,"voronoiId":13},"rSite":{"x":58.64744279533625,"y":322.0302570844069,"voronoiId":12},"vb":{"x":0,"y":318.9908754817378},"va":{"x":87.95135998711942,"y":343.3739089448622},"ca":[26,27],"cb":[],"incline":-0.1721681988844963,"capacity":91.2686914798701,"ra":5.860840994422482,"rb":4.139159005577518,"fluids":[{"volume":91.2686914798701,"position":0}]},{"lSite":{"x":71.59512774087489,"y":375.72734314017,"voronoiId":14},"rSite":{"x":51.84075105935335,"y":346.5824850136414,"voronoiId":13},"vb":{"x":15.203314608148403,"y":392.68251374306254},"va":{"x":87.95135998711942,"y":343.3739089448622},"ca":[27,25],"cb":[35,36],"incline":0.3792156503168681,"capacity":87.88410899363964,"ra":3.103921748415659,"rb":6.896078251584341,"fluids":[{"volume":0.6645094207599413,"position":87.2195995728797},{"volume":75.84313006337365,"position":11.376469509506045},{"volume":11.376469509506038,"position":0}]},{"lSite":{"x":58.64744279533625,"y":322.0302570844069,"voronoiId":12},"rSite":{"x":71.59512774087489,"y":375.72734314017,"voronoiId":14},"vb":{"x":127.6969642691048,"y":333.7902685648463},"va":{"x":87.95135998711942,"y":343.3739089448622},"ca":[25,26],"cb":[29,30],"incline":-0.15062933063421546,"capacity":40.88470646432044,"ra":5.753146653171077,"rb":4.246853346828923,"fluids":[{"volume":39.37841315797829,"position":0},{"volume":1.506293306342151,"position":39.37841315797829}]},{"lSite":{"x":180.02893840894103,"y":380.34667272586375,"voronoiId":15},"rSite":{"x":126.1531135533005,"y":258.91754077747464,"voronoiId":11},"vb":{"x":129.46237232659297,"y":330.11569652489595},"va":{"x":200,"y":298.8194761427879},"ca":[],"cb":[29,23],"incline":0.2658440221811532,"capacity":77.16871340120731,"ra":3.6707798890942334,"rb":6.329220110905767,"fluids":[{"volume":77.64591300190841,"position":-0.4771996007010948}]},{"lSite":{"x":180.02893840894103,"y":380.34667272586375,"voronoiId":15},"rSite":{"x":58.64744279533625,"y":322.0302570844069,"voronoiId":12},"vb":{"x":127.6969642691048,"y":333.7902685648463},"va":{"x":129.46237232659297,"y":330.11569652489595},"ca":[28,23],"cb":[30,27],"incline":0.7148727837061146,"capacity":4.0766585932880295,"ra":1.4256360814694269,"rb":8.574363918530572,"fluids":[{"volume":3.890474311713559,"position":0.1861842815744703},{"volume":0.1861842815744703,"position":0}]},{"lSite":{"x":180.02893840894103,"y":380.34667272586375,"voronoiId":15},"rSite":{"x":71.59512774087489,"y":375.72734314017,"voronoiId":14},"vb":{"x":126.92245028705949,"y":351.97115410914097},"va":{"x":127.6969642691048,"y":333.7902685648463},"ca":[29,27],"cb":[32,31],"incline":0.9728960966565008,"capacity":18.197375389960115,"ra":0.13551951671749607,"rb":9.864480483282504,"fluids":[{"volume":8.468414423395107,"position":9.728960966565008},{"volume":9.728960966565008,"position":0}]},{"lSite":{"x":113.16539975814521,"y":410.59037193190306,"voronoiId":16},"rSite":{"x":71.59512774087489,"y":375.72734314017,"voronoiId":14},"vb":{"x":80.91532509639418,"y":406.82951768775456},"va":{"x":126.92245028705949,"y":351.97115410914097},"ca":[32,30],"cb":[33,34],"incline":0.5557224873105191,"capacity":71.59675706924797,"ra":2.2213875634474043,"rb":7.778612436552596,"fluids":[{"volume":71.59675706924797,"position":0}]},{"lSite":{"x":180.02893840894103,"y":380.34667272586375,"voronoiId":15},"rSite":{"x":113.16539975814521,"y":410.59037193190306,"voronoiId":16},"vb":{"x":157.7726128959381,"y":420.1754774602403},"va":{"x":126.92245028705949,"y":351.97115410914097},"ca":[30,31],"cb":[37,39],"incline":0.7295757885273787,"capacity":74.85694528081923,"ra":1.352121057363107,"rb":8.647878942636893,"fluids":[{"volume":74.67076099924476,"position":0.18618428157446942},{"volume":0.18618428157446942,"position":0}]},{"lSite":{"x":113.16539975814521,"y":410.59037193190306,"voronoiId":16},"rSite":{"x":81.10785689204931,"y":439.29756770376116,"voronoiId":17},"vb":{"x":132.14557874956964,"y":464.0387298162904},"va":{"x":80.91532509639418,"y":406.82951768775456},"ca":[31,34],"cb":[39,40],"incline":0.5350653987247087,"capacity":76.79474488359546,"ra":2.3246730063764565,"rb":7.6753269936235435,"fluids":[{"volume":1.8855890621362486,"position":74.90915582145921},{"volume":5.350653987247086,"position":69.55850183421212},{"volume":5.350653987247086,"position":64.20784784696504},{"volume":5.350653987247086,"position":58.857193859717945},{"volume":5.350653987247086,"position":53.50653987247086},{"volume":5.350653987247086,"position":48.155885885223775},{"volume":5.350653987247086,"position":42.80523189797669},{"volume":5.350653987247086,"position":37.454577910729604},{"volume":5.350653987247086,"position":32.10392392348252},{"volume":5.350653987247086,"position":26.753269936235434},{"volume":5.350653987247086,"position":21.40261594898835},{"volume":5.350653987247086,"position":16.051961961741263},{"volume":5.350653987247086,"position":10.701307974494174},{"volume":5.350653987247086,"position":5.350653987247087},{"volume":5.350653987247086,"position":0}]},{"lSite":{"x":81.10785689204931,"y":439.29756770376116,"voronoiId":17},"rSite":{"x":71.59512774087489,"y":375.72734314017,"voronoiId":14},"vb":{"x":46.11170570695308,"y":412.0375755010651},"va":{"x":80.91532509639418,"y":406.82951768775456},"ca":[33,31],"cb":[38,35],"incline":0.09456292368713182,"capacity":35.191132246517235,"ra":4.52718538156434,"rb":5.47281461843566,"fluids":[{"volume":35.191132246517235,"position":2.4424906541753444e-15}]},{"lSite":{"x":71.59512774087489,"y":375.72734314017,"voronoiId":14},"rSite":{"x":24.572852673009038,"y":450.8179259719327,"voronoiId":18},"vb":{"x":46.11170570695308,"y":412.0375755010651},"va":{"x":15.203314608148403,"y":392.68251374306254},"ca":[26,36],"cb":[34,38],"incline":0.35616778777363384,"capacity":36.46843917653675,"ra":3.219161061131831,"rb":6.780838938868169,"fluids":[{"volume":36.28225489496227,"position":0.1861842815744783},{"volume":0.18618428157447653,"position":0}]},{"lSite":{"x":24.572852673009038,"y":450.8179259719327,"voronoiId":18},"rSite":{"x":51.84075105935335,"y":346.5824850136414,"voronoiId":13},"vb":{"x":-1.7763568394002505e-15,"y":388.70534020151734},"va":{"x":15.203314608148403,"y":392.68251374306254},"ca":[35,26],"cb":[],"incline":-0.16288892658174703,"capacity":15.714919167908752,"ra":5.814444632908735,"rb":4.185555367091265,"fluids":[{"volume":15.714919167908752,"position":0}]},{"lSite":{"x":180.02893840894103,"y":380.34667272586375,"voronoiId":15},"rSite":{"x":188.02645597606897,"y":454.3278227793053,"voronoiId":19},"vb":{"x":200,"y":415.6106083018845},"va":{"x":157.7726128959381,"y":420.1754774602403},"ca":[32,39],"cb":[],"incline":-0.06855371938918252,"capacity":42.473406410002035,"ra":5.342768596945913,"rb":4.657231403054087,"fluids":[{"volume":42.473406410002035,"position":0}]},{"lSite":{"x":81.10785689204931,"y":439.29756770376116,"voronoiId":17},"rSite":{"x":24.572852673009038,"y":450.8179259719327,"voronoiId":18},"vb":{"x":64.0361519569002,"y":500},"va":{"x":46.11170570695308,"y":412.0375755010651},"ca":[34,35],"cb":[],"incline":0.8720256354079253,"capacity":89.77011694933938,"ra":0.6398718229603739,"rb":9.360128177039627,"fluids":[{"volume":89.77011694933938,"position":7.105427357601002e-15}]},{"lSite":{"x":188.02645597606897,"y":454.3278227793053,"voronoiId":19},"rSite":{"x":113.16539975814521,"y":410.59037193190306,"voronoiId":16},"vb":{"x":132.14557874956964,"y":464.0387298162904},"va":{"x":157.7726128959381,"y":420.1754774602403},"ca":[37,32],"cb":[40,33],"incline":0.663382898919342,"capacity":50.800883716621215,"ra":1.68308550540329,"rb":8.316914494596709,"fluids":[{"volume":50.800883716621215,"position":-1.7763568394002505e-15}]},{"lSite":{"x":188.02645597606897,"y":454.3278227793053,"voronoiId":19},"rSite":{"x":81.10785689204931,"y":439.29756770376116,"voronoiId":17},"vb":{"x":127.09026500310941,"y":500},"va":{"x":132.14557874956964,"y":464.0387298162904},"ca":[39,33],"cb":[],"incline":0.9110887720149953,"capacity":36.31486128709444,"ra":0.4445561399250231,"rb":9.555443860074977,"fluids":[{"volume":36.31486128709444,"position":-1.7763568394002505e-15}]}];
    sandbox.add({
        voronoiDrip: {
            width: 200,
            height: 500,
            network: network
        },
        addFluid: {
            volume: 0
        }
    });

    network = [{"lSite":{"x":167.99619875382632,"y":28.41493919491768,"voronoiId":0},"rSite":{"x":265.6086863949895,"y":31.455794479697943,"voronoiId":1},"vb":{"x":217.73499865046756,"y":0},"va":{"x":216.95481592344964,"y":25.04413057078064},"ca":[13,8],"cb":[],"incline":-0.9801742299761047,"capacity":25.05627987419215,"ra":9.900871149880523,"rb":0.09912885011947647},{"lSite":{"x":283.8404261274263,"y":43.461419586092234,"voronoiId":2},"rSite":{"x":265.6086863949895,"y":31.455794479697943,"voronoiId":1},"vb":{"x":269.5910901102776,"y":45.254287637579985},"va":{"x":299.39109931439657,"y":0},"ca":[],"cb":[10,7],"incline":0.6292782493959611,"capacity":54.184786593197906,"ra":1.853608753020195,"rb":8.146391246979805},{"lSite":{"x":298.4823677223176,"y":48.25413420796394,"voronoiId":4},"rSite":{"x":283.8404261274263,"y":43.461419586092234,"voronoiId":2},"vb":{"x":282.1786678535447,"y":73.30038610745103},"va":{"x":300,"y":18.855478572011087},"ca":[],"cb":[18,10],"incline":0.7986143256930309,"capacity":57.28741428984979,"ra":1.0069283715348454,"rb":8.993071628465154},{"lSite":{"x":109.36122620478272,"y":50.513730458915234,"voronoiId":5},"rSite":{"x":96.2315647630021,"y":44.99451896175742,"voronoiId":3},"vb":{"x":90.89364276527171,"y":76.06960301755498},"va":{"x":121.27826794325682,"y":3.7875674717551746},"ca":[6,5],"cb":[22,21],"incline":0.746666253137428,"capacity":78.4086609364738,"ra":1.2666687343128602,"rb":8.73333126568714},{"lSite":{"x":167.99619875382632,"y":28.41493919491768,"voronoiId":0},"rSite":{"x":130.68774878047407,"y":51.08251288533211,"voronoiId":6},"vb":{"x":170.81463162137527,"y":75.09046981431788},"va":{"x":125.19175639660345,"y":0},"ca":[],"cb":[25,24],"incline":0.6524255726291455,"capacity":87.86367509221364,"ra":1.7378721368542727,"rb":8.262127863145727},{"lSite":{"x":130.68774878047407,"y":51.08251288533211,"voronoiId":6},"rSite":{"x":96.2315647630021,"y":44.99451896175742,"voronoiId":3},"vb":{"x":121.27826794325682,"y":3.7875674717551746},"va":{"x":121.94748562973894,"y":0},"ca":[],"cb":[6,3],"incline":0.8886660066222468,"capacity":3.846234478681501,"ra":0.5566699668887654,"rb":9.443330033111234},{"lSite":{"x":130.68774878047407,"y":51.08251288533211,"voronoiId":6},"rSite":{"x":109.36122620478272,"y":50.513730458915234,"voronoiId":5},"vb":{"x":118.96671830773053,"y":90.45922467719657},"va":{"x":121.27826794325682,"y":3.7875674717551746},"ca":[5,3],"cb":[24,28],"incline":0.9830252531413981,"capacity":86.70247646091225,"ra":0.08487373429300948,"rb":9.915126265706991,"fluids":[{"volume":10.55701541024753,"position":76.14546105066472}]},{"lSite":{"x":265.6086863949895,"y":31.455794479697943,"voronoiId":1},"rSite":{"x":258.7804264621809,"y":54.70878414809704,"voronoiId":7},"vb":{"x":269.5910901102776,"y":45.254287637579985},"va":{"x":257.150902757144,"y":41.60121618004288},"ca":[8,9],"cb":[1,10],"incline":0.1818324508752583,"capacity":12.96546152109276,"ra":4.090837745623709,"rb":5.909162254376291},{"lSite":{"x":256.009389879182,"y":54.760267585515976,"voronoiId":8},"rSite":{"x":265.6086863949895,"y":31.455794479697943,"voronoiId":1},"vb":{"x":216.95481592344964,"y":25.04413057078064},"va":{"x":257.150902757144,"y":41.60121618004288},"ca":[9,7],"cb":[13,0],"incline":-0.2487461065442187,"capacity":43.47254858660046,"ra":6.243730532721093,"rb":3.7562694672789068},{"lSite":{"x":258.7804264621809,"y":54.70878414809704,"voronoiId":7},"rSite":{"x":256.009389879182,"y":54.760267585515976,"voronoiId":8},"vb":{"x":257.74908260183486,"y":73.79755573994377},"va":{"x":257.150902757144,"y":41.60121618004288},"ca":[7,8],"cb":[16,14],"incline":0.9881735217734376,"capacity":32.201895909760246,"ra":0.05913239113281232,"rb":9.940867608867187},{"lSite":{"x":283.8404261274263,"y":43.461419586092234,"voronoiId":2},"rSite":{"x":258.7804264621809,"y":54.70878414809704,"voronoiId":7},"vb":{"x":282.1786678535447,"y":73.30038610745103},"va":{"x":269.5910901102776,"y":45.254287637579985},"ca":[1,7],"cb":[2,18],"incline":0.7314291771099078,"capacity":30.74135248853727,"ra":1.3428541144504602,"rb":8.65714588554954},{"lSite":{"x":96.2315647630021,"y":44.99451896175742,"voronoiId":3},"rSite":{"x":50.08469510357827,"y":66.33615966886282,"voronoiId":10},"vb":{"x":81.30022157558875,"y":73.27092301568331},"va":{"x":47.41446237199866,"y":0},"ca":[],"cb":[21,20],"incline":0.7242308281666124,"capacity":80.72715055279656,"ra":1.3788458591669372,"rb":8.621154140833063},{"lSite":{"x":50.08469510357827,"y":66.33615966886282,"voronoiId":10},"rSite":{"x":19.948243838734925,"y":62.09047939628363,"voronoiId":9},"vb":{"x":28.22975334276264,"y":112.38640999645384},"va":{"x":44.062963418979656,"y":0},"ca":[],"cb":[20,45],"incline":0.9108982028070962,"capacity":113.49623647156164,"ra":0.44550898596451893,"rb":9.55449101403548,"fluids":[{"volume":33.58045906342363,"position":79.91577740813801}]},{"lSite":{"x":256.009389879182,"y":54.760267585515976,"voronoiId":8},"rSite":{"x":167.99619875382632,"y":28.41493919491768,"voronoiId":0},"vb":{"x":213.62993092620852,"y":36.151744580877434},"va":{"x":216.95481592344964,"y":25.04413057078064},"ca":[8,0],"cb":[14,15],"incline":0.8148419743664572,"capacity":11.594565504674062,"ra":0.9257901281677139,"rb":9.074209871832286},{"lSite":{"x":256.009389879182,"y":54.760267585515976,"voronoiId":8},"rSite":{"x":238.6752082966268,"y":75.07512766867876,"voronoiId":11},"vb":{"x":257.74908260183486,"y":73.79755573994377},"va":{"x":213.62993092620852,"y":36.151744580877434},"ca":[13,15],"cb":[9,16],"incline":0.449703656319856,"capacity":57.99747100004453,"ra":2.7514817184007203,"rb":7.24851828159928},{"lSite":{"x":238.6752082966268,"y":75.07512766867876,"voronoiId":11},"rSite":{"x":167.99619875382632,"y":28.41493919491768,"voronoiId":0},"vb":{"x":185.92736949721592,"y":78.11448985998919},"va":{"x":213.62993092620852,"y":36.151744580877434},"ca":[14,13],"cb":[26,25],"incline":0.6285376603549209,"capacity":50.28224240312602,"ra":1.8573116982253957,"rb":8.142688301774605},{"lSite":{"x":258.7804264621809,"y":54.70878414809704,"voronoiId":7},"rSite":{"x":238.6752082966268,"y":75.07512766867876,"voronoiId":11},"vb":{"x":262.91939213507953,"y":78.90157458575564},"va":{"x":257.74908260183486,"y":73.79755573994377},"ca":[9,14],"cb":[19,17],"incline":0.49589254156672863,"capacity":7.2651984864808385,"ra":2.520537292166357,"rb":7.479462707833643},{"lSite":{"x":256.3857634551823,"y":102.5602694414556,"voronoiId":12},"rSite":{"x":238.6752082966268,"y":75.07512766867876,"voronoiId":11},"vb":{"x":220.33845800005238,"y":106.3393803986462},"va":{"x":262.91939213507953,"y":78.90157458575564},"ca":[19,16],"cb":[35,27],"incline":0.36440500231602735,"capacity":50.65539595775963,"ra":3.1779749884198627,"rb":6.822025011580138,"fluids":[{"volume":32.23064848699238,"position":18.42474747076725}]},{"lSite":{"x":298.4823677223176,"y":48.25413420796394,"voronoiId":4},"rSite":{"x":258.7804264621809,"y":54.70878414809704,"voronoiId":7},"vb":{"x":283.25474418448624,"y":79.91922983696612},"va":{"x":282.1786678535447,"y":73.30038610745103},"ca":[2,10],"cb":[23,19],"incline":0.8973975217831212,"capacity":6.705746236307622,"ra":0.5130123910843942,"rb":9.486987608915605},{"lSite":{"x":258.7804264621809,"y":54.70878414809704,"voronoiId":7},"rSite":{"x":256.3857634551823,"y":102.5602694414556,"voronoiId":12},"vb":{"x":283.25474418448624,"y":79.91922983696612},"va":{"x":262.91939213507953,"y":78.90157458575564},"ca":[16,17],"cb":[18,23],"incline":0.03183222193890462,"capacity":20.360799718665913,"ra":4.840838890305477,"rb":5.159161109694523},{"lSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"rSite":{"x":50.08469510357827,"y":66.33615966886282,"voronoiId":10},"vb":{"x":28.22975334276264,"y":112.38640999645384},"va":{"x":81.30022157558875,"y":73.27092301568331},"ca":[21,11],"cb":[45,12],"incline":0.4043555551776813,"capacity":65.92796007912148,"ra":2.978222224111593,"rb":7.021777775888407,"fluids":[{"volume":56.07041917901979,"position":9.857540900101693}]},{"lSite":{"x":96.2315647630021,"y":44.99451896175742,"voronoiId":3},"rSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"vb":{"x":90.89364276527171,"y":76.06960301755498},"va":{"x":81.30022157558875,"y":73.27092301568331},"ca":[11,20],"cb":[3,22],"incline":0.18070556296319015,"capacity":9.993314759154462,"ra":4.096472185184049,"rb":5.903527814815951},{"lSite":{"x":109.36122620478272,"y":50.513730458915234,"voronoiId":5},"rSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"vb":{"x":117.79728808754066,"y":91.1775245548366},"va":{"x":90.89364276527171,"y":76.06960301755498},"ca":[3,21],"cb":[28,30],"incline":0.3257408802901941,"capacity":30.855395392104473,"ra":3.371295598549029,"rb":6.628704401450971,"fluids":[{"volume":23.83648587542874,"position":7.018909516675734}]},{"lSite":{"x":298.4823677223176,"y":48.25413420796394,"voronoiId":4},"rSite":{"x":256.3857634551823,"y":102.5602694414556,"voronoiId":12},"vb":{"x":300,"y":92.89968599328805},"va":{"x":283.25474418448624,"y":79.91922983696612},"ca":[18,19],"cb":[],"incline":0.419798294310475,"capacity":21.187162017438602,"ra":2.9010085284476252,"rb":7.098991471552375},{"lSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"rSite":{"x":130.68774878047407,"y":51.08251288533211,"voronoiId":6},"vb":{"x":118.96671830773053,"y":90.45922467719657},"va":{"x":170.81463162137527,"y":75.09046981431788},"ca":[25,4],"cb":[28,6],"incline":0.18345414647333647,"capacity":54.07776568067949,"ra":4.082729267633319,"rb":5.917270732366681,"fluids":[{"volume":39.80682546536545,"position":14.270940215314045}]},{"lSite":{"x":167.99619875382632,"y":28.41493919491768,"voronoiId":0},"rSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"vb":{"x":185.92736949721592,"y":78.11448985998919},"va":{"x":170.81463162137527,"y":75.09046981431788},"ca":[4,24],"cb":[15,26],"incline":0.12572555699106186,"capacity":15.412317909402546,"ra":4.3713722150446905,"rb":5.6286277849553095,"fluids":[]},{"lSite":{"x":238.6752082966268,"y":75.07512766867876,"voronoiId":11},"rSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"vb":{"x":186.62278345534753,"y":79.57809981358334},"va":{"x":185.92736949721592,"y":78.11448985998919},"ca":[15,25],"cb":[27,29],"incline":0.7176213193924579,"capacity":1.6204180539058817,"ra":1.4118934030377106,"rb":8.58810659696229,"fluids":[{"volume":0.571024411442312,"position":1.0493936424635697}]},{"lSite":{"x":238.6752082966268,"y":75.07512766867876,"voronoiId":11},"rSite":{"x":194.05238467734307,"y":131.29398437216878,"voronoiId":15},"vb":{"x":220.33845800005238,"y":106.3393803986462},"va":{"x":186.62278345534753,"y":79.57809981358334},"ca":[26,29],"cb":[17,35],"incline":0.4271136651420243,"capacity":43.04547419365852,"ra":2.864431674289878,"rb":7.135568325710122,"fluids":[{"volume":34.503200890818036,"position":8.542273302840487},{"volume":4.2711366514202425,"position":4.271136651420243},{"volume":4.2711366514202425,"position":0}]},{"lSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"rSite":{"x":109.36122620478272,"y":50.513730458915234,"voronoiId":5},"vb":{"x":117.79728808754066,"y":91.1775245548366},"va":{"x":118.96671830773053,"y":90.45922467719657},"ca":[24,6],"cb":[30,22],"incline":0.35066134387889525,"capacity":1.3724145707879194,"ra":3.2466932806055238,"rb":6.753306719394477,"fluids":[{"volume":1.3724145707879194,"position":0}]},{"lSite":{"x":194.05238467734307,"y":131.29398437216878,"voronoiId":15},"rSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"vb":{"x":174.84461910607024,"y":115.89137235749203},"va":{"x":186.62278345534753,"y":79.57809981358334},"ca":[27,26],"cb":[34,33],"incline":0.800328825281094,"capacity":38.175632519799585,"ra":0.9983558735945297,"rb":9.00164412640547,"fluids":[{"volume":6.162479508555826,"position":32.01315301124376},{"volume":8.00328825281094,"position":24.00986475843282},{"volume":8.00328825281094,"position":16.00657650562188},{"volume":8.00328825281094,"position":8.00328825281094},{"volume":8.00328825281094,"position":0}]},{"lSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"rSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"vb":{"x":117.4601092129613,"y":93.19731645163552},"va":{"x":117.79728808754066,"y":91.1775245548366},"ca":[28,22],"cb":[31,32],"incline":0.8946953774919355,"capacity":2.047742390985055,"ra":0.5265231125403225,"rb":9.473476887459677,"fluids":[{"volume":2.047742390985055,"position":0}]},{"lSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"rSite":{"x":121.41906749457121,"y":133.57616716995835,"voronoiId":16},"vb":{"x":145.81429261736423,"y":142.78126279631545},"va":{"x":117.4601092129613,"y":93.19731645163552},"ca":[30,32],"cb":[33,47],"incline":0.6693029408893851,"capacity":57.11853859862502,"ra":1.6534852955530743,"rb":8.346514704446925,"fluids":[{"volume":3.574303327474219,"position":53.544235271150804},{"volume":6.6930294088938425,"position":46.851205862256954},{"volume":6.69302940889385,"position":40.158176453363104},{"volume":6.69302940889385,"position":33.465147044469255},{"volume":6.69302940889385,"position":26.772117635575405},{"volume":6.69302940889385,"position":20.079088226681556},{"volume":6.69302940889385,"position":13.386058817787703},{"volume":6.69302940889385,"position":6.693029408893851},{"volume":6.69302940889385,"position":0}]},{"lSite":{"x":121.41906749457121,"y":133.57616716995835,"voronoiId":16},"rSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"vb":{"x":95.79107518417912,"y":125.76191599102614},"va":{"x":117.4601092129613,"y":93.19731645163552},"ca":[31,30],"cb":[38,37],"incline":0.6262170637317399,"capacity":39.115216718067664,"ra":1.8689146813413005,"rb":8.1310853186587,"fluids":[{"volume":1.5421928941632714,"position":37.57302382390439},{"volume":6.262170637317396,"position":31.310853186586996},{"volume":6.262170637317396,"position":25.048682549269596},{"volume":18.786511911952196,"position":6.262170637317399},{"volume":6.262170637317396,"position":0}]},{"lSite":{"x":171.77196841221303,"y":140.31958417966962,"voronoiId":17},"rSite":{"x":150.253004883416,"y":117.08771053701639,"voronoiId":14},"vb":{"x":145.81429261736423,"y":142.78126279631545},"va":{"x":174.84461910607024,"y":115.89137235749203},"ca":[34,29],"cb":[47,31],"incline":0.47564424637679503,"capacity":39.57052013624275,"ra":2.6217787681160254,"rb":7.378221231883975,"fluids":[{"volume":39.57052013624275,"position":0}]},{"lSite":{"x":194.05238467734307,"y":131.29398437216878,"voronoiId":15},"rSite":{"x":171.77196841221303,"y":140.31958417966962,"voronoiId":17},"vb":{"x":186.12206236362607,"y":143.7306445990898},"va":{"x":174.84461910607024,"y":115.89137235749203},"ca":[29,33],"cb":[39,41],"incline":0.7549729476303254,"capacity":30.036740924560835,"ra":1.2251352618483735,"rb":8.774864738151626,"fluids":[{"volume":7.387552495651075,"position":22.64918842890976},{"volume":7.549729476303191,"position":15.099458952606508},{"volume":7.5497294763031775,"position":7.549729476303254},{"volume":7.5497294763031775,"position":0}]},{"lSite":{"x":256.3857634551823,"y":102.5602694414556,"voronoiId":12},"rSite":{"x":194.05238467734307,"y":131.29398437216878,"voronoiId":15},"vb":{"x":227.92405862156897,"y":122.79517520062623},"va":{"x":220.33845800005238,"y":106.3393803986462},"ca":[17,27],"cb":[36,40],"incline":0.7250199315697441,"capacity":18.120003293433086,"ra":1.3749003421512795,"rb":8.62509965784872,"fluids":[{"volume":10.869803977735646,"position":7.250199315697441},{"volume":7.25019931569744,"position":0}]},{"lSite":{"x":256.3857634551823,"y":102.5602694414556,"voronoiId":12},"rSite":{"x":254.39570085145533,"y":145.57174673303962,"voronoiId":18},"vb":{"x":300,"y":126.12999754567737},"va":{"x":227.92405862156897,"y":122.79517520062623},"ca":[35,40],"cb":[],"incline":0.029434243956896755,"capacity":72.15304820768198,"ra":4.852828780215517,"rb":5.147171219784483,"fluids":[{"volume":72.15304820768198,"position":-3.9968028886505635e-15}]},{"lSite":{"x":93.37811786681414,"y":152.4458839930594,"voronoiId":19},"rSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"vb":{"x":62.09303787171742,"y":136.22835433802746},"va":{"x":95.79107518417912,"y":125.76191599102614},"ca":[38,32],"cb":[48,46],"incline":0.1917169725117901,"capacity":35.286031944434335,"ra":4.041415137441049,"rb":5.958584862558951,"fluids":[{"volume":35.28603194443434,"position":0}]},{"lSite":{"x":121.41906749457121,"y":133.57616716995835,"voronoiId":16},"rSite":{"x":93.37811786681414,"y":152.4458839930594,"voronoiId":19},"vb":{"x":130.37699501220246,"y":177.15760172489752},"va":{"x":95.79107518417912,"y":125.76191599102614},"ca":[32,37],"cb":[63,64],"incline":0.6229115247295393,"capacity":61.94919178169581,"ra":1.8854423763523043,"rb":8.114557623647695,"fluids":[{"volume":61.949191781695816,"position":0}]},{"lSite":{"x":194.05238467734307,"y":131.29398437216878,"voronoiId":15},"rSite":{"x":196.36665894649923,"y":154.34237256646156,"voronoiId":20},"vb":{"x":211.48297002479913,"y":141.1841716940026},"va":{"x":186.12206236362607,"y":143.7306445990898},"ca":[34,41],"cb":[42,44],"incline":-0.06370906068167796,"capacity":25.488431918321094,"ra":5.318545303408389,"rb":4.681454696591611,"fluids":[{"volume":25.488431918321094,"position":-8.881784197001252e-16}]},{"lSite":{"x":254.39570085145533,"y":145.57174673303962,"voronoiId":18},"rSite":{"x":194.05238467734307,"y":131.29398437216878,"voronoiId":15},"vb":{"x":227.35799607753506,"y":125.18757326732694},"va":{"x":227.92405862156897,"y":122.79517520062623},"ca":[36,35],"cb":[43,42],"incline":0.8520902704808232,"capacity":2.458453846081196,"ra":0.7395486475958846,"rb":9.260451352404115,"fluids":[{"volume":2.458453846081196,"position":0}]},{"lSite":{"x":196.36665894649923,"y":154.34237256646156,"voronoiId":20},"rSite":{"x":171.77196841221303,"y":140.31958417966962,"voronoiId":17},"vb":{"x":169.18242324659735,"y":173.44122500250157},"va":{"x":186.12206236362607,"y":143.7306445990898},"ca":[39,34],"cb":[57,58],"incline":0.6701128072958848,"capacity":34.20043802822948,"ra":1.6494359635205758,"rb":8.350564036479424,"fluids":[{"volume":34.20043802822948,"position":0}]},{"lSite":{"x":221.50584342889488,"y":158.53879988193512,"voronoiId":21},"rSite":{"x":194.05238467734307,"y":131.29398437216878,"voronoiId":15},"vb":{"x":211.48297002479913,"y":141.1841716940026},"va":{"x":227.35799607753506,"y":125.18757326732694},"ca":[43,40],"cb":[44,39],"incline":0.5024283356410268,"capacity":22.536805749692366,"ra":2.4878583217948655,"rb":7.5121416782051345,"fluids":[{"volume":2.4396723240512905,"position":20.097133425641076},{"volume":5.024283356410269,"position":15.072850069230807},{"volume":5.024283356410269,"position":10.048566712820538},{"volume":5.024283356410269,"position":5.024283356410269},{"volume":5.024283356410269,"position":0}]},{"lSite":{"x":254.39570085145533,"y":145.57174673303962,"voronoiId":18},"rSite":{"x":221.50584342889488,"y":158.53879988193512,"voronoiId":21},"vb":{"x":246.6755297912547,"y":174.18489920593936},"va":{"x":227.35799607753506,"y":125.18757326732694},"ca":[40,42],"cb":[50,56],"incline":0.7609202181033815,"capacity":52.66787500854117,"ra":1.195398909483092,"rb":8.804601090516908,"fluids":[{"volume":49.08680246189377,"position":3.5810725466474054},{"volume":3.581072546647405,"position":0}]},{"lSite":{"x":221.50584342889488,"y":158.53879988193512,"voronoiId":21},"rSite":{"x":196.36665894649923,"y":154.34237256646156,"voronoiId":20},"vb":{"x":203.68133693439626,"y":187.92075945769835},"va":{"x":211.48297002479913,"y":141.1841716940026},"ca":[42,39],"cb":[65,57],"incline":0.894701379406739,"capacity":47.38326829874555,"ra":0.5264931029663056,"rb":9.473506897033694,"fluids":[{"volume":11.59521312247599,"position":35.78805517626956},{"volume":26.84104138220217,"position":8.94701379406739},{"volume":8.947013794067388,"position":0}]},{"lSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"rSite":{"x":19.948243838734925,"y":62.09047939628363,"voronoiId":9},"vb":{"x":24.00652070562809,"y":118.14856363428963},"va":{"x":28.22975334276264,"y":112.38640999645384},"ca":[20,12],"cb":[46,49],"incline":0.5973482139109169,"capacity":7.144096055722005,"ra":2.0132589304454163,"rb":7.986741069554584,"fluids":[{"volume":7.144096055722005,"position":0}]},{"lSite":{"x":48.495346144773066,"y":168.73784953728318,"voronoiId":22},"rSite":{"x":78.68526871316135,"y":105.14037637040019,"voronoiId":13},"vb":{"x":24.00652070562809,"y":118.14856363428963},"va":{"x":62.09303787171742,"y":136.22835433802746},"ca":[48,37],"cb":[49,45],"incline":-0.28215378414239867,"capacity":42.15995281939701,"ra":6.410768920711993,"rb":3.5892310792880067,"fluids":[{"volume":41.66431745836189,"position":0},{"volume":0.49563536103512007,"position":41.66431745836189}]},{"lSite":{"x":171.77196841221303,"y":140.31958417966962,"voronoiId":17},"rSite":{"x":121.41906749457121,"y":133.57616716995835,"voronoiId":16},"vb":{"x":142.0553579952723,"y":170.8491195386041},"va":{"x":145.81429261736423,"y":142.78126279631545},"ca":[33,31],"cb":[60,63],"incline":0.9152461980286422,"capacity":28.318442252334435,"ra":0.4237690098567892,"rb":9.57623099014321,"fluids":[{"volume":10.013518291761592,"position":18.304923960572843},{"volume":9.152461980286418,"position":9.152461980286422},{"volume":9.152461980286418,"position":0}]},{"lSite":{"x":93.37811786681414,"y":152.4458839930594,"voronoiId":19},"rSite":{"x":48.495346144773066,"y":168.73784953728318,"voronoiId":22},"vb":{"x":75.16413596962028,"y":172.23795124590814},"va":{"x":62.09303787171742,"y":136.22835433802746},"ca":[37,46],"cb":[55,53],"incline":0.7783293874836177,"capacity":38.30854571702049,"ra":1.1083530625819116,"rb":8.891646937418088,"fluids":[{"volume":7.175370217675784,"position":31.13317549934471},{"volume":23.349881624508534,"position":7.783293874836177},{"volume":7.7832938748361755,"position":0}]},{"lSite":{"x":48.495346144773066,"y":168.73784953728318,"voronoiId":22},"rSite":{"x":19.948243838734925,"y":62.09047939628363,"voronoiId":9},"vb":{"x":0,"y":124.5745692797127},"va":{"x":24.00652070562809,"y":118.14856363428963},"ca":[46,45],"cb":[],"incline":0.1665052823076253,"capacity":24.851691792406395,"ra":4.167473588461874,"rb":5.832526411538126,"fluids":[{"volume":24.851691792406395,"position":6.661338147750939e-16}]},{"lSite":{"x":276.2260454474017,"y":176.43890898674726,"voronoiId":23},"rSite":{"x":254.39570085145533,"y":145.57174673303962,"voronoiId":18},"vb":{"x":246.6755297912547,"y":174.18489920593936},"va":{"x":300,"y":136.47195525323244},"ca":[],"cb":[56,43],"incline":0.39188106409925627,"capacity":65.31282618768981,"ra":3.0405946795037186,"rb":6.959405320496281,"fluids":[{"volume":65.31282618768981,"position":-7.105427357601002e-15}]},{"lSite":{"x":47.63397630304098,"y":187.31547061353922,"voronoiId":24},"rSite":{"x":48.495346144773066,"y":168.73784953728318,"voronoiId":22},"vb":{"x":17.388130539321157,"y":176.6043122800606},"va":{"x":64.1016582247236,"y":178.77023136000946},"ca":[54,53],"cb":[52,62],"incline":-0.029496382612097527,"capacity":46.76371322163956,"ra":5.147481913060488,"rb":4.852518086939512,"fluids":[{"volume":46.76371322163956,"position":0}]},{"lSite":{"x":43.50112422835082,"y":195.24973154067993,"voronoiId":25},"rSite":{"x":47.63397630304098,"y":187.31547061353922,"voronoiId":24},"vb":{"x":17.388130539321157,"y":176.6043122800606},"va":{"x":54.45815175712812,"y":195.91359836299674},"ca":[59,54],"cb":[62,51],"incline":-0.3057157105643302,"capacity":41.79754780033549,"ra":6.528578552821651,"rb":3.471421447178349,"fluids":[{"volume":41.79754780033549,"position":0}]},{"lSite":{"x":48.495346144773066,"y":168.73784953728318,"voronoiId":22},"rSite":{"x":65.34977399278432,"y":197.28098144754767,"voronoiId":26},"vb":{"x":75.16413596962028,"y":172.23795124590814},"va":{"x":64.1016582247236,"y":178.77023136000946},"ca":[51,54],"cb":[48,55],"incline":-0.33957129822407256,"capacity":12.847143548097298,"ra":6.697856491120363,"rb":3.302143508879637,"fluids":[{"volume":12.830055438749712,"position":0},{"volume":0.01708810934758631,"position":12.830055438749712}]},{"lSite":{"x":65.34977399278432,"y":197.28098144754767,"voronoiId":26},"rSite":{"x":47.63397630304098,"y":187.31547061353922,"voronoiId":24},"vb":{"x":54.45815175712812,"y":195.91359836299674},"va":{"x":64.1016582247236,"y":178.77023136000946},"ca":[53,51],"cb":[59,52],"incline":0.6737925117916833,"capacity":19.669576741497735,"ra":1.6310374410415829,"rb":8.368962558958417,"fluids":[{"volume":19.669576741497735,"position":0}]},{"lSite":{"x":93.37811786681414,"y":152.4458839930594,"voronoiId":19},"rSite":{"x":65.34977399278432,"y":197.28098144754767,"voronoiId":26},"vb":{"x":114.35225512951168,"y":196.73612660294503},"va":{"x":75.16413596962028,"y":172.23795124590814},"ca":[48,53],"cb":[64,67],"incline":0.3556807940499044,"capacity":46.21546580003254,"ra":3.2215960297504775,"rb":6.7784039702495225,"fluids":[{"volume":42.6586578595335,"position":3.556807940499044},{"volume":3.556807940499041,"position":0}]},{"lSite":{"x":276.2260454474017,"y":176.43890898674726,"voronoiId":23},"rSite":{"x":221.50584342889488,"y":158.53879988193512,"voronoiId":21},"vb":{"x":232.8079379385211,"y":216.57779319605373},"va":{"x":246.6755297912547,"y":174.18489920593936},"ca":[50,43],"cb":[69,65],"incline":0.7987334390806723,"capacity":44.603447900931144,"ra":1.006332804596639,"rb":8.993667195403361,"fluids":[{"volume":4.6667759468975305,"position":39.93667195403361},{"volume":7.987334390806723,"position":31.94933756322689},{"volume":7.987334390806723,"position":23.962003172420168},{"volume":7.987334390806723,"position":15.974668781613445},{"volume":7.987334390806723,"position":7.987334390806723},{"volume":7.987334390806723,"position":0}]},{"lSite":{"x":196.36665894649923,"y":154.34237256646156,"voronoiId":20},"rSite":{"x":174.5929331984371,"y":206.22041378170252,"voronoiId":27},"vb":{"x":203.68133693439626,"y":187.92075945769835},"va":{"x":169.18242324659735,"y":173.44122500250157},"ca":[41,58],"cb":[44,65],"incline":0.2529808167042255,"capacity":37.41432832054358,"ra":3.735095916478872,"rb":6.264904083521127,"fluids":[{"volume":32.35471198645907,"position":5.05961633408451},{"volume":2.5298081670422548,"position":2.529808167042255},{"volume":2.5298081670422548,"position":0}]},{"lSite":{"x":174.5929331984371,"y":206.22041378170252,"voronoiId":27},"rSite":{"x":171.77196841221303,"y":140.31958417966962,"voronoiId":17},"vb":{"x":162.09470820867554,"y":173.74462322461062},"va":{"x":169.18242324659735,"y":173.44122500250157},"ca":[57,41],"cb":[61,60],"incline":0.02723465345663567,"capacity":7.094205730027986,"ra":4.863826732716822,"rb":5.136173267283178,"fluids":[{"volume":7.094205730027986,"position":0}]},{"lSite":{"x":65.34977399278432,"y":197.28098144754767,"voronoiId":26},"rSite":{"x":43.50112422835082,"y":195.24973154067993,"voronoiId":25},"vb":{"x":52.13077236743453,"y":220.94749349448685},"va":{"x":54.45815175712812,"y":195.91359836299674},"ca":[54,52],"cb":[68,66],"incline":0.9409836562183437,"capacity":25.14184957949623,"ra":0.29508171890828105,"rb":9.704918281091718,"fluids":[{"volume":25.14184957949623,"position":0}]},{"lSite":{"x":161.91446555312723,"y":208.54189485311508,"voronoiId":28},"rSite":{"x":171.77196841221303,"y":140.31958417966962,"voronoiId":17},"vb":{"x":142.0553579952723,"y":170.8491195386041},"va":{"x":162.09470820867554,"y":173.74462322461062},"ca":[61,58],"cb":[63,47],"incline":-0.0913535151857432,"capacity":20.2474565951159,"ra":5.4567675759287155,"rb":4.5432324240712845,"fluids":[{"volume":8.371499620969296,"position":0},{"volume":0.9135351518574311,"position":8.371499620969296},{"volume":0.9135351518574311,"position":9.285034772826727},{"volume":0.9135351518574311,"position":10.198569924684158},{"volume":0.9135351518574311,"position":11.112105076541589},{"volume":0.9135351518574311,"position":12.02564022839902},{"volume":0.9135351518574311,"position":12.93917538025645},{"volume":0.9135351518574311,"position":13.852710532113882},{"volume":0.9135351518574311,"position":14.766245683971313},{"volume":0.9135351518574311,"position":15.679780835828744},{"volume":0.9135351518574311,"position":16.593315987686175},{"volume":0.9135351518574311,"position":17.506851139543606},{"volume":0.9135351518574311,"position":18.420386291401037},{"volume":0.9135351518574311,"position":19.33392144325847}]},{"lSite":{"x":174.5929331984371,"y":206.22041378170252,"voronoiId":27},"rSite":{"x":161.91446555312723,"y":208.54189485311508,"voronoiId":28},"vb":{"x":174.22634803821538,"y":240},"va":{"x":162.09470820867554,"y":173.74462322461062},"ca":[58,60],"cb":[],"incline":0.8847093603525915,"capacity":67.3568974686519,"ra":0.5764531982370424,"rb":9.423546801762958,"fluids":[{"volume":67.3568974686519,"position":3.552713678800501e-15}]},{"lSite":{"x":43.50112422835082,"y":195.24973154067993,"voronoiId":25},"rSite":{"x":48.495346144773066,"y":168.73784953728318,"voronoiId":22},"vb":{"x":0,"y":173.32879292560804},"va":{"x":17.388130539321157,"y":176.6043122800606},"ca":[52,51],"cb":[],"incline":-0.11853527828328558,"capacity":17.69395689759265,"ra":5.592676391416428,"rb":4.407323608583572,"fluids":[{"volume":17.69395689759265,"position":0}]},{"lSite":{"x":161.91446555312723,"y":208.54189485311508,"voronoiId":28},"rSite":{"x":121.41906749457121,"y":133.57616716995835,"voronoiId":16},"vb":{"x":130.37699501220246,"y":177.15760172489752},"va":{"x":142.0553579952723,"y":170.8491195386041},"ca":[60,47],"cb":[64,38],"incline":0.3153030431329027,"capacity":13.27332322589626,"ra":3.4234847843354865,"rb":6.5765152156645135,"fluids":[{"volume":0.6612015005801517,"position":12.612121725316108},{"volume":3.1530304313289808,"position":9.45909129398708},{"volume":3.153030431328979,"position":6.306060862658054},{"volume":3.153030431328977,"position":3.153030431329027},{"volume":3.153030431328977,"position":0}]},{"lSite":{"x":161.91446555312723,"y":208.54189485311508,"voronoiId":28},"rSite":{"x":93.37811786681414,"y":152.4458839930594,"voronoiId":19},"vb":{"x":114.35225512951168,"y":196.73612660294503},"va":{"x":130.37699501220246,"y":177.15760172489752},"ca":[63,38],"cb":[67,55],"incline":0.563335223041151,"capacity":25.300413528403563,"ra":2.1833238847942447,"rb":7.816676115205755,"fluids":[{"volume":2.7670046067575207,"position":22.533408921646043},{"volume":5.633352230411511,"position":16.900056691234532},{"volume":5.633352230411511,"position":11.266704460823021},{"volume":5.633352230411511,"position":5.633352230411511},{"volume":5.633352230411511,"position":0}]},{"lSite":{"x":221.50584342889488,"y":158.53879988193512,"voronoiId":21},"rSite":{"x":174.5929331984371,"y":206.22041378170252,"voronoiId":27},"vb":{"x":232.8079379385211,"y":216.57779319605373},"va":{"x":203.68133693439626,"y":187.92075945769835},"ca":[44,57],"cb":[56,69],"incline":0.4948267493523855,"capacity":40.860549050823145,"ra":2.525866253238073,"rb":7.474133746761927,"fluids":[{"volume":40.860549050823145,"position":0}]},{"lSite":{"x":25.935148866847157,"y":227.9213809221983,"voronoiId":29},"rSite":{"x":43.50112422835082,"y":195.24973154067993,"voronoiId":25},"vb":{"x":0,"y":192.91928309441693},"va":{"x":52.13077236743453,"y":220.94749349448685},"ca":[68,59],"cb":[],"incline":-0.31405314394851236,"capacity":59.18781974237489,"ra":6.570265719742562,"rb":3.4297342802574384,"fluids":[{"volume":59.18781974237489,"position":0}]},{"lSite":{"x":161.91446555312723,"y":208.54189485311508,"voronoiId":28},"rSite":{"x":65.34977399278432,"y":197.28098144754767,"voronoiId":26},"vb":{"x":109.30702872179076,"y":240},"va":{"x":114.35225512951168,"y":196.73612660294503},"ca":[64,55],"cb":[],"incline":0.9260942520249461,"capacity":43.55705512108876,"ra":0.3695287398752689,"rb":9.63047126012473,"fluids":[{"volume":43.55705512108876,"position":0}]},{"lSite":{"x":65.34977399278432,"y":197.28098144754767,"voronoiId":26},"rSite":{"x":25.935148866847157,"y":227.9213809221983,"voronoiId":29},"vb":{"x":66.94193468236274,"y":240},"va":{"x":52.13077236743453,"y":220.94749349448685},"ca":[59,66],"cb":[],"incline":0.5793220630783875,"capacity":24.13231305245667,"ra":2.1033896846080626,"rb":7.896610315391937,"fluids":[{"volume":24.13231305245667,"position":0}]},{"lSite":{"x":276.2260454474017,"y":176.43890898674726,"voronoiId":23},"rSite":{"x":174.5929331984371,"y":206.22041378170252,"voronoiId":27},"vb":{"x":239.67133657706142,"y":240},"va":{"x":232.8079379385211,"y":216.57779319605373},"ca":[56,65],"cb":[],"incline":0.8185317384552928,"capacity":24.407089388912066,"ra":0.9073413077235359,"rb":9.092658692276464,"fluids":[{"volume":24.407089388912066,"position":0}]}];
    sandbox.add({
        voronoiDrip: {
            width: 300,
            height: 240,
            network: network
        },
        addFluid: {
            volume: 0
        }
    });

    network = [{"vb":{"x":120.03309335698134,"y":29.066934581127484},"va":{"x":123.0049469110454,"y":0},"ca":[],"cb":[8,7]},{"vb":{"x":197.58312972605964,"y":69.46077988821625},"va":{"x":204.39422290056933,"y":0},"ca":[],"cb":[14,9]},{"vb":{"x":397.8637730672499,"y":35.44022895786099},"va":{"x":386.83244456434477,"y":0},"ca":[],"cb":[5,4]},{"vb":{"x":301.85613437211424,"y":67.00552657639497},"va":{"x":305.60346659117624,"y":0},"ca":[],"cb":[16,15]},{"vb":{"x":324.221523165083,"y":90.31778664591847},"va":{"x":397.8637730672499,"y":35.44022895786099},"ca":[5,2],"cb":[20,16]},{"vb":{"x":430.2144086132011,"y":69.51817529433391},"va":{"x":397.8637730672499,"y":35.44022895786099},"ca":[2,4],"cb":[12,11]},{"vb":{"x":464.3553668080589,"y":0},"va":{"x":434.03827546497405,"y":70.05820274732277},"ca":[12,13],"cb":[]},{"vb":{"x":0,"y":105.10538210168124},"va":{"x":120.03309335698134,"y":29.066934581127484},"ca":[8,0],"cb":[]},{"vb":{"x":144.0081611507506,"y":55.48274019829839},"va":{"x":120.03309335698134,"y":29.066934581127484},"ca":[0,7],"cb":[9,10]},{"vb":{"x":197.58312972605964,"y":69.46077988821625},"va":{"x":144.0081611507506,"y":55.48274019829839},"ca":[8,10],"cb":[1,14]},{"vb":{"x":127.08242659519014,"y":121.30118477520378},"va":{"x":144.0081611507506,"y":55.48274019829839},"ca":[9,8],"cb":[18,17]},{"vb":{"x":325.76285849948107,"y":92.25713507160361},"va":{"x":430.2144086132011,"y":69.51817529433391},"ca":[12,5],"cb":[21,20]},{"vb":{"x":434.03827546497405,"y":70.05820274732277},"va":{"x":430.2144086132011,"y":69.51817529433391},"ca":[5,11],"cb":[6,13]},{"vb":{"x":500,"y":178.57292268762788},"va":{"x":434.03827546497405,"y":70.05820274732277},"ca":[6,12],"cb":[]},{"vb":{"x":225.23691563285664,"y":96.31111634655078},"va":{"x":197.58312972605964,"y":69.46077988821625},"ca":[1,9],"cb":[15,19]},{"vb":{"x":225.23691563285664,"y":96.31111634655078},"va":{"x":301.85613437211424,"y":67.00552657639497},"ca":[16,3],"cb":[19,14]},{"vb":{"x":324.221523165083,"y":90.31778664591847},"va":{"x":301.85613437211424,"y":67.00552657639497},"ca":[3,15],"cb":[4,20]},{"vb":{"x":0,"y":132.0168143033082},"va":{"x":127.08242659519014,"y":121.30118477520378},"ca":[18,10],"cb":[]},{"vb":{"x":194.62617098440305,"y":168.68359300641146},"va":{"x":127.08242659519014,"y":121.30118477520378},"ca":[10,17],"cb":[19,22]},{"vb":{"x":194.62617098440305,"y":168.68359300641146},"va":{"x":225.23691563285664,"y":96.31111634655078},"ca":[15,14],"cb":[22,18]},{"vb":{"x":325.76285849948107,"y":92.25713507160361},"va":{"x":324.221523165083,"y":90.31778664591847},"ca":[4,16],"cb":[11,21]},{"vb":{"x":392.77722846838924,"y":303.79711148201113},"va":{"x":325.76285849948107,"y":92.25713507160361},"ca":[11,20],"cb":[35,31]},{"vb":{"x":201.26851521414778,"y":247.24157103200696},"va":{"x":194.62617098440305,"y":168.68359300641146},"ca":[19,18],"cb":[26,24]},{"vb":{"x":0,"y":215.1444591463579},"va":{"x":107.17025299853887,"y":257.8456417903874},"ca":[25,24],"cb":[]},{"vb":{"x":201.26851521414778,"y":247.24157103200696},"va":{"x":107.17025299853887,"y":257.8456417903874},"ca":[23,25],"cb":[22,26]},{"vb":{"x":83.75015229253948,"y":391.7410124433277},"va":{"x":107.17025299853887,"y":257.8456417903874},"ca":[24,23],"cb":[32,29]},{"vb":{"x":286.3143062989899,"y":301.3954781738169},"va":{"x":201.26851521414778,"y":247.24157103200696},"ca":[22,24],"cb":[31,30]},{"vb":{"x":0,"y":358.3294854311232},"va":{"x":53.69007396292677,"y":381.51236775236487},"ca":[28,29],"cb":[]},{"vb":{"x":0,"y":423.3160817489172},"va":{"x":53.69007396292677,"y":381.51236775236487},"ca":[29,27],"cb":[]},{"vb":{"x":83.75015229253948,"y":391.7410124433277},"va":{"x":53.69007396292677,"y":381.51236775236487},"ca":[27,28],"cb":[25,32]},{"vb":{"x":175.69869154337295,"y":434.2847217249987},"va":{"x":286.3143062989899,"y":301.3954781738169},"ca":[31,26],"cb":[33,38]},{"vb":{"x":392.77722846838924,"y":303.79711148201113},"va":{"x":286.3143062989899,"y":301.3954781738169},"ca":[26,30],"cb":[21,35]},{"vb":{"x":110.45346816011941,"y":444.4105889749647},"va":{"x":83.75015229253948,"y":391.7410124433277},"ca":[25,29],"cb":[39,37]},{"vb":{"x":366.4380728513158,"y":529.1882366381445},"va":{"x":175.69869154337295,"y":434.2847217249987},"ca":[30,38],"cb":[36,43]},{"vb":{"x":407.33174962643005,"y":309.5468627977375},"va":{"x":500,"y":289.08768033934547},"ca":[],"cb":[36,35]},{"vb":{"x":407.33174962643005,"y":309.5468627977375},"va":{"x":392.77722846838924,"y":303.79711148201113},"ca":[21,31],"cb":[34,36]},{"vb":{"x":366.4380728513158,"y":529.1882366381445},"va":{"x":407.33174962643005,"y":309.5468627977375},"ca":[34,35],"cb":[43,33]},{"vb":{"x":0,"y":479.5642728534383},"va":{"x":110.45346816011941,"y":444.4105889749647},"ca":[39,32],"cb":[]},{"vb":{"x":142.4899907540277,"y":460.10041608494294},"va":{"x":175.69869154337295,"y":434.2847217249987},"ca":[33,30],"cb":[40,39]},{"vb":{"x":142.4899907540277,"y":460.10041608494294},"va":{"x":110.45346816011941,"y":444.4105889749647},"ca":[32,37],"cb":[38,40]},{"vb":{"x":163.4487954931723,"y":584.607586909648},"va":{"x":142.4899907540277,"y":460.10041608494294},"ca":[38,39],"cb":[51,50]},{"vb":{"x":500,"y":547.7626809858466},"va":{"x":366.40110845356617,"y":530.3675166205339},"ca":[43,45],"cb":[]},{"vb":{"x":0,"y":555.9122197916709},"va":{"x":152.0757338576255,"y":591.0495189387475},"ca":[52,50],"cb":[]},{"vb":{"x":366.40110845356617,"y":530.3675166205339},"va":{"x":366.4380728513158,"y":529.1882366381445},"ca":[36,33],"cb":[41,45]},{"vb":{"x":134.11661573279022,"y":613.698655193125},"va":{"x":24.1743669697778,"y":636.6600439278628},"ca":[46,47],"cb":[52,53]},{"vb":{"x":346.67924573369464,"y":575.0056782806785},"va":{"x":366.40110845356617,"y":530.3675166205339},"ca":[41,43],"cb":[49,48]},{"vb":{"x":0,"y":621.6492591558522},"va":{"x":24.1743669697778,"y":636.6600439278628},"ca":[47,44],"cb":[]},{"vb":{"x":26.968755127805974,"y":743.0914924846973},"va":{"x":24.1743669697778,"y":636.6600439278628},"ca":[44,46],"cb":[76,80]},{"vb":{"x":218.3823710481082,"y":605.9927259813251},"va":{"x":346.67924573369464,"y":575.0056782806785},"ca":[49,45],"cb":[55,51]},{"vb":{"x":370.4058552936294,"y":616.7168802261255},"va":{"x":346.67924573369464,"y":575.0056782806785},"ca":[45,48],"cb":[54,56]},{"vb":{"x":152.0757338576255,"y":591.0495189387475},"va":{"x":163.4487954931723,"y":584.607586909648},"ca":[51,40],"cb":[52,42]},{"vb":{"x":218.3823710481082,"y":605.9927259813251},"va":{"x":163.4487954931723,"y":584.607586909648},"ca":[40,50],"cb":[48,55]},{"vb":{"x":134.11661573279022,"y":613.698655193125},"va":{"x":152.0757338576255,"y":591.0495189387475},"ca":[50,42],"cb":[53,44]},{"vb":{"x":88.07592230033244,"y":715.5459721097732},"va":{"x":134.11661573279022,"y":613.698655193125},"ca":[52,44],"cb":[61,69]},{"vb":{"x":464.77666915603726,"y":678.2426047491649},"va":{"x":370.4058552936294,"y":616.7168802261255},"ca":[49,56],"cb":[62,63]},{"vb":{"x":227.69697743074076,"y":699.605648562695},"va":{"x":218.3823710481082,"y":605.9927259813251},"ca":[48,51],"cb":[64,65]},{"vb":{"x":356.78104688036206,"y":663.8680291767762},"va":{"x":370.4058552936294,"y":616.7168802261255},"ca":[54,49],"cb":[57,58]},{"vb":{"x":395.98834383315693,"y":757.8795640446233},"va":{"x":356.78104688036206,"y":663.8680291767762},"ca":[56,58],"cb":[66,74]},{"vb":{"x":345.4925880622124,"y":689.762325144269},"va":{"x":356.78104688036206,"y":663.8680291767762},"ca":[57,56],"cb":[59,60]},{"vb":{"x":376.7930369928831,"y":760.6523994533921},"va":{"x":345.4925880622124,"y":689.762325144269},"ca":[58,60],"cb":[72,68]},{"vb":{"x":295.5295684696139,"y":759.9709490479531},"va":{"x":345.4925880622124,"y":689.762325144269},"ca":[59,58],"cb":[78,64]},{"vb":{"x":192.39142074092288,"y":743.254788024717},"va":{"x":88.07592230033244,"y":715.5459721097732},"ca":[53,69],"cb":[65,71]},{"vb":{"x":500,"y":677.4752856244536},"va":{"x":464.77666915603726,"y":678.2426047491649},"ca":[54,63],"cb":[]},{"vb":{"x":447.48019376819343,"y":717.5591990716943},"va":{"x":464.77666915603726,"y":678.2426047491649},"ca":[62,54],"cb":[67,66]},{"vb":{"x":295.5295684696139,"y":759.9709490479531},"va":{"x":227.69697743074076,"y":699.605648562695},"ca":[55,65],"cb":[60,78]},{"vb":{"x":192.39142074092288,"y":743.254788024717},"va":{"x":227.69697743074076,"y":699.605648562695},"ca":[64,55],"cb":[71,61]},{"vb":{"x":395.98834383315693,"y":757.8795640446233},"va":{"x":447.48019376819343,"y":717.5591990716943},"ca":[67,63],"cb":[74,57]},{"vb":{"x":464.23654038365527,"y":838.2540562086814},"va":{"x":447.48019376819343,"y":717.5591990716943},"ca":[63,66],"cb":[87,85]},{"vb":{"x":295.8100503017222,"y":761.2068997765401},"va":{"x":376.7930369928831,"y":760.6523994533921},"ca":[72,59],"cb":[79,78]},{"vb":{"x":84.75733449942936,"y":718.9854948714161},"va":{"x":88.07592230033244,"y":715.5459721097732},"ca":[61,53],"cb":[73,76]},{"vb":{"x":138.23689498289855,"y":793.2483967672584},"va":{"x":191.81357238174004,"y":747.8943300410333},"ca":[75,71],"cb":[81,73]},{"vb":{"x":191.81357238174004,"y":747.8943300410333},"va":{"x":192.39142074092288,"y":743.254788024717},"ca":[65,61],"cb":[75,70]},{"vb":{"x":390.2659313720004,"y":765.5331506453676},"va":{"x":376.7930369928831,"y":760.6523994533921},"ca":[59,68],"cb":[74,77]},{"vb":{"x":138.23689498289855,"y":793.2483967672584},"va":{"x":84.75733449942936,"y":718.9854948714161},"ca":[69,76],"cb":[70,81]},{"vb":{"x":390.2659313720004,"y":765.5331506453676},"va":{"x":395.98834383315693,"y":757.8795640446233},"ca":[66,57],"cb":[77,72]},{"vb":{"x":222.03091418165167,"y":824.0555224192622},"va":{"x":191.81357238174004,"y":747.8943300410333},"ca":[71,70],"cb":[82,83]},{"vb":{"x":26.968755127805974,"y":743.0914924846973},"va":{"x":84.75733449942936,"y":718.9854948714161},"ca":[73,69],"cb":[80,47]},{"vb":{"x":402.17629369508575,"y":836.3976416111103},"va":{"x":390.2659313720004,"y":765.5331506453676},"ca":[74,72],"cb":[85,86]},{"vb":{"x":295.8100503017222,"y":761.2068997765401},"va":{"x":295.5295684696139,"y":759.9709490479531},"ca":[60,64],"cb":[68,79]},{"vb":{"x":288.77029294052545,"y":818.8383557044617},"va":{"x":295.8100503017222,"y":761.2068997765401},"ca":[68,78],"cb":[84,82]},{"vb":{"x":0,"y":762.538216860363},"va":{"x":26.968755127805974,"y":743.0914924846973},"ca":[76,47],"cb":[]},{"vb":{"x":139.94764101605566,"y":883.9541840067338},"va":{"x":138.23689498289855,"y":793.2483967672584},"ca":[70,73],"cb":[83,95]},{"vb":{"x":288.77029294052545,"y":818.8383557044617},"va":{"x":222.03091418165167,"y":824.0555224192622},"ca":[75,83],"cb":[79,84]},{"vb":{"x":139.94764101605566,"y":883.9541840067338},"va":{"x":222.03091418165167,"y":824.0555224192622},"ca":[82,75],"cb":[95,81]},{"vb":{"x":315.8288133039287,"y":851.3321482372205},"va":{"x":288.77029294052545,"y":818.8383557044617},"ca":[79,82],"cb":[88,90]},{"vb":{"x":464.23654038365527,"y":838.2540562086814},"va":{"x":402.17629369508575,"y":836.3976416111103},"ca":[77,86],"cb":[67,87]},{"vb":{"x":369.98998063842737,"y":854.353936333024},"va":{"x":402.17629369508575,"y":836.3976416111103},"ca":[85,77],"cb":[89,88]},{"vb":{"x":500,"y":852.6577331605948},"va":{"x":464.23654038365527,"y":838.2540562086814},"ca":[67,85],"cb":[]},{"vb":{"x":315.8288133039287,"y":851.3321482372205},"va":{"x":369.98998063842737,"y":854.353936333024},"ca":[89,86],"cb":[90,84]},{"vb":{"x":382.1303086130277,"y":899.2399973742995},"va":{"x":369.98998063842737,"y":854.353936333024},"ca":[86,88],"cb":[91,92]},{"vb":{"x":280.5693574845096,"y":934.3238861040277},"va":{"x":315.8288133039287,"y":851.3321482372205},"ca":[88,84],"cb":[96,98]},{"vb":{"x":468.6663565565717,"y":961.0692464433383},"va":{"x":382.1303086130277,"y":899.2399973742995},"ca":[89,92],"cb":[102,100]},{"vb":{"x":372.86165625560716,"y":936.0314511000995},"va":{"x":382.1303086130277,"y":899.2399973742995},"ca":[91,89],"cb":[94,93]},{"vb":{"x":313.88830739240257,"y":955.1129281321644},"va":{"x":372.86165625560716,"y":936.0314511000995},"ca":[94,92],"cb":[97,96]},{"vb":{"x":398.18258108620233,"y":981.0689562185859},"va":{"x":372.86165625560716,"y":936.0314511000995},"ca":[92,93],"cb":[100,101]},{"vb":{"x":103.92767032386743,"y":941.6049461496789},"va":{"x":139.94764101605566,"y":883.9541840067338},"ca":[83,81],"cb":[107,106]},{"vb":{"x":280.5693574845096,"y":934.3238861040277},"va":{"x":313.88830739240257,"y":955.1129281321644},"ca":[97,93],"cb":[98,90]},{"vb":{"x":348.893754527335,"y":1006.7424627665368},"va":{"x":313.88830739240257,"y":955.1129281321644},"ca":[93,96],"cb":[104,99]},{"vb":{"x":172.10784230599003,"y":988.6378804582102},"va":{"x":280.5693574845096,"y":934.3238861040277},"ca":[96,90],"cb":[109,107]},{"vb":{"x":179.00584848645352,"y":1004.1611455615875},"va":{"x":348.893754527335,"y":1006.7424627665368},"ca":[104,97],"cb":[110,109]},{"vb":{"x":468.6663565565717,"y":961.0692464433383},"va":{"x":398.18258108620233,"y":981.0689562185859},"ca":[94,101],"cb":[91,102]},{"vb":{"x":361.69414886680846,"y":1021.0453131377108},"va":{"x":398.18258108620233,"y":981.0689562185859},"ca":[100,94],"cb":[105,104]},{"vb":{"x":500,"y":961.4081696922841},"va":{"x":468.6663565565717,"y":961.0692464433383},"ca":[91,100],"cb":[]},{"vb":{"x":500,"y":1030.463943973527},"va":{"x":360.9434668113488,"y":1039.7886734314097},"ca":[105,108],"cb":[]},{"vb":{"x":361.69414886680846,"y":1021.0453131377108},"va":{"x":348.893754527335,"y":1006.7424627665368},"ca":[97,99],"cb":[101,105]},{"vb":{"x":360.9434668113488,"y":1039.7886734314097},"va":{"x":361.69414886680846,"y":1021.0453131377108},"ca":[101,104],"cb":[103,108]},{"vb":{"x":0,"y":939.2071514511333},"va":{"x":103.92767032386743,"y":941.6049461496789},"ca":[107,95],"cb":[]},{"vb":{"x":172.10784230599003,"y":988.6378804582102},"va":{"x":103.92767032386743,"y":941.6049461496789},"ca":[95,106],"cb":[98,109]},{"vb":{"x":333.8052630612101,"y":1121.1863067687907},"va":{"x":360.9434668113488,"y":1039.7886734314097},"ca":[103,105],"cb":[112,113]},{"vb":{"x":179.00584848645352,"y":1004.1611455615875},"va":{"x":172.10784230599003,"y":988.6378804582102},"ca":[98,107],"cb":[99,110]},{"vb":{"x":222.52227204441607,"y":1117.8449242646877},"va":{"x":179.00584848645352,"y":1004.1611455615875},"ca":[99,109],"cb":[115,114]},{"vb":{"x":0,"y":1176.3461027732117},"va":{"x":185.47565872906716,"y":1147.8610009971462},"ca":[116,114],"cb":[]},{"vb":{"x":500,"y":1176.204532434869},"va":{"x":333.8052630612101,"y":1121.1863067687907},"ca":[108,113],"cb":[]},{"vb":{"x":280.34655070073563,"y":1137.3661142027813},"va":{"x":333.8052630612101,"y":1121.1863067687907},"ca":[112,108],"cb":[117,115]},{"vb":{"x":185.47565872906716,"y":1147.8610009971462},"va":{"x":222.52227204441607,"y":1117.8449242646877},"ca":[115,110],"cb":[116,111]},{"vb":{"x":280.34655070073563,"y":1137.3661142027813},"va":{"x":222.52227204441607,"y":1117.8449242646877},"ca":[110,114],"cb":[113,117]},{"vb":{"x":167.4464043136493,"y":1241.4989586716495},"va":{"x":185.47565872906716,"y":1147.8610009971462},"ca":[114,111],"cb":[119,118]},{"vb":{"x":303.02084803902414,"y":1306.4303867289684},"va":{"x":280.34655070073563,"y":1137.3661142027813},"ca":[113,115],"cb":[123,124]},{"vb":{"x":0,"y":1266.5730814383269},"va":{"x":167.4464043136493,"y":1241.4989586716495},"ca":[119,116],"cb":[]},{"vb":{"x":188.81637052821992,"y":1350.1717057616916},"va":{"x":167.4464043136493,"y":1241.4989586716495},"ca":[116,118],"cb":[129,131]},{"vb":{"x":410.8345571156551,"y":1308.0137458314948},"va":{"x":500,"y":1223.6032530833143},"ca":[],"cb":[122,121]},{"vb":{"x":345.5635064846563,"y":1320.1193620124886},"va":{"x":410.8345571156551,"y":1308.0137458314948},"ca":[122,120],"cb":[125,123]},{"vb":{"x":470.55817845355364,"y":1438.2612580464247},"va":{"x":410.8345571156551,"y":1308.0137458314948},"ca":[120,121],"cb":[140,133]},{"vb":{"x":345.5635064846563,"y":1320.1193620124886},"va":{"x":303.02084803902414,"y":1306.4303867289684},"ca":[117,124],"cb":[121,125]},{"vb":{"x":235.35721987528174,"y":1344.9007206020387},"va":{"x":303.02084803902414,"y":1306.4303867289684},"ca":[123,117],"cb":[128,129]},{"vb":{"x":356.7133203031461,"y":1426.6697632097253},"va":{"x":345.5635064846563,"y":1320.1193620124886},"ca":[121,123],"cb":[133,136]},{"vb":{"x":123.51957634971566,"y":1368.352944060353},"va":{"x":0,"y":1297.4000941589425},"ca":[],"cb":[132,135]},{"vb":{"x":339.8342539629903,"y":1450.0722144493711},"va":{"x":256.3899927904089,"y":1385.0579146999657},"ca":[128,130],"cb":[136,137]},{"vb":{"x":256.3899927904089,"y":1385.0579146999657},"va":{"x":235.35721987528174,"y":1344.9007206020387},"ca":[124,129],"cb":[127,130]},{"vb":{"x":188.81637052821992,"y":1350.1717057616916},"va":{"x":235.35721987528174,"y":1344.9007206020387},"ca":[128,124],"cb":[131,119]},{"vb":{"x":286.2055643240673,"y":1539.322271732582},"va":{"x":256.3899927904089,"y":1385.0579146999657},"ca":[127,128],"cb":[153,154]},{"vb":{"x":176.58826838268809,"y":1358.8550140568882},"va":{"x":188.81637052821992,"y":1350.1717057616916},"ca":[129,119],"cb":[134,132]},{"vb":{"x":123.51957634971566,"y":1368.352944060353},"va":{"x":176.58826838268809,"y":1358.8550140568882},"ca":[134,131],"cb":[135,126]},{"vb":{"x":470.55817845355364,"y":1438.2612580464247},"va":{"x":356.7133203031461,"y":1426.6697632097253},"ca":[125,136],"cb":[122,140]},{"vb":{"x":210.37485049398225,"y":1498.4111692352278},"va":{"x":176.58826838268809,"y":1358.8550140568882},"ca":[131,132],"cb":[147,139]},{"vb":{"x":80.74249128983126,"y":1477.6965177381544},"va":{"x":123.51957634971566,"y":1368.352944060353},"ca":[132,126],"cb":[139,144]},{"vb":{"x":339.8342539629903,"y":1450.0722144493711},"va":{"x":356.7133203031461,"y":1426.6697632097253},"ca":[133,125],"cb":[137,127]},{"vb":{"x":320.05652774130135,"y":1512.4631603895896},"va":{"x":339.8342539629903,"y":1450.0722144493711},"ca":[136,127],"cb":[138,150]},{"vb":{"x":320.05652774130135,"y":1512.4631603895896},"va":{"x":470.84629889787044,"y":1464.1082074564335},"ca":[141,142],"cb":[150,137]},{"vb":{"x":210.37485049398225,"y":1498.4111692352278},"va":{"x":80.74249128983126,"y":1477.6965177381544},"ca":[135,144],"cb":[134,147]},{"vb":{"x":486.18119473937304,"y":1452.065795730477},"va":{"x":470.55817845355364,"y":1438.2612580464247},"ca":[122,133],"cb":[143,142]},{"vb":{"x":418.8331288232696,"y":1540.7272150660328},"va":{"x":470.84629889787044,"y":1464.1082074564335},"ca":[142,138],"cb":[149,148]},{"vb":{"x":486.18119473937304,"y":1452.065795730477},"va":{"x":470.84629889787044,"y":1464.1082074564335},"ca":[138,141],"cb":[140,143]},{"vb":{"x":500,"y":1454.6547870192871},"va":{"x":486.18119473937304,"y":1452.065795730477},"ca":[140,142],"cb":[]},{"vb":{"x":77.95382656944872,"y":1480.7921835597415},"va":{"x":80.74249128983126,"y":1477.6965177381544},"ca":[139,135],"cb":[145,146]},{"vb":{"x":172.11874145349958,"y":1606.1106441977618},"va":{"x":77.95382656944872,"y":1480.7921835597415},"ca":[144,146],"cb":[160,159]},{"vb":{"x":0,"y":1511.6663842074395},"va":{"x":77.95382656944872,"y":1480.7921835597415},"ca":[145,144],"cb":[]},{"vb":{"x":254.57781761871178,"y":1555.6575526030442},"va":{"x":210.37485049398225,"y":1498.4111692352278},"ca":[134,139],"cb":[154,156]},{"vb":{"x":309.91934073582604,"y":1527.4901542796806},"va":{"x":418.8331288232696,"y":1540.7272150660328},"ca":[149,141],"cb":[151,150]},{"vb":{"x":453.1863909863478,"y":1612.1220585296671},"va":{"x":418.8331288232696,"y":1540.7272150660328},"ca":[141,148],"cb":[157,158]},{"vb":{"x":309.91934073582604,"y":1527.4901542796806},"va":{"x":320.05652774130135,"y":1512.4631603895896},"ca":[138,137],"cb":[148,151]},{"vb":{"x":299.5394641844963,"y":1535.8883566252116},"va":{"x":309.91934073582604,"y":1527.4901542796806},"ca":[148,150],"cb":[152,153]},{"vb":{"x":412.145323304372,"y":1637.0372978990445},"va":{"x":299.5394641844963,"y":1535.8883566252116},"ca":[151,153],"cb":[158,162]},{"vb":{"x":286.2055643240673,"y":1539.322271732582},"va":{"x":299.5394641844963,"y":1535.8883566252116},"ca":[152,151],"cb":[154,130]},{"vb":{"x":254.57781761871178,"y":1555.6575526030442},"va":{"x":286.2055643240673,"y":1539.322271732582},"ca":[153,130],"cb":[156,147]},{"vb":{"x":120.06798133969039,"y":1634.2846956482585},"va":{"x":0,"y":1574.4169280935637},"ca":[],"cb":[159,164]},{"vb":{"x":228.6644903655261,"y":1599.0735188798963},"va":{"x":254.57781761871178,"y":1555.6575526030442},"ca":[154,147],"cb":[163,160]},{"vb":{"x":500,"y":1606.6269209376455},"va":{"x":453.1863909863478,"y":1612.1220585296671},"ca":[149,158],"cb":[]},{"vb":{"x":412.145323304372,"y":1637.0372978990445},"va":{"x":453.1863909863478,"y":1612.1220585296671},"ca":[157,149],"cb":[162,152]},{"vb":{"x":120.06798133969039,"y":1634.2846956482585},"va":{"x":172.11874145349958,"y":1606.1106441977618},"ca":[160,145],"cb":[164,155]},{"vb":{"x":228.6644903655261,"y":1599.0735188798963},"va":{"x":172.11874145349958,"y":1606.1106441977618},"ca":[145,159],"cb":[156,163]},{"vb":{"x":440.8141500315714,"y":1725.0230221554457},"va":{"x":500,"y":1672.899264949312},"ca":[],"cb":[169,170]},{"vb":{"x":382.76864499175593,"y":1712.2317371299036},"va":{"x":412.145323304372,"y":1637.0372978990445},"ca":[158,152],"cb":[170,171]},{"vb":{"x":246.10595954665342,"y":1642.490697135443},"va":{"x":228.6644903655261,"y":1599.0735188798963},"ca":[156,160],"cb":[165,166]},{"vb":{"x":101.43556529148528,"y":1691.9777711009021},"va":{"x":120.06798133969039,"y":1634.2846956482585},"ca":[159,155],"cb":[168,167]},{"vb":{"x":375.51781110592674,"y":1717.5313548657275},"va":{"x":246.10595954665342,"y":1642.490697135443},"ca":[163,166],"cb":[171,172]},{"vb":{"x":212.00465415623512,"y":1770.897820960971},"va":{"x":246.10595954665342,"y":1642.490697135443},"ca":[165,163],"cb":[177,175]},{"vb":{"x":0,"y":1720.2597509938025},"va":{"x":101.43556529148528,"y":1691.9777711009021},"ca":[168,164],"cb":[]},{"vb":{"x":135.1589819081301,"y":1759.3388167244534},"va":{"x":101.43556529148528,"y":1691.9777711009021},"ca":[164,167],"cb":[175,176]},{"vb":{"x":500,"y":1758.087012050174},"va":{"x":440.8141500315714,"y":1725.0230221554457},"ca":[161,170],"cb":[]},{"vb":{"x":382.76864499175593,"y":1712.2317371299036},"va":{"x":440.8141500315714,"y":1725.0230221554457},"ca":[169,161],"cb":[171,162]},{"vb":{"x":375.51781110592674,"y":1717.5313548657275},"va":{"x":382.76864499175593,"y":1712.2317371299036},"ca":[170,162],"cb":[172,165]},{"vb":{"x":370.589605238911,"y":1735.057974388519},"va":{"x":375.51781110592674,"y":1717.5313548657275},"ca":[171,165],"cb":[174,173]},{"vb":{"x":256.5967648332413,"y":1832.8749280745885},"va":{"x":370.589605238911,"y":1735.057974388519},"ca":[174,172],"cb":[180,177]},{"vb":{"x":433.50374760234683,"y":1853.6503533581688},"va":{"x":370.589605238911,"y":1735.057974388519},"ca":[172,173],"cb":[178,179]},{"vb":{"x":212.00465415623512,"y":1770.897820960971},"va":{"x":135.1589819081301,"y":1759.3388167244534},"ca":[168,176],"cb":[166,177]},{"vb":{"x":34.260699650816505,"y":1873.0840551573547},"va":{"x":135.1589819081301,"y":1759.3388167244534},"ca":[175,168],"cb":[184,189]},{"vb":{"x":256.5967648332413,"y":1832.8749280745885},"va":{"x":212.00465415623512,"y":1770.897820960971},"ca":[166,175],"cb":[173,180]},{"vb":{"x":500,"y":1856.3056538450303},"va":{"x":433.50374760234683,"y":1853.6503533581688},"ca":[174,179],"cb":[]},{"vb":{"x":394.9130338840582,"y":1881.3534949801724},"va":{"x":433.50374760234683,"y":1853.6503533581688},"ca":[178,174],"cb":[181,182]},{"vb":{"x":257.58959898781154,"y":1880.6621780149922},"va":{"x":256.5967648332413,"y":1832.8749280745885},"ca":[173,177],"cb":[190,183]},{"vb":{"x":436.58812444977065,"y":1961.6183873971656},"va":{"x":394.9130338840582,"y":1881.3534949801724},"ca":[179,182],"cb":[186,187]},{"vb":{"x":310.8365957425633,"y":1913.0983421241795},"va":{"x":394.9130338840582,"y":1881.3534949801724},"ca":[181,179],"cb":[191,198]},{"vb":{"x":257.58959898781154,"y":1880.6621780149922},"va":{"x":118.37007936188476,"y":1902.4478126478543},"ca":[184,185],"cb":[180,190]},{"vb":{"x":34.260699650816505,"y":1873.0840551573547},"va":{"x":118.37007936188476,"y":1902.4478126478543},"ca":[185,183],"cb":[189,176]},{"vb":{"x":134.31411516197687,"y":1973.1813371942972},"va":{"x":118.37007936188476,"y":1902.4478126478543},"ca":[183,184],"cb":[193,194]},{"vb":{"x":500,"y":1955.433625758258},"va":{"x":436.58812444977065,"y":1961.6183873971656},"ca":[181,187],"cb":[]},{"vb":{"x":399.9514967316502,"y":1993.7870909555531},"va":{"x":436.58812444977065,"y":1961.6183873971656},"ca":[186,181],"cb":[202,191]},{"vb":{"x":169.08562220924495,"y":1996.2117529565742},"va":{"x":268.60483268913646,"y":1895.174027133429},"ca":[197,190],"cb":[200,193]},{"vb":{"x":1.9654668567988054,"y":1877.1681407192589},"va":{"x":34.260699650816505,"y":1873.0840551573547},"ca":[184,176],"cb":[192,199]},{"vb":{"x":268.60483268913646,"y":1895.174027133429},"va":{"x":257.58959898781154,"y":1880.6621780149922},"ca":[180,183],"cb":[197,188]},{"vb":{"x":399.9514967316502,"y":1993.7870909555531},"va":{"x":310.8365957425633,"y":1913.0983421241795},"ca":[182,198],"cb":[187,202]},{"vb":{"x":87.1245509352153,"y":2023.7303091189897},"va":{"x":1.9654668567988054,"y":1877.1681407192589},"ca":[189,199],"cb":[195,205]},{"vb":{"x":169.08562220924495,"y":1996.2117529565742},"va":{"x":134.31411516197687,"y":1973.1813371942972},"ca":[185,194],"cb":[188,200]},{"vb":{"x":129.82210337712095,"y":1980.2464193432775},"va":{"x":134.31411516197687,"y":1973.1813371942972},"ca":[193,185],"cb":[196,195]},{"vb":{"x":87.1245509352153,"y":2023.7303091189897},"va":{"x":129.82210337712095,"y":1980.2464193432775},"ca":[196,194],"cb":[205,192]},{"vb":{"x":141.98069050348363,"y":2055.1569707052563},"va":{"x":129.82210337712095,"y":1980.2464193432775},"ca":[194,195],"cb":[206,209]},{"vb":{"x":286.56783507028206,"y":1912.2375969800537},"va":{"x":268.60483268913646,"y":1895.174027133429},"ca":[190,188],"cb":[198,201]},{"vb":{"x":286.56783507028206,"y":1912.2375969800537},"va":{"x":310.8365957425633,"y":1913.0983421241795},"ca":[191,182],"cb":[201,197]},{"vb":{"x":0,"y":1877.0145407625146},"va":{"x":1.9654668567988054,"y":1877.1681407192589},"ca":[192,189],"cb":[]},{"vb":{"x":182.70642127191206,"y":2036.7903580825991},"va":{"x":169.08562220924495,"y":1996.2117529565742},"ca":[188,193],"cb":[207,206]},{"vb":{"x":271.41280543113805,"y":2061.235530508868},"va":{"x":286.56783507028206,"y":1912.2375969800537},"ca":[198,197],"cb":[218,207]},{"vb":{"x":413.33497317271673,"y":2062.365280644978},"va":{"x":399.9514967316502,"y":1993.7870909555531},"ca":[187,191],"cb":[204,215]},{"vb":{"x":0,"y":2012.7371615843629},"va":{"x":86.37594689290644,"y":2047.3167990323566},"ca":[210,205],"cb":[]},{"vb":{"x":413.33497317271673,"y":2062.365280644978},"va":{"x":500,"y":2009.1404840609766},"ca":[],"cb":[215,202]},{"vb":{"x":86.37594689290644,"y":2047.3167990323566},"va":{"x":87.1245509352153,"y":2023.7303091189897},"ca":[195,192],"cb":[210,203]},{"vb":{"x":141.98069050348363,"y":2055.1569707052563},"va":{"x":182.70642127191206,"y":2036.7903580825991},"ca":[207,200],"cb":[209,196]},{"vb":{"x":271.41280543113805,"y":2061.235530508868},"va":{"x":182.70642127191206,"y":2036.7903580825991},"ca":[200,206],"cb":[201,218]},{"vb":{"x":254.7145678222877,"y":2105.406354037039},"va":{"x":129.38402308651118,"y":2081.26775166195},"ca":[213,214],"cb":[220,223]},{"vb":{"x":123.16372391893877,"y":2067.6277314514014},"va":{"x":141.98069050348363,"y":2055.1569707052563},"ca":[206,196],"cb":[213,211]},{"vb":{"x":90.41508195694024,"y":2059.255506795058},"va":{"x":86.37594689290644,"y":2047.3167990323566},"ca":[205,203],"cb":[211,212]},{"vb":{"x":123.16372391893877,"y":2067.6277314514014},"va":{"x":90.41508195694024,"y":2059.255506795058},"ca":[210,212],"cb":[209,213]},{"vb":{"x":31.773335959263754,"y":2116.0662946027296},"va":{"x":90.41508195694024,"y":2059.255506795058},"ca":[211,210],"cb":[222,221]},{"vb":{"x":129.38402308651118,"y":2081.26775166195},"va":{"x":123.16372391893877,"y":2067.6277314514014},"ca":[209,211],"cb":[208,214]},{"vb":{"x":140.51930967889976,"y":2117.619094708665},"va":{"x":129.38402308651118,"y":2081.26775166195},"ca":[208,213],"cb":[217,216]},{"vb":{"x":397.52081656558585,"y":2100.256887443365},"va":{"x":413.33497317271673,"y":2062.365280644978},"ca":[204,202],"cb":[226,219]},{"vb":{"x":56.85621460841684,"y":2155.4211307419982},"va":{"x":140.51930967889976,"y":2117.619094708665},"ca":[217,214],"cb":[227,222]},{"vb":{"x":212.63308900991296,"y":2197.890184322407},"va":{"x":140.51930967889976,"y":2117.619094708665},"ca":[214,216],"cb":[223,237]},{"vb":{"x":274.6125018108505,"y":2068.839083399897},"va":{"x":271.41280543113805,"y":2061.235530508868},"ca":[201,207],"cb":[219,220]},{"vb":{"x":397.52081656558585,"y":2100.256887443365},"va":{"x":274.6125018108505,"y":2068.839083399897},"ca":[218,220],"cb":[215,226]},{"vb":{"x":254.7145678222877,"y":2105.406354037039},"va":{"x":274.6125018108505,"y":2068.839083399897},"ca":[219,218],"cb":[223,208]},{"vb":{"x":0,"y":2109.050007843362},"va":{"x":31.773335959263754,"y":2116.0662946027296},"ca":[222,212],"cb":[]},{"vb":{"x":56.85621460841684,"y":2155.4211307419982},"va":{"x":31.773335959263754,"y":2116.0662946027296},"ca":[212,221],"cb":[216,227]},{"vb":{"x":212.63308900991296,"y":2197.890184322407},"va":{"x":254.7145678222877,"y":2105.406354037039},"ca":[220,208],"cb":[237,217]},{"vb":{"x":500,"y":2132.3829311278782},"va":{"x":406.8966559345037,"y":2117.569897431234},"ca":[226,228],"cb":[]},{"vb":{"x":293.56728052590927,"y":2195.7580226668847},"va":{"x":403.6243961252549,"y":2133.1026666869543},"ca":[229,228],"cb":[230,231]},{"vb":{"x":406.8966559345037,"y":2117.569897431234},"va":{"x":397.52081656558585,"y":2100.256887443365},"ca":[215,219],"cb":[224,228]},{"vb":{"x":95.30857991338344,"y":2285.8366622993253},"va":{"x":56.85621460841684,"y":2155.4211307419982},"ca":[216,222],"cb":[243,246]},{"vb":{"x":403.6243961252549,"y":2133.1026666869543},"va":{"x":406.8966559345037,"y":2117.569897431234},"ca":[224,226],"cb":[229,225]},{"vb":{"x":403.7001267238918,"y":2200.1143222324613},"va":{"x":403.6243961252549,"y":2133.1026666869543},"ca":[228,225],"cb":[233,232]},{"vb":{"x":369.19253483598857,"y":2229.935234636641},"va":{"x":293.56728052590927,"y":2195.7580226668847},"ca":[225,231],"cb":[232,234]},{"vb":{"x":212.48842864520117,"y":2199.9657759285665},"va":{"x":293.56728052590927,"y":2195.7580226668847},"ca":[230,225],"cb":[238,237]},{"vb":{"x":369.19253483598857,"y":2229.935234636641},"va":{"x":403.7001267238918,"y":2200.1143222324613},"ca":[233,229],"cb":[234,230]},{"vb":{"x":451.0151779995389,"y":2245.8939663062183},"va":{"x":403.7001267238918,"y":2200.1143222324613},"ca":[229,232],"cb":[236,235]},{"vb":{"x":341.76697624245674,"y":2283.5526145725617},"va":{"x":369.19253483598857,"y":2229.935234636641},"ca":[232,230],"cb":[239,241]},{"vb":{"x":406.77623472917793,"y":2296.5552688430034},"va":{"x":451.0151779995389,"y":2245.8939663062183},"ca":[236,233],"cb":[240,239]},{"vb":{"x":500,"y":2263.1461560790076},"va":{"x":451.0151779995389,"y":2245.8939663062183},"ca":[233,235],"cb":[]},{"vb":{"x":212.48842864520117,"y":2199.9657759285665},"va":{"x":212.63308900991296,"y":2197.890184322407},"ca":[223,217],"cb":[231,238]},{"vb":{"x":197.24466792122587,"y":2238.4411499583116},"va":{"x":212.48842864520117,"y":2199.9657759285665},"ca":[231,237],"cb":[242,243]},{"vb":{"x":341.76697624245674,"y":2283.5526145725617},"va":{"x":406.77623472917793,"y":2296.5552688430034},"ca":[240,235],"cb":[241,234]},{"vb":{"x":494.27635140882734,"y":2500},"va":{"x":406.77623472917793,"y":2296.5552688430034},"ca":[235,239],"cb":[]},{"vb":{"x":296.9120843703167,"y":2317.930590927011},"va":{"x":341.76697624245674,"y":2283.5526145725617},"ca":[239,234],"cb":[245,242]},{"vb":{"x":296.9120843703167,"y":2317.930590927011},"va":{"x":197.24466792122587,"y":2238.4411499583116},"ca":[238,243],"cb":[241,245]},{"vb":{"x":95.30857991338344,"y":2285.8366622993253},"va":{"x":197.24466792122587,"y":2238.4411499583116},"ca":[242,238],"cb":[246,227]},{"vb":{"x":328.84308923146966,"y":2455.199730052538},"va":{"x":78.9041070250388,"y":2305.052748583928},"ca":[246,247],"cb":[245,250]},{"vb":{"x":328.84308923146966,"y":2455.199730052538},"va":{"x":296.9120843703167,"y":2317.930590927011},"ca":[241,242],"cb":[250,244]},{"vb":{"x":78.9041070250388,"y":2305.052748583928},"va":{"x":95.30857991338344,"y":2285.8366622993253},"ca":[243,227],"cb":[244,247]},{"vb":{"x":76.37754551855467,"y":2307.2223523941348},"va":{"x":78.9041070250388,"y":2305.052748583928},"ca":[244,246],"cb":[248,249]},{"vb":{"x":183.0792990462351,"y":2500},"va":{"x":76.37754551855467,"y":2307.2223523941348},"ca":[247,249],"cb":[]},{"vb":{"x":0,"y":2332.3186894854216},"va":{"x":76.37754551855467,"y":2307.2223523941348},"ca":[248,247],"cb":[]},{"vb":{"x":346.75525253482033,"y":2500},"va":{"x":328.84308923146966,"y":2455.199730052538},"ca":[245,244],"cb":[]}];
    sandbox.add({
        voronoiDrip: {
            width: 500,
            height: 2500,
            network: network,
            gravity: 25
        },
        addFluid: {
            volume: 750
        }
    });
});