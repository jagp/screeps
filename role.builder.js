var roleUpgrader = require('role.upgrader');
var settings = require('settings');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
            if ( settings.DEBUG ) { console.log( creep.name + ' has finished Building (out of energy), and is returning to source.' ); }
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            if ( settings.DEBUG ) { console.log( creep.name + ' is at full energy, and is beginning to Build.' ); }

        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            // prioritize Towers
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_TOWER} );
            // then Extensions
            if (! constructionSite ) { constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER } ); }
            // then Ramparts
            if (! constructionSite ) { constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION } ); }
            // then Ramparts
            if (! constructionSite ) { constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_RAMPART } ); }
            // then Walls
            if (! constructionSite ) { constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (s) => s.structureType == STRUCTURE_WALL } ); }
            // above everything else
            if (! constructionSite ) { constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES); }

            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    creep.moveTo(constructionSite);
                }


            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                roleUpgrader.run(creep);
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
                if (  false && target != undefined && target != {} ) {

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
                    console.log('test2');
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