define(['app/fluid-network-simulation', 'app/metrics', 'app/target-calculator'], function(FluidNetworkSimulation, Metrics, TargetCalculator) {

    describe("a Target Calculator", function() {
        var targetCalculator,
            pipes,
            metrics;

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

            metrics = Metrics.create({
                pipes: pipes,
                gravity: 0.1
            });
            targetCalculator = TargetCalculator.create({
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

                spyOn(metrics, 'hasCapacity').and.callFake(function(pipe) {
                    if (fullPipes.indexOf(pipe) !== -1) {
                        return false;
                    }
                    return true;
                });
            });

            describe("with a pipe that has available capacity", function() {

                var group;

                beforeEach(function() {
                    group = targetCalculator.getGroupForPipe(pipes[0], pipes[0].va);
                });

                it("returns the original pipe as the target", function() {
                    expect(group.targets.length).toBe(1);
                    expect(group.targets).toContain({
                        pipe: pipes[0],
                        vertex: pipes[0].va,
                        highestVertex: pipes[0].va
                    });
                });

                it("returns an empty array for the full pipes", function() {
                    expect(group.fullPipes).toEqual([]);
                });
            });

            describe("with two connected pipes with available capacity", function() {

                var group;

                beforeEach(function() {
                    fullPipes = [pipes[0]];
                    group = targetCalculator.getGroupForPipe(pipes[0], pipes[0].va);
                });

                it("returns both pipes and their starting vertices as targets", function() {
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

                it("adds the full pipe to the full pipes list", function() {
                    expect(group.fullPipes.length).toBe(1);
                    expect(group.fullPipes).toContain(pipes[0]);
                });
            });

            describe("with one full connected pipe", function() {

                beforeEach(function() {
                    fullPipes = [pipes[0], pipes[1]];
                    group = targetCalculator.getGroupForPipe(pipes[0], pipes[0].va);
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
                });

                describe("and starting from an end", function() {

                    beforeEach(function() {
                        group = targetCalculator.getGroupForPipe(pipes[4], pipes[4].vb);
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

                describe("and starting from the middle", function() {

                    beforeEach(function() {
                        group = targetCalculator.getGroupForPipe(pipes[1], pipes[1].va);
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
            });

            describe("with a full dead end pipe", function() {

                var group;

                beforeEach(function() {
                    fullPipes = [pipes[4]];
                    group = targetCalculator.getGroupForPipe(pipes[4], pipes[4].va);
                });

                it("adds the connected pipes on the other end to the targets list", function() {
                    expect(group.targets.length).toBe(2);
                    expect(group.targets).toContain({
                        pipe: pipes[3],
                        vertex: pipes[3].va,
                        highestVertex: pipes[4].va
                    });
                    expect(group.targets).toContain({
                        pipe: pipes[1],
                        vertex: pipes[1].va,
                        highestVertex: pipes[4].va
                    });
                });

                it("adds the full pipe to the full pipes list", function() {
                    expect(group.fullPipes.length).toBe(1);
                    expect(group.fullPipes).toContain(pipes[4]);
                });
            });

            describe("when the highest point is higher than the starting point", function() {

                beforeEach(function() {
                    fullPipes = [pipes[0], pipes[1], pipes[3]];
                });

                it("sets the highest vertex correctly", function() {
                    var group = targetCalculator.getGroupForPipe(pipes[0], pipes[0].va);
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

                beforeEach(function() {
                    pipes.push({
                        // 5
                        va: {x: 0, y: 30},
                        vb: {x: -20, y: 10},
                        ca: [4],
                        cb: [2]
                    });
                    pipes[4].cb = [5];
                    pipes[2].cb = [5];
                    fullPipes = [pipes[0], pipes[1], pipes[2], pipes[3], pipes[4], pipes[5]];
                    spyOn(targetCalculator, 'getGroupForPipe').and.callThrough();
                });

                it("checks each pipe exactly once when starting from an end", function() {
                    targetCalculator.getGroupForPipe(pipes[0], pipes[0].va);
                    expect(metrics.hasCapacity.calls.count()).toBe(6);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[0]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[1]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[2]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[3]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[4]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[5]);
                });

                it("checks each pipe exactly once when starting from the middle", function() {
                    targetCalculator.getGroupForPipe(pipes[0], pipes[0].vb);
                    expect(metrics.hasCapacity.calls.count()).toBe(6);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[0]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[1]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[2]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[3]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[4]);
                    expect(metrics.hasCapacity).toHaveBeenCalledWith(pipes[5]);
                });                

            });

            // May need to cache the results, rather than returning false

        });

        describe("when cacheGroup is called", function() {

            var someGroup = 'A';

            beforeEach(function() {
                targetCalculator.cacheGroup(someGroup);
            });

            it("adds the group to the cache", function() {
                expect(targetCalculator.cache).toContain(someGroup);
            });
        });

        describe("when uncacheGroup is called", function() {

            var someGroup = 'A';

            beforeEach(function() {
                targetCalculator.cache = ['B', someGroup, 'C', 'D'];
                targetCalculator.uncacheGroup(someGroup);
            });

            it("removes the group from the cache", function() {
                expect(targetCalculator.cache.length).toBe(3);
                expect(targetCalculator.cache).not.toContain(someGroup);
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
                    targetCalculator.cache = [groupA, groupB];
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
                    targetCalculator.cache = [groupA, groupB];
                    targetCalculator.getCachedGroupContainingFullPipe(pipes[0]);
                });

                it("returns nothing", function() {
                    var cachedGroup = targetCalculator.getCachedGroupContainingFullPipe(pipes[0]);
                    expect(cachedGroup).toBeUndefined();
                });
            });
        });

        describe("when mergeGroups is called", function() {

            var newGroup,
                groupA,
                groupB;

            beforeEach(function() {
                groupA = {
                    targets: [
                        {
                            pipe: pipes[0],
                            vertex: pipes[0].va
                        },{
                            pipe: pipes[1],
                            vertex: pipes[1].va
                        },{
                            pipe: pipes[2],
                            vertex: pipes[2].va
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
                            pipe: pipes[2],
                            vertex: pipes[1].vb // same vertex as pipes[2].va
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
                expect(newGroup.targets.length).toBe(5);
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
                    pipe: pipes[2],
                    vertex: pipes[2].va
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

            var cachedGroupSpy,
                groupSpy,
                groupA,
                groupB,
                groupC;

            beforeEach(function() {
                cachedGroupSpy = spyOn(targetCalculator, 'getCachedGroupContainingFullPipe');
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
                groupC = {
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
                };
                groupSpy = spyOn(targetCalculator, 'getGroupForPipe');
                groupSpy.and.callFake(function(pipeIndex) {
                    switch (pipeIndex) {
                        case pipes[0]:
                            return groupA;
                        case pipes[1]:
                            return groupB;
                        case pipes[2]:
                            return groupC;
                    }
                });
                metrics.start();
                spyOn(metrics, 'getVertexPipes').and.returnValue([
                    pipes[0],
                    pipes[2],
                    pipes[1]
                ]);
            });

            it("gets the vertex pipes", function() {
                targetCalculator.getForVertex(pipes[0], pipes[0].vb);
                expect(metrics.getVertexPipes).toHaveBeenCalledWith(pipes[0], pipes[0].vb);
            });

            it("checks the cache for each of the vertex pipes", function() {
                targetCalculator.getForVertex(pipes[0], pipes[0].vb);
                expect(cachedGroupSpy.calls.count()).toBe(3);
                expect(cachedGroupSpy).toHaveBeenCalledWith(pipes[0]);
                expect(cachedGroupSpy).toHaveBeenCalledWith(pipes[2]);
                expect(cachedGroupSpy).toHaveBeenCalledWith(pipes[1]);
            });

            describe("and there is a matching group in the cache", function() {

                var cachedGroup;

                beforeEach(function() {
                    cachedGroup = {
                        targets: ['C', 'D', 'E'],
                        fullPipes: [3, 4, 5]
                    };
                    cachedGroupSpy.and.returnValue(cachedGroup);
                });

                it("returns the cached group's targets", function() {
                    var targets = targetCalculator.getForVertex(pipes[0], pipes[0].vb);
                    expect(targets).toBe(cachedGroup.targets);
                });
            });

            describe("and there is no matching group in the cache", function() {

                beforeEach(function() {
                    spyOn(targetCalculator, 'cacheGroup');
                });

                it("calls getGroupForPipe for each pipe", function() {
                    targetCalculator.getForVertex(pipes[0], pipes[0].vb);
                    expect(groupSpy.calls.count()).toBe(3);
                    expect(groupSpy).toHaveBeenCalledWith(pipes[0], pipes[0].vb);
                    expect(groupSpy).toHaveBeenCalledWith(pipes[1], pipes[0].vb);
                    expect(groupSpy).toHaveBeenCalledWith(pipes[2], pipes[0].vb);
                });

                it("concatenates and removes duplicates from the getGroupForPipe groups and caches them", function() {
                    targetCalculator.getForVertex(pipes[0], pipes[0].vb);
                    expect(targetCalculator.cacheGroup).toHaveBeenCalled();
                    var cachedGroup = targetCalculator.cacheGroup.calls.mostRecent().args[0];

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

                describe("when there are no full pipes in the groups returned by getGroupForPipe", function() {

                    beforeEach(function() {
                        groupA.fullPipes = [];
                        groupB.fullPipes = [];
                        groupC.fullPipes = [];
                        targetCalculator.getForVertex(pipes[0], pipes[0].vb);
                    });

                    it("doesn't cache them", function() {
                        expect(targetCalculator.cacheGroup).not.toHaveBeenCalled();
                    });
                });

                it("returns the concatenated group's targets", function() {
                    var targets = targetCalculator.getForVertex(pipes[0], pipes[0].vb);
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
                    targetCalculator.cache = [groupA, groupB];
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
                    targetCalculator.cache = [groupA, groupB];
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
                    targetCalculator.cache = [groupA, groupB];
                });

                it("returns nothing", function() {
                    var cachedGroups = targetCalculator.getCachedGroupsContainingTargetPipe(pipes[0]);
                    expect(cachedGroups).toBeUndefined();
                });
            });
        });

        describe("when pipeFull is called", function() {

            var getCacheSpy,
                groupA,
                groupB,
                mergeSpy,
                mergedGroup;

            beforeEach(function() {
                groupA = {
                    targets: [{
                        pipe: pipes[0],
                        vertex: pipes[0].va
                    }],
                    fullPipes: [
                        pipes[3],
                        pipes[4]
                    ]
                };
                groupB = {
                    targets: [{
                        pipe: pipes[0],
                        vertex: pipes[0].vb
                    },{
                        pipe: pipes[2],
                        vertex: pipes[2].va
                    }],
                    fullPipes: [
                        pipes[5]
                    ]
                };
                spyOn(targetCalculator, 'cacheGroup');
                spyOn(targetCalculator, 'uncacheGroup');
                getCacheSpy = spyOn(targetCalculator, 'getCachedGroupsContainingTargetPipe');
            });

            it("gets the cached groups containing the target pipe", function() {
                targetCalculator.pipeFull(pipes[0]);
                expect(getCacheSpy).toHaveBeenCalledWith(pipes[0]);
            });

            describe("and there are two groups containing the target pipe", function() {

                beforeEach(function() {
                    getCacheSpy.and.returnValue([groupA, groupB]);
                    mergedGroup = {
                        targets: [{
                            pipe: pipes[0],
                            vertex: pipes[0].va
                        },{
                            pipe: pipes[0],
                            vertex: pipes[0].vb
                        },{
                            pipe: pipes[2],
                            vertex: pipes[2].va
                        }],
                        fullPipes: [
                            pipes[3],
                            pipes[4],
                            pipes[5]
                        ]
                    };
                    mergeSpy = spyOn(targetCalculator, 'mergeGroups').and.returnValue(mergedGroup);
                    targetCalculator.pipeFull(pipes[0]);
                });

                it("merges them", function() {
                    expect(mergeSpy).toHaveBeenCalledWith(groupA, groupB);
                });

                it("removes the target pipe", function() {
                    expect(mergedGroup.targets.length).toBe(1);
                    expect(mergedGroup.targets).toContain({
                        pipe: pipes[2],
                        vertex: pipes[2].va
                    });
                });

                it("adds the target pipe as a full pipe", function() {
                    expect(mergedGroup.fullPipes).toContain(pipes[0]);
                });

                it("caches the merged group", function() {
                    expect(targetCalculator.cacheGroup).toHaveBeenCalledWith(mergedGroup);
                });

                it("uncaches the original groups", function() {
                    expect(targetCalculator.uncacheGroup).toHaveBeenCalledWith(groupA);
                    expect(targetCalculator.uncacheGroup).toHaveBeenCalledWith(groupB);
                });
            });

            describe("and there is one group containing the target pipe", function() {

                var getGroupSpy,
                    pipeGroup;

                beforeEach(function() {
                    pipeGroup = {
                        targets: [{
                            pipe: pipes[1],
                            vertex: pipes[1].va
                        },{
                            pipe: pipes[2],
                            vertex: pipes[2].va
                        }],
                        fullPipes: [
                            pipes[0]
                        ]
                    };
                    getGroupSpy = spyOn(targetCalculator, 'getGroupForPipe').and.returnValue(pipeGroup);
                    mergedGroup = {
                        targets: [{
                            pipe: pipes[1],
                            vertex: pipes[1].va
                        },{
                            pipe: pipes[2],
                            vertex: pipes[2].va
                        }],
                        fullPipes: [
                            pipes[3],
                            pipes[4],
                            pipes[0]
                        ]
                    };
                    mergeSpy = spyOn(targetCalculator, 'mergeGroups').and.returnValue(mergedGroup);
                    getCacheSpy.and.returnValue([groupA]);
                    targetCalculator.pipeFull(pipes[0]);
                });

                it("gets the group for the target", function() {
                    expect(getGroupSpy).toHaveBeenCalledWith(pipes[0], pipes[0].va);
                });

                it("merges the group and pipe group", function() {
                    expect(mergeSpy).toHaveBeenCalledWith(groupA, pipeGroup);
                });

                it("removes the target pipe", function() {
                    expect(groupA.targets).not.toContain({
                        pipe: pipes[0],
                        vertex: pipes[0].va
                    });
                });

                it("caches the merged group", function() {
                    expect(targetCalculator.cacheGroup).toHaveBeenCalledWith(mergedGroup);
                });

                it("uncaches the original group", function() {
                    expect(targetCalculator.uncacheGroup).toHaveBeenCalledWith(groupA);
                });
            });
        });

        describe("when pipeEmpty is called", function() {

            var getCacheSpy;

            beforeEach(function() {
                getCacheSpy = spyOn(targetCalculator, 'getCachedGroupContainingFullPipe');
                spyOn(targetCalculator, 'uncacheGroup');
            });

            it("gets the cached group containing the full pipe", function() {
                targetCalculator.pipeEmpty(pipes[0]);
                expect(getCacheSpy).toHaveBeenCalledWith(pipes[0]);
            });

            describe("and there is a cached group", function() {

                beforeEach(function() {
                    getCacheSpy.and.returnValue('A');
                });

                it("uncaches the returned group", function() {
                    targetCalculator.pipeEmpty(pipes[0]);
                    expect(targetCalculator.uncacheGroup).toHaveBeenCalledWith('A');
                });
            });

            describe("and there is no cached group", function() {

                it("does not call uncacheGroup", function() {
                    targetCalculator.pipeEmpty(pipes[0]);
                    expect(targetCalculator.uncacheGroup).not.toHaveBeenCalled();
                });
            });
        });
    });
});