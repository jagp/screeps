var settings = require('settings');
var roleBuilder = require('role.repairer');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            /* find all walls in the room
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL
            });
            */

            var target = undefined;

            // loop with increasing percentages
            for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
                // find a wall with less than percentage hits
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_WALL &&
                                   s.hits / s.hitsMax < percentage
                });

                // if there is one
                if (target != undefined) {
                    // break the loop
                    break;
                }
            }

            // if we find a wall that has to be repaired
            if (target != undefined) {
                // try to repair it, if not in range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(target);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleRepairer.run(creep);
            }
        }

        // if creep is supposed to harvest energy from source, ie looking for energy
        else {

            //console.log('Retrieving dropped energy');
            // harvest from its targetSource, if one exists
            var target = creep.memory.targetSource;

            if ( false ) {
                console.log( 'targetSource found in harvester pathing controller' + target);
                var sources = creep.room.find(FIND_SOURCES, { filter: (s) => s.energy > 0 });
                //console.log(sources[0]);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    // move towards the source
                    creep.moveTo(sources[0]);
                }
            }
            else {
                target = {};
                var target = creep.pos.findClosestByPath( FIND_DROPPED_ENERGY );

                // or, find closest source
                if ( target != undefined && target != {} ) {

                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if ( true || settings.INDIRECT_HARVESTING ) {

                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => ( s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)
                                    || ( s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0)
                    });

                    if ( target != undefined ) {
                        if ( target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            //this is going to be problematic when miners are deployed to all available spots
                            creep.moveTo(target);
                        }
                    }

                }
                else if ( false && ! settings.INDIRECT_HARVESTING ) {
                    //console.log('test');
                    target = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (s) => s.energy > 0 });
                    if ( target != undefined ) {
                        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                            //this is going to be problematic when miners are deployed to all available spots
                            creep.moveTo( target );
                        }
                    }

                }

            }
        } /* end looking for energy algo */
    }
};