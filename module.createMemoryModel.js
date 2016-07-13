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
    var roomList = { };

    for (let name in Game.rooms) {

        // Collect info on the room's sources
        var sourceList = {};

        // Safely check if source is already stored in memory, and dont recalculate the list if it is
        if (  false && Memory.colony.rooms[name].hasOwnProperty('sources') && Memory.colony.rooms[name].sources != [] ) {
            sourceList = Memory.colony.rooms[name].sources;

            //Now check if each source has the available spots in memory
            var harvestingSpots = [];
            for (let source in sourceList) {
                //console.log('test');
                //console.log(Object.getOwnPropertyNames( Memory.colony.rooms[name].sources[source].harvestingSpots ));
                if (  Memory.colony.rooms[name].sources[source].hasOwnProperty('harvestingSpots') && Memory.colony.rooms[name].sources[source].harvestingSpots.length != 0 ) {
                    //console.log('Harvesting Spots loaded from memory');
                    harvestingSpots = Memory.colony.rooms[name].sources[source].harvestingSpots;

                }
                else {
                //HarvestingSpots list has not yet been created

                    console.log('Creating harvestingSpots list for new source');

                    // Have each spawn find its own available harvesting spots
                    //harvestingSpots.push( source.registerHarvestingSpots( ) );
                    sourceObj = Game.getObjectById( source );
                    //console.log( sourceObj.registerHarvestingSpots() );
                    harvestingSpots = sourceObj.registerHarvestingSpots();
                }

                sourceList[source].harvestingSpots = harvestingSpots;

                sourceList = { '576a9bde57110ab231d8818d' : 'harvestingSpots', '576a9bde57110ab231d8818b': 'harvestingSpots'  };

            }


        }
        else {

            // Collect info on the source's available Harvesting spots and add it to the model


                var room = Game.rooms[name];
                var sourcesFound = room.find(FIND_SOURCES);
                console.log( typeof(sourcesFound));
                //sourcesFound.foreach( function(source) { sourceList[source] = {  } } );
                //sourceList = { '576a9bde57110ab231d8818d' : {'harvestingSpots' : {} }, '576a9bde57110ab231d8818b': {'harvestingSpots' : {} } };
                //ourceList = sourcesFound;
        }

        //harvestingSpots should be an array of open square ids

        roomList[name] = {
            energyAvailable : Game.rooms[name].energyAvailable,
            sources : sourceList
        };

    }
    Memory.colony.rooms = roomList;


    /* -------------------- CONDITIONS ---------------------- */
    // Flags and simple status variables to track important events experienced by the colony


};