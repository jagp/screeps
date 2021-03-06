var ROLES = [ 'defender', 'healer', 'miner', 'courier', 'harvester', 'upgrader', 'builder', 'repairer', 'rampartRepairer', 'wallRepairer', ];

//var require('prototype.source');

module.exports = function() {




    /* ---------------------- UPKEEP ---------------------- */
     // Handles pruning obsolete data from colony Memory model

    // Clean out obsolete memory entries
    //check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }



    /* -------------------- CENSUS ---------------------- */
    // Collect census info on the colony, in the census object (creeps per role)

    //Form the census object
    var census = {};

    for ( let censusRole in ROLES ) {
        census[ROLES[censusRole]] = 0;
    }

    // Create the model in census
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

        //And store its role in census
        for ( let countingRole in ROLES ) {
            roleName = ROLES[countingRole];
            if (creep.memory.role == roleName ) { census[roleName] = census[roleName] + 1; };
        }
    }
    //Record the model we just created to memory
    Memory.colony.census = census;


    /* -------------------- ROOMS ---------------------- */
    /* Collect info on the rooms */


    if (false && Memory.colony.hasOwnProperty('rooms') && Memory.colony.hasOwnProperty('rooms') != {} ) {
    //if roomsList is in memory, use it
        //roomsList = Memory.colony.rooms;
        //roomsList = Memory.colony.rooms;
        //roomsList = Game.rooms; //{ 'W31S17' : {} }
    }
    else {
        //Build the rooms property
        Memory.colony.rooms = {};

        for (let name in Game.rooms) {
            var room = Game.rooms[name];
            Memory.colony.rooms[name] = { } ;


            // Collect info on the room's sources
            var sourceList = {};
            // Safely check if source list is already stored in memory, and dont recalculate the list if it is
            if ( Memory.colony.rooms[name].hasOwnProperty('sources') && Memory.colony.rooms[name].sources != [] ) {
                sourceList = Memory.colony.rooms[name].sources;
            }
            else {
                // Form sourceList
                    var sourcesFound = room.find(FIND_SOURCES);
                    sourcesFound.forEach( function(source) { sourceList[source.id] = {  } } );
            }

            //Now check if each source has the available spots in memory
            var harvestingSpots = [];
            for (let sourceId in sourceList) {
                //console.log(sourceId);
                var source = Game.getObjectById( sourceId );

                //get harvestingSpots
                if (  source.hasOwnProperty('harvestingSpots') && source.harvestingSpots.length != 0 ) {
                    //from memory
                    harvestingSpots = source.harvestingSpots;
                }
                else {
                    //or, form harvestingSpots list

                    // Have each spawn find its own available harvesting spots
                    sourceObj = Game.getObjectById( sourceId );
                    harvestingSpots = sourceObj.getHarvestingSpots();
                }

                sourceList[sourceId].harvestingSpots = harvestingSpots;

            }

            Memory.colony.rooms[name] = {
                energyAvailable : Game.rooms[name].energyAvailable,
                sources : sourceList
            };

        }
    }




    /*
    else {
    // otherwise, form roomsList

        for (let name in Game.rooms) {
            var room = Game.rooms[name];

            // Collect info on the room's sources
            var sourceList = {};
            // Safely check if source list is already stored in memory, and dont recalculate the list if it is
            if ( Memory.colony.rooms[name].hasOwnProperty('sources') && Memory.colony.rooms[name].sources != [] ) {
                sourceList = Memory.colony.rooms[name].sources;
            }
            else {
                // Form sourceList
                    var sourcesFound = room.find(FIND_SOURCES);
                    sourcesFound.forEach( function(source) { sourceList[source.id] = {  } } );
            }

            //Now check if each source has the available spots in memory
            var harvestingSpots = [];
            for (let sourceId in sourceList) {
                //console.log(sourceId);
                var source = Game.getObjectById( sourceId );

                //get harvestingSpots
                if (  source.hasOwnProperty('harvestingSpots') && source.harvestingSpots.length != 0 ) {
                    //from memory
                    harvestingSpots = source.harvestingSpots;
                }
                else {
                    //or, form harvestingSpots list

                    // Have each spawn find its own available harvesting spots
                    sourceObj = Game.getObjectById( sourceId );
                    harvestingSpots = sourceObj.getHarvestingSpots();
                }

                sourceList[sourceId].harvestingSpots = harvestingSpots;

                //sourceList = { '576a9bde57110ab231d8818d' : 'harvestingSpots', '576a9bde57110ab231d8818b': 'harvestingSpots'  };
            }


            //harvestingSpots should be an array of open square ids

            roomsList[name] = {
                energyAvailable : Game.rooms[name].energyAvailable,
                sources : sourceList
            };
            console.log('Rooms list: ' + roomsList);
        }

    } //roomsList is now formed
    */



    /* -------------------- CONDITIONS ---------------------- */
    // Flags and simple status variables to track important events experienced by the colony


};