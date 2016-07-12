var settings = require('settings');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {


        // if creep is bringing energy to a structure but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0 ) {
            // switch state
            creep.memory.working = false;
            if ( settings.DEBUG ) { console.log( creep.name + ' has finished Storing Energy (out of energy), and is returning to source.' ); }
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            if ( settings.DEBUG ) { console.log( creep.name + ' is at full energy, and is beginning to Store it.' ); }
        }

        // if creep is supposed to transfer energy to a structure
        if (creep.memory.working == true) {
            // find closest spawn, extension or tower which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION
                             || s.structureType == STRUCTURE_TOWER)
                             && s.energy < s.energyCapacity
            });

            // if we found one
            if (structure != undefined) {
                // try to transfer energy, if it is not in range
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
        }

        // if creep is supposed to harvest energy from source, ie looking for energy
        else {

            //console.log('Retrieving dropped energy');
            // harvest from its targetSource, if one exists
            var target = creep.memory.targetSource;

            if ( false ) {
                //console.log( 'targetSource found in harvester pathing controller' + target);
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
                if ( false && target != undefined && target != {} ) {

                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if ( true || settings.INDIRECT_HARVESTING ) {

                    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => ( s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)
                                    || ( s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0)
                    });
                    //console.log(target);

                    if ( target != undefined ) {
                        if ( target.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            //this is going to be problematic when miners are deployed to all available spots
                            creep.moveTo(target);
                        }
                    }
                    else {
                        // Could not find a container with energy available
                        //console.log('test');
                        target = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (s) => s.energy > 0 });
                        if ( target != undefined ) {
                            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo( target );
                            }
                        }

                    }

                }


            }
        } /* end looking for energy algo */
    }
};