const DEBUG = true;

var ROLES = [ 'miner', 'harvester', 'upgrader', 'builder', 'repairer', 'rampartRepairer', 'wallRepairer', ];
const HOME = 'W31S17';
const SOURCEONE = '576a9bde57110ab231d8818b';

module.exports = function() {

    Source.prototype.test = 'yep!';

    //array of pos of open harvesting spots
    Source.prototype.harvestingSpots = [ '577ff859a2be76ed7c3f405d' ];

    // Give sources the ability to provide info about where they can be harvested from
    Source.prototype.registerHarvestingSpots =
        function() {

            //get coords for the adjacent 8 rooms
            var emptyRooms = [];
            var origin = {};
            var candidate = {};

            origin.x = this.pos.x;
            origin.y = this.pos.y;

            candidate.x = this.pos.x;
            candidate.y = this.pos.y;
            //var candidate = clone (this.pos );
            //var blockingTypes = OBSTACLE_OBJECT_TYPES;
            const MAP_GENERATED_OBJECT_OBSTACLE_TYPES =  [ {"terrain" : "wall"}, { "structure" : "source" } ]
            var blockingTypes = MAP_GENERATED_OBJECT_OBSTACLE_TYPES;

            if (DEBUG) { console.log( 'Beginning coords loop' ); }
            for ( var xMod = -1; xMod <= 1; xMod++) {

                candidate.x = origin.x + xMod;
                if (DEBUG) { console.log( 'In coords loop at x' ); }
                for ( var yMod = -1; yMod <= 1; yMod++) {

                    candidate.y = origin.y + yMod;
                    if (DEBUG) { console.log( 'In coords loop at y' ); }

                    //Store the list of objects in the candidate
                    candidateObjects = Game.rooms[this.room.name].lookAt(candidate.x, candidate.y);


                    candidateObjects.forEach( function( obj ) {
                        if ( DEBUG ) { console.log( 'At : [' + candidate.x + ', ' + candidate.y + '] is a: ' + Object.getPrototypeOf( obj) ); }

                        if ( (obj.type == 'terrain' && obj.terrain == 'wall' )
                            || (obj.type == 'structure' && obj.structure == 'source') ) {


                        }
                        else {
                            //if no objects matched blockingTypes
                            emptyRooms.push( { x: candidate.x, y: candidate.y } );
                            //var sourceId = Memory.colony.rooms[HOME].sources[SOURCEONE];
                            var sourceId = SOURCEONE;
                            //console.log(sourceId);
                            Game.getObjectById( sourceId).addHarvestingSpot( 'test' );
                        }

                    });

                }

            }

            // see if the room contains a blocking structure

            // if so, strip it from the list

            // assign the list to the internal property

            // update the model in memory also
        //Memory.colony.rooms[this.room.name].sources[this.id]
        console.log( emptyRooms );
        //emptyRooms = [ { x: 19, y: 45}, { x:20, y:45}, { x:21, y:45} ];
        return emptyRooms;
    };
    Source.prototype.getHarvestingSpots =
        function() {
            if ( this.harvestingSpots != undefined && this.harvestingSpots != {} ) {
                return this.harvestingSpots;
            }
            else {
                return false;
            }
    };
    Source.prototype.setHarvestingSpots =
        function( harvestingSpots ) {
            this.harvestingSpots = harvestingSpots;
    };

    // harvestingSpot should be the id of an open terrain square
    Source.prototype.addHarvestingSpot =
        function( harvestingSpot  ) {
            this.harvestingSpots.push( harvestingSpot );
    };


};