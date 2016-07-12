var roleBuilder = require('role.repairer');
var settings = require('settings');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to repair something but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
            if ( settings.DEBUG ) { console.log( creep.name + ' has finished Repairing (out of energy), and is returning to a source.' ); }
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            if ( settings.DEBUG ) { console.log( creep.name + ' is at full energy, and is beginning to Repair.' ); }
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // Begin searching for a target to work on

            var target = undefined;

            // Prioritize ramparts above everything else, and loop with increasing percentages
            for (let percentage = 0.01; percentage <= 1; percentage = percentage + 0.01){
            // find a wall with less than percentage hits
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_RAMPART) &&
                                    (s.hits / s.hitsMax) < percentage
                });

                if (target != undefined) {
                    // break the loop
                    break;
                }
            }


            // excluding walls because they have way too many max hits and would keep
            // our repairers busy forever. We have to find a solution for that later.
            if (! target ) { target  = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.hits < s.hitsMax) && (s.structureType != STRUCTURE_WALL)
                });
            }

            // if we find one
            if (target != undefined) {
                // try to repair it, if it is out of range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(target);
                }

                /* Now, make sure the creep isn't occupying a position creeps can harvest from
                closestSource = creep.pos.findInRange( FIND_SOURCES );
                if ( creep.pos.inRangeTo(closestSource, 2 ) ) {
                    console.log ('Repairing too clsoe to a Source - repositioning.');
                    var randomDirection = Math.int(rand(0,3));
                    console.log('moving this direction: ' + trandomDirection);
                }           */
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
                else if ( settings.INDIRECT_HARVESTING ) {

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
                else if ( ! settings.INDIRECT_HARVESTING ) {
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