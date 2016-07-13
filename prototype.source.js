const DEBUG = false;

var ROLES = [ 'miner', 'harvester', 'upgrader', 'builder', 'repairer', 'rampartRepairer', 'wallRepairer', ];
const HOME = 'W31S17';
const SOURCEONE = '576a9bde57110ab231d8818b';

module.exports = function() {

    Source.prototype.minerName = '';//

    Source.prototype.setMinerName = function( name ) { this.minerName = name; }
    Source.prototype.getMinerName = function() { return this.minerName; }

    //array of pos of open harvesting spots
    Source.prototype.harvestingSpots = {};

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


            for ( var xMod = -1; xMod <= 1; xMod++) {

                candidate.x = origin.x + xMod;

                for ( var yMod = -1; yMod <= 1; yMod++) {

                    candidate.y = origin.y + yMod;

                    //Store the list of objects in the candidate
                    candidateObjects = Game.rooms[this.room.name].lookAt(candidate.x, candidate.y);

                    var blocked = undefined;
                    candidateObjects.forEach( function( obj ) {
                        if ( DEBUG ) { console.log( 'At : [' + candidate.x + ', ' + candidate.y + '] is a: ' + Object.getPrototypeOf( obj) ); }
//structure=source returns undefined
console.log( obj.type + ' ' + obj.terrain + ' ' + obj.structure );
                        if ( (obj.type == 'terrain' && obj.terrain == 'wall' )
                            || (obj.type == 'source') ) {
                            blocked = true;
                        }

                    });

                    // We have cycled through all the objects in the room, and now whats left is safe for our harvesters
                    if ( blocked == undefined ) {
                        emptyRooms.push( { x: candidate.x, y: candidate.y } );
                        console.log( 'blocked=' + blocked + ' so this point is being added to the list: ' + emptyRooms );
                    }

                }

            }

        return emptyRooms;
    };

    Source.prototype.getHarvestingSpots =
        function() {
            if ( this.harvestingSpots != undefined && this.harvestingSpots != {} ) {
                this.harvestingSpots = this.registerHarvestingSpots();
                return this.harvestingSpots;
            }
            else {
                return this.harvestingSpots;
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