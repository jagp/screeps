var ROLES = [ 'defender', 'healer', 'miner', 'courier', 'harvester', 'upgrader', 'builder', 'repairer', 'rampartRepairer', 'wallRepairer', ];

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
        if (  Memory.colony.rooms[name].hasOwnProperty('sources') && Memory.colony.rooms[name].sources != [] ) {
            sourceList = Memory.colony.rooms[name].sources;

            //Now check if each source has the available spots in memory
            var harvestingSpots = {};
            for (let source in sourceList) {
                //console.log('test');
                //console.log(Memory.colony.rooms[name].sources[source].hasOwnProperty('harvestingSpots'));
                if (  Memory.colony.rooms[name].sources[source].hasOwnProperty('harvestingSpots') && Memory.colony.rooms[name].sources[source].harvestingSpots != {} ) {
                    harvestingSpots = Memory.colony.rooms[name].sources[source].harvestingSpots;
                }
                else {
                    console.log('test');
                    // Have each spawn find its own available harvesting spots
                    harvestingSpots.push( source.registerHarvestingSpots() );
                }

            }


        }
        else {

            // Collect info on the source's available Harvesting spots and add it to the model
            for (let roomName in Game.rooms[name].find(FIND_SOURCES) ) {
                sourceList[ sources[roomName].id ] = { };
            }
        }

        //harvestingSpots should be an array of open square ids

        var spotsList = {};


        roomList[name] = {
            energyAvailable : Game.rooms[name].energyAvailable,
            sources : sourceList
        };

    }
    Memory.colony.rooms = roomList;


    /* -------------------- CONDITIONS ---------------------- */
    // Flags and simple status variables to track important events experienced by the colony


};