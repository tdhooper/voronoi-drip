require(['app/network-designer'], function(NetworkDesigner) {
    var networkDesigner = NetworkDesigner.create({
        width: 500,
        height: 500,
        timeout: 10
    });

    networkDesigner.start();
});