var settings = require('settings');
var DEBUG = true;

module.exports = {

        run: function(creep) {

            //console.log( "Transferring energy with response: " + creep.transfer( Game.getObjectById('5781e7b07cc9b30b2f70836c'), RESOURCE_ENERGY) );
            creep.transfer( Game.getObjectById('5781e7b07cc9b30b2f70836c'), RESOURCE_ENERGY);
            //creep.transfer( Game.getObjectById('5782b8f5b692eba23515cc40'), RESOURCE_ENERGY);
            creep.transfer( Game.getObjectById('5785fc2d7f3097507366979b'), RESOURCE_ENERGY);
            creep.transfer( Game.getObjectById('5785f7f8fad8f4b36536acf7'), RESOURCE_ENERGY);
            creep.transfer( Game.getObjectById('5785cb205512557f2dba6917'), RESOURCE_ENERGY);


            var targetPos = undefined;
            var targetStorageUnit = creep.room.storage;
            var targetSource = Game.getObjectById('576a9bde57110ab231d8818b');
            var targetStorageUnit = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == 'storage' } );

            // Load the miner's target position from memory
            if (  creep.memory.targetPos ) {
                targetPos = creep.memory.targetPos;
            }
            if (  creep.memory.targetSource ) {
                targetSource = Game.getObjectById(creep.memory.targetSource );
            }
            if (  creep.memory.targetStorageUnit ) {
                targetStorageUnit = creep.memory.targetStorageUnit;
            }

            if ( targetPos == undefined ) {
                // If we couldn't load one, set one based on our model in Memory
                for ( let roomName in Memory.colony.rooms) {

                    var room = Memory.colony.rooms[roomName];
                    for ( let sourcesName in room ) {

                        var sources = room[sourcesName];
                        for ( let sourceId in sources ) {

                            var source = sources[sourceId];

                            if ( source.harvestingSpots != [] ) {
                                //var targetPos = source.harvestingSpots.pop();
                                //Memory.creeps[creep].targetSource = targetId;

                                if ( Memory.colony.testing == true || Memory.colony.testing == undefined ) {
                                    creep.memory.targetPos = { x: 4, y: 20 } ;
                                    creep.memory.targetSource = '576a9bde57110ab231d8818b';
                                    Memory.colony.testing = false;
                                }
                                else {
                                    creep.memory.targetPos = { x: 21, y: 45 } ;
                                    creep.memory.targetSource = '576a9bde57110ab231d8818d';
                                    Memory.colony.testing = true;
                                }
                            }

                            if ( creep.memory.targetPos ) { if ( DEBUG ) { /*console.log( 'Miner found its target source. Breaking out of target scquiring loop. SourceId: ' + sourceId );*/ } break; }
                        }
                        if ( creep.memory.targetPos ) { break; }
                    }
                    if ( creep.memory.targetPos ) { break; }
                }
            }

            if ( targetPos != undefined ) {
                // if we have located a position for the miner to go to

                if ( creep.pos.isEqualTo(targetPos.x, targetPos.y) ) {

                    if( targetSource ) {

                        creep.harvest(targetSource);
                        //console.log('test');
                        creep.moveTo(targetSource);
                        //console.log('harvest serror: ' + err);

                    }

                }
                else {
                    creep.moveTo(targetPos.x, targetPos.y);
                }
            }
            else {
                // We still couldn't locate a source for the miner to harvest from
                creep.say('No Source :(' );
            }

        }

};