// Rename resistance to slope

describe("a Target Calculator", function() {
    var targetCalculator,
        pipes;

    /*
        Test pipe layout

                    | 3
                    |
                    |
              0 |   |
        2       |   |
        _ _ _ _ |   |
                 \  |
                  \ |
                1  \|
                   /
                  /
                 /  4

        0   x -->

        y
        |
        V

    */

    beforeEach(function() {

        pipes = [
            {
                // 0
                va: {x: 0, y: 0},
                vb: {x: 0, y: 10},
                ca: null,
                cb: [1, 2],
            },{
                // 1
                va: {x: 10, y: 20},
                vb: {x: 0, y: 10},
                ca: [3, 4],
                cb: [0, 2],
            },{
                // 2
                va: {x: 0, y: 10},
                vb: {x: -20, y: 10},
                ca: [0, 1],
                cb: null,
            },{
                // 3
                va: {x: 10, y: 20},
                vb: {x: 10, y: -10},
                ca: [1, 4],
                cb: null,
            },{
                // 4
                va: {x: 10, y: 20},
                vb: {x: 0, y: 30},
                ca: [1, 3],
                cb: null,
            }
        ];

        var fns = VoronoiDrip.FluidNetworkSimulation;
        metrics = fns.Metrics.create({
            pipes: pipes,
            gravity: 0.1
        });
        targetCalculator = fns.TargetCalculator.create({
            pipes: pipes,
            metrics: metrics
        });
    });

    /*

        targetCalculator keeps a list of groups. A group is a list of full pipes and their end targets.

        Whenever getAvailableTargetsForVertex is called with a vertex that is in a group's full pipes, it returns the targets.

        getAvailableTargetsForPipe should return a group for all the full traveresed passed and their targets.
        getAvailableTargetsForVertex should combine and cache groups.
        If any of the results is already in a group, that group has the new items added.

        FluidAdder updates a group is one of the targets becomes full
        - If it's a target for multiple groups
        -- remove the target from both groups
        -- merge the groups
        -- add the pipe as a full one
        - Else, for the one matching group
        -- Removes the target from the group
        -- getAvailableTargetsForPipe is called with the target
        -- results are added to the group

        FluidMover clears a group when one of the group's full pipes is no longer full (so a group can be split into two)
        This happens before redistribute pressure

            This will happen a lot unless fluid is only moved in full pipes when there are no cached targets, or there is one with a lower fluid level than the top vertex.


        TargetCalculator({
            pipes: []
            metrics: {}
        })

        ------ DATA ------

        groups[]
            targets[]
            fullPipes[]

        ------ PRIVATE ------

        targetCalculator.mergeGroups(groupA, groupB)

        targetCalculator.cacheGroup(group)

        targetCalculator.uncacheGroup(group)

        targetCalculator.getCachedGroupsForTargetPipe(pipe)

        targetCalculator.getCachedGroupForFullPipeVertex(vertex)

        targetCalculator.getGroupForPipe(pipe, vertex)
            return ~

        ------ PUBLIC ------

        targetCalculator.getForVertex
            group = getCachedGroupForFullPipeVertex
            if ! group
                group = ~ getGroupForPipe, merge
                cacheGroup(group)
            return group.targets

        targetCalculator.pipeFull(pipe)
            groups = getCachedGroupsForTargetPipe(pipe)
            if multiple
                remove pipe from all groups
                newGroup = mergeGroups(A, B, ...)
                add fullpipe to newGroup
            else
                remove pipe from group
                newGroup = getGroupForPipe
                mergeGroups(group, newGroup)

        targetCalculator.pipeEmpty(pipe)
            group = getCachedGroupForFullPipeVertex(pipe.va)
            uncacheGroup(group)

    */

    describe("when getGroupForPipe is called", function() {

        var fullPipes = [],
            group;

        beforeEach(function() {
            metrics.start();

            var hasCapacity = metrics.hasCapacity;
            spyOn(metrics, 'hasCapacity').andCallFake(function(pipe) {
                if (fullPipes.indexOf(pipe) !== -1) {
                    return false;
                }
                return true;
            });
        });

        describe("with a pipe that has available capacity", function() {

            it("returns the original pipe", function() {
                var group = targetCalculator.getGroupForPipe(0, pipes[0].va);
                expect(group.targets.length).toBe(1);
                expect(group.targets).toContain({
                    pipe: pipes[0],
                    vertex: pipes[0].va,
                    highestVertex: pipes[0].va
                });
            });
        });

        describe("with two connected pipes with available capacity", function() {

            beforeEach(function() {
                fullPipes = [pipes[0]];
            });

            it("returns both pipes and their starting vertices", function() {
                var group = targetCalculator.getGroupForPipe(0, pipes[0].va);
                expect(group.targets.length).toBe(2);
                expect(group.targets).toContain({
                    pipe: pipes[1],
                    vertex: pipes[0].vb,
                    highestVertex: pipes[0].va
                });
                expect(group.targets).toContain({
                    pipe: pipes[2],
                    vertex: pipes[0].vb,
                    highestVertex: pipes[0].va
                });
            });
        });

        describe("with one full connected pipe", function() {

            beforeEach(function() {
                fullPipes = [pipes[0], pipes[1]];
                group = targetCalculator.getGroupForPipe(0, pipes[0].va);
            });

            it("adds the connected pipes to the targets list", function() {
                expect(group.targets.length).toBe(3);
                expect(group.targets).toContain({
                    pipe: pipes[2],
                    vertex: pipes[2].va,
                    highestVertex: pipes[0].va
                });
                expect(group.targets).toContain({
                    pipe: pipes[4],
                    vertex: pipes[4].va,
                    highestVertex: pipes[0].va
                });
                expect(group.targets).toContain({
                    pipe: pipes[3],
                    vertex: pipes[3].va,
                    highestVertex: pipes[0].va
                });
            });

            it("adds the full pipes to the full pipes list", function() {
                expect(group.fullPipes.length).toBe(2);
                expect(group.fullPipes).toContain(pipes[0]);
                expect(group.fullPipes).toContain(pipes[1]);
            });
        });

        describe("with two full connected pipes", function() {

            beforeEach(function() {
                fullPipes = [pipes[4], pipes[1], pipes[2]];
                group = targetCalculator.getGroupForPipe(4, pipes[4].vb);
            });

            it("adds the connected pipes of the full pipes to the targets list", function() {
                expect(group.targets.length).toBe(2);
                expect(group.targets).toContain({
                    pipe: pipes[0],
                    vertex: pipes[0].vb,
                    highestVertex: pipes[1].vb
                });
                expect(group.targets).toContain({
                    pipe: pipes[3],
                    vertex: pipes[3].va,
                    highestVertex: pipes[1].vb
                });
            });

            it("adds the full pipes to the full pipes list", function() {
                expect(group.fullPipes.length).toBe(3);
                expect(group.fullPipes).toContain(pipes[4]);
                expect(group.fullPipes).toContain(pipes[1]);
                expect(group.fullPipes).toContain(pipes[2]);
            });
        });

        describe("when the highest point is higher than the starting point", function() {

            beforeEach(function() {
                fullPipes = [pipes[0], pipes[1], pipes[3]];
            });

            it("sets the highest vertex correctly", function() {
                var group = targetCalculator.getGroupForPipe(0, pipes[0].va);
                expect(group.targets.length).toBe(2);
                expect(group.targets).toContain({
                    pipe: pipes[2],
                    vertex: pipes[2].va,
                    highestVertex: pipes[3].vb
                });
                expect(group.targets).toContain({
                    pipe: pipes[4],
                    vertex: pipes[4].va,
                    highestVertex: pipes[3].vb
                });
            });
        });

        describe("and there is a loop of full pipes", function() {

            var connectedSpy;

            beforeEach(function() {
                pipes = [
                    {
                        // 0
                        va: {x: 10, y: 10},
                        vb: {x: 0, y: 20},
                        ca: [1],
                        cb: [2],
                    },{
                        // 1
                        va: {x: 10, y: 10},
                        vb: {x: 20, y: 20},
                        ca: [0],
                        cb: [2],
                    },{
                        // 2
                        va: {x: 0, y: 20},
                        vb: {x: 20, y: 20},
                        ca: [0],
                        cb: [1],
                    }
                ];
                targetCalculator.pipes = pipes;
                metrics.pipes = pipes;
                fullPipes = [pipes[0], pipes[1], pipes[2]];
                spyOn(targetCalculator, 'getGroupForPipe').andCallThrough();
                connectedSpy = spyOn(metrics, 'getConnectedPipeIndexes').andCallThrough();
            });

            it("does not re-check already checked pipe and vertex combinations", function() {
                targetCalculator.getGroupForPipe(0, pipes[0].va);
                expect(connectedSpy.callCount).toBe(3);
                expect(connectedSpy).toHaveBeenCalledWith(0, pipes[0].vb);
                expect(connectedSpy).toHaveBeenCalledWith(2, pipes[2].vb);
                expect(connectedSpy).toHaveBeenCalledWith(1, pipes[1].va);
            });

        });

        // May need to cache the results, rather than returning false

    });

    describe("when cacheGroup is called", function() {

        var someGroup = {};

        beforeEach(function() {
            targetCalculator.cacheGroup(someGroup)
        });

        it("adds the group to the cache", function() {
            expect(targetCalculator.cache).toContain(someGroup);
        });
    });

    describe("when getCachedGroupContainingFullPipe is called", function() {

        var groupA,
            groupB;

        describe("and there is a matching group", function() {

            beforeEach(function() {
                groupA = {
                    fullPipes: [
                        pipes[0]
                    ]
                };
                groupB = {
                    fullPipes: [
                        pipes[1],
                        pipes[2]
                    ]
                };
                targetCalculator.cache = [groupA, groupB]
            });

            it("returns the group that contains the pipe in it's full pipes list", function() {
                var cachedGroup = targetCalculator.getCachedGroupContainingFullPipe(pipes[0]);
                expect(cachedGroup).toBe(groupA);
            });
        });

        describe("and there is no matching group", function() {

            beforeEach(function() {
                groupA = {
                    fullPipes: [
                        pipes[3]
                    ]
                };
                groupB = {
                    fullPipes: [
                        pipes[1],
                        pipes[2]
                    ]
                };
                targetCalculator.cache = [groupA, groupB]
                targetCalculator.getCachedGroupContainingFullPipe(pipes[0]);
            });

            it("returns nothing", function() {
                var cachedGroup = targetCalculator.getCachedGroupContainingFullPipe(pipes[0]);
                expect(cachedGroup).toBeUndefined();
            });
        });
    });

    describe("when megeGroups is called", function() {

        var newGroup;

        beforeEach(function() {
            groupA = {
                targets: [
                    {
                        pipe: pipes[0],
                        vertex: pipes[0].va
                    },{
                        pipe: pipes[1],
                        vertex: pipes[1].va
                    }
                ],
                fullPipes: [
                    pipes[2],
                    pipes[3]
                ]
            };
            groupB = {
                targets: [
                    {
                        pipe: pipes[0],
                        vertex: pipes[0].va
                    },{
                        pipe: pipes[1],
                        vertex: pipes[1].vb
                    },{
                        pipe: pipes[3],
                        vertex: pipes[3].va
                    }
                ],
                fullPipes: [
                    pipes[2],
                    pipes[4],
                    pipes[5]
                ]
            };
            newGroup = targetCalculator.mergeGroups(groupA, groupB);
        });

        it("returns a merged group without any duplicates", function() {
            expect(newGroup.targets.length).toBe(4);
            expect(newGroup.targets).toContain({
                pipe: pipes[0],
                vertex: pipes[0].va
            });
            expect(newGroup.targets).toContain({
                pipe: pipes[1],
                vertex: pipes[1].va
            });
            expect(newGroup.targets).toContain({
                pipe: pipes[1],
                vertex: pipes[1].vb
            });
            expect(newGroup.targets).toContain({
                pipe: pipes[3],
                vertex: pipes[3].va
            });

            expect(newGroup.fullPipes.length).toBe(4);
            expect(newGroup.fullPipes).toContain(pipes[2]);
            expect(newGroup.fullPipes).toContain(pipes[3]);
            expect(newGroup.fullPipes).toContain(pipes[4]);
            expect(newGroup.fullPipes).toContain(pipes[5]);
        });
    });

    describe("when getForVertex is called", function() {

        var groupSpy;

        beforeEach(function() {
            metrics.start();
            spyOn(metrics, 'getVertexPipes').andReturn([
                pipes[0],
                pipes[2],
                pipes[1]
            ]);
            groupSpy = spyOn(targetCalculator, 'getGroupForPipe');
        });

        describe("and there is no matching group in the cache", function() {

            var targets;

            beforeEach(function() {
                groupSpy.andCallFake(function(pipeIndex) {
                    switch (pipeIndex) {
                        case 0:
                            return {
                                targets: [
                                    {
                                        pipe: pipes[0],
                                        vertex: pipes[0].va
                                    },{
                                        pipe: pipes[1],
                                        vertex: pipes[1].va
                                    }
                                ],
                                fullPipes: [
                                    pipes[2],
                                    pipes[3]
                                ]
                            }
                        case 1:
                            return {
                                targets: [
                                    {
                                        pipe: pipes[0],
                                        vertex: pipes[0].va
                                    },{
                                        pipe: pipes[1],
                                        vertex: pipes[1].vb
                                    },{
                                        pipe: pipes[3],
                                        vertex: pipes[3].va
                                    }
                                ],
                                fullPipes: [
                                    pipes[2],
                                    pipes[4],
                                    pipes[5]
                                ]
                            }
                        case 2:
                            return {
                                targets: [
                                    {
                                        pipe: pipes[4],
                                        vertex: pipes[4].vb
                                    },{
                                        pipe: pipes[3],
                                        vertex: pipes[3].va
                                    }
                                ],
                                fullPipes: [
                                    pipes[4],
                                    pipes[6]
                                ]
                            }
                    }
                });
                spyOn(targetCalculator, 'cacheGroup');
                targets = targetCalculator.getForVertex(pipes[0], pipes[0].vb);
            });

            it("gets the vertex pipes", function() {
                expect(metrics.getVertexPipes).toHaveBeenCalledWith(pipes[0], pipes[0].vb);
            });

            it("calls getGroupForPipe for each pipe", function() {
                expect(groupSpy.callCount).toBe(3);
                expect(groupSpy).toHaveBeenCalledWith(0, pipes[0].vb);
                expect(groupSpy).toHaveBeenCalledWith(1, pipes[0].vb);
                expect(groupSpy).toHaveBeenCalledWith(2, pipes[0].vb);
            });

            it("concatenates and removes duplicates from the getGroupForPipe groups and caches them", function() {
                expect(targetCalculator.cacheGroup).toHaveBeenCalled();
                var cachedGroup = targetCalculator.cacheGroup.mostRecentCall.args[0];

                expect(cachedGroup.targets.length).toBe(5);
                expect(cachedGroup.targets).toContain({
                    pipe: pipes[0],
                    vertex: pipes[0].va
                });
                expect(cachedGroup.targets).toContain({
                    pipe: pipes[1],
                    vertex: pipes[1].va
                });
                expect(cachedGroup.targets).toContain({
                    pipe: pipes[1],
                    vertex: pipes[1].vb
                });
                expect(cachedGroup.targets).toContain({
                    pipe: pipes[3],
                    vertex: pipes[3].va
                });
                expect(cachedGroup.targets).toContain({
                    pipe: pipes[4],
                    vertex: pipes[4].vb
                });

                expect(cachedGroup.fullPipes.length).toBe(4);
                expect(cachedGroup.fullPipes).toContain(pipes[2]);
                expect(cachedGroup.fullPipes).toContain(pipes[3]);
                expect(cachedGroup.fullPipes).toContain(pipes[4]);
                expect(cachedGroup.fullPipes).toContain(pipes[5]);
                expect(cachedGroup.fullPipes).toContain(pipes[6]);
            });

            it("returns the concatenated group's targets", function() {
                expect(targets.length).toBe(5);
                expect(targets).toContain({
                    pipe: pipes[0],
                    vertex: pipes[0].va
                });
                expect(targets).toContain({
                    pipe: pipes[1],
                    vertex: pipes[1].va
                });
                expect(targets).toContain({
                    pipe: pipes[1],
                    vertex: pipes[1].vb
                });
                expect(targets).toContain({
                    pipe: pipes[3],
                    vertex: pipes[3].va
                });
                expect(targets).toContain({
                    pipe: pipes[4],
                    vertex: pipes[4].vb
                });
            });
        });


        describe("and there is a matching group in the cache", function() {

            var cachedGroup;

            beforeEach(function() {
                cachedGroup = {
                    targets: ['C', 'D', 'E'],
                    fullPipes: [3, 4, 5]
                };
                spyOn(targetCalculator, 'getCachedGroupContainingFullPipe').andReturn(cachedGroup);
            });

            it("returns the cached group's targets", function() {
                var targets = targetCalculator.getForVertex(pipes[0], pipes[0].vb);
                expect(targets).toBe(cachedGroup.targets);
            });
        });
    });

    describe("when getCachedGroupsContainingTargetPipe is called", function() {

        var groupA,
            groupB;

        describe("and there is a matching group", function() {

            beforeEach(function() {
                groupA = {
                    targets: [{
                        pipe: pipes[0]
                    }]
                };
                groupB = {
                    targets: [{
                        pipe: pipes[1]
                    },{
                        pipe: pipes[2]
                    }]
                };
                targetCalculator.cache = [groupA, groupB]
            });

            it("returns the group that contains the pipe in it's targets list", function() {
                var cachedGroups = targetCalculator.getCachedGroupsContainingTargetPipe(pipes[0]);
                expect(cachedGroups.length).toBe(1);
                expect(cachedGroups).toContain(groupA);
            });
        });


        describe("and there are two matching groups", function() {

            beforeEach(function() {
                groupA = {
                    targets: [{
                        pipe: pipes[0]
                    }]
                };
                groupB = {
                    targets: [{
                        pipe: pipes[0]
                    },{
                        pipe: pipes[2]
                    }]
                };
                targetCalculator.cache = [groupA, groupB]
            });

            it("returns the group that contains the pipe in it's targets list", function() {
                var cachedGroups = targetCalculator.getCachedGroupsContainingTargetPipe(pipes[0]);
                expect(cachedGroups.length).toBe(2);
                expect(cachedGroups).toContain(groupA);
                expect(cachedGroups).toContain(groupB);
            });
        });

        describe("and there is no matching group", function() {

            beforeEach(function() {
                groupA = {
                    targets: [
                        pipes[3]
                    ]
                };
                groupB = {
                    targets: [
                        pipes[1],
                        pipes[2]
                    ]
                };
                targetCalculator.cache = [groupA, groupB]
            });

            it("returns nothing", function() {
                var cachedGroups = targetCalculator.getCachedGroupsContainingTargetPipe(pipes[0]);
                expect(cachedGroups).toBeUndefined();
            });
        });
    });
});