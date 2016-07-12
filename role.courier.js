var settings = require('settings');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        //console.log('test');

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
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN && s.energy != s.energyCapacity )
                            || ( s.structureType == STRUCTURE_EXTENSION && s.energy != s.energyCapacity )
                            || ( s.structureType == STRUCTURE_TOWER && s.energy != s.energyCapacity )

            });

            // if we found one
            if (structure != undefined) {

                //try to transfer energy,
                if ( ( err = creep.transfer(structure, RESOURCE_ENERGY ) ) == ERR_FULL ) {

                    var err2 = creep.transfer(structure);
                    console.log('Errpr in role.courierer, re: energy transfer type. structre=' + structure);

                }
                else {
                    //if it is not in range to transfer, move closer
                    creep.moveTo( structure );
                }
            }
            //otherwise try the storage units
            else {
                // find closest storage unit
                structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) =>  ( s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)
                                    || ( s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0)
                });
                if ( ( err = creep.transfer(structure, RESOURCE_ENERGY ) ) == ERR_FULL ) {
                    creep.moveTo( structure );
                    if (structure == undefined) { console.log('Error in role.courier - could not find a structure to deposit to.'); }
                }
            }
        }

        // working = false; creep needs to harvest energy
        else if ( creep.memory.working == false) {

            var harvestingTarget = undefined;
            var harvestingTargetId = creep.memory.targetSource;

            if ( harvestingTargetId != undefined ) {
                harvestingTarget = Game.getObjectById(harvestingTargetId);
            }
            else {
                harvestingTarget = creep.pos.findClosestByPath( FIND_SOURCES, { filter: (s) => s.energy > 0 })
            }

            if ( harvestingTarget != undefined ) {

                //if creep is not within 3 range of targetSource
                if ( ! creep.pos.inRangeTo( harvestingTarget, 3)  ) {
                    //then move closer
                    creep.moveTo(harvestingTarget);
                    //console.log('Creep moving closer to target Source');
                }
                else {
                //creep is within range of targetSource

                    //ignore the targetSource and do a normal search of transferrable structures in the area
                    targetContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) =>( ( s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0)
                                    || ( s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0) )
                                    && ( s.pos.inRangeTo( creep.pos, 6) )
                    });

                    if ( targetContainer != undefined ) {
                        //console.log(targetContainer.id);
                        if ( ( err = targetContainer.transfer(creep, RESOURCE_ENERGY) ) == ERR_NOT_IN_RANGE) {
                            //console.log(err);
                            creep.moveTo(targetContainer);
                        }
                        else {//(err != OK)


                        }
                    }
                    else {
                    //Cannot find any preferred sources to harvest from, use fallbacks

                        if ( Memory.colony.condition != 'invasion' ) {
                        //dont look for dropped energy during an attacl (the npc's drop energy as a lure)
                            //console.log('Courier cannot find a energy pickup point and will now look for dropped energy.');
                            var droppedEnergyTarget = creep.pos.findClosestByPath( FIND_DROPPED_ENERGY );

                            if (  droppedEnergyTarget != undefined ) {

                                if (creep.pickup(droppedEnergyTarget) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(droppedEnergyTarget);
                                }
                            }
                        }



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


        } /* end looking for energy algo */

        else {
            console.log( 'a courier creep does not have a T/Fworking state set');
        }
    }
};