// Meta
var DEBUG = true;

// Colony Conditions
var INDIRECT_HARVESTING = true;

// Colony geographical data
const HOME = 'W31S17';
const SOURCEONE = '576a9bde57110ab231d8818b';
var SOURCE_HARVESTER_RATIO = { HOME: .5 }

// Spawning settings
var AUTOSPAWN_AT_ENERGY = Math.ceil( Game.spawns.Spawn1.room.energyCapacityAvailable, 700);
var DEFAULT_SPAWN_ROLE = 'upgrader';
//var spawnEnergy = 500;

// setup some minimum numbers for different roles
var minimumNumberOfDefenders = 0;
var maximumNumberOfDefenders = 3;
var minimumNumberOfHealers = 0;
var maximumNumberOfHealers = 2;
var minimumNumberOfHarvesters = 0;
var maximumNumberOfHarvesters = 0;
var minimumNumberOfMiners = 2;
var maximumNumberOfMiners = 2;
var minimumNumberOfCouriers = 3;
var maximumNumberOfCouriers = 4;
var minimumNumberOfUpgraders = 1;
var maximumNumberOfUpgraders = 6;
var minimumNumberOfBuilders = 1;
var maximumNumberOfBuilders = 2;
var minimumNumberOfRepairers = 1;
var maximumNumberOfRepairers = 2;
var minimumNumberOfWallRepairers = 1;
var maximumNumberOfWallRepairers = 2;
var minimumNumberOfRampartRepairers = 0;
var maximumNumberOfRampartRepairers = 0;

if ( Memory.colony.condition === 'invasion' ) {
    console.log( 'Invasion? ' + Memory.colony.condition  )
    //console.log('Invasion Detected');

    DEFAULT_SPAWN_ROLE = 'upgrader';
    AUTOSPAWN_AT_ENERGY = Game.spawns.Spawn1.room.energyCapacityAvailable * .5;

    minimumNumberOfDefenders = 3;
    maximumNumberOfDefenders = 12;
    minimumNumberOfHealers = 1;
    maximumNumberOfHealers = 3;
    /*
    minimumNumberOfHarvesters = 0;
    maximumNumberOfHarvesters = 0;
    minimumNumberOfMiners = 1;
    maximumNumberOfMiners = 1;
    minimumNumberOfCouriers = 1;
    maximumNumberOfCouriers = 2;
    minimumNumberOfUpgraders = 1;
    maximumNumberOfUpgraders = 0;
    minimumNumberOfBuilders = 1;
    maximumNumberOfBuilders = 0;
    minimumNumberOfRepairers = 1;
    maximumNumberOfRepairers = 0;
    minimumNumberOfWallRepairers = 1;
    maximumNumberOfWallRepairers = 1;
    minimumNumberOfRampartRepairers = 1;
    maximumNumberOfRampartRepairers = 1;
    */

}

module.exports = function(  ) {


   /* -------- Spawn Module -------- */
    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfDefenders = _.sum(Game.creeps, (c) => c.memory.role == 'defender');
    var numberOfHealers = _.sum(Game.creeps, (c) => c.memory.role == 'healer');
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
    var numberOfCouriers = _.sum(Game.creeps, (c) => c.memory.role == 'courier');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
    var numberOfRampartRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'rampartRepairer');

    var energy = AUTOSPAWN_AT_ENERGY;

    var name = undefined;
    var role = undefined;

    if ( Game.spawns.Spawn1.canCreateCreep( [WORK, WORK, WORK, WORK, WORK, WORK, WORK] ) == OK ) {
        console.log('Inside spawnController main loop; energy=' + energy);

        if (numberOfMiners < minimumNumberOfMiners) {  name = Game.spawns.Spawn1.createCustomCreep(energy, 'fullTimeMiner'); role = 'miner'; }
        else if (numberOfDefenders < minimumNumberOfDefenders && numberOfDefenders < maximumNumberOfDefenders) {name = Game.spawns.Spawn1.createCustomCreep(energy, 'defender'); role = 'defender';}
        else if (numberOfHealers < minimumNumberOfHealers && numberOfHealers < maximumNumberOfHealers) {name = Game.spawns.Spawn1.createCustomCreep(energy, 'healer'); role = 'healer';}

        else if (numberOfCouriers < minimumNumberOfCouriers && numberOfCouriers < maximumNumberOfCouriers) {
            //console.log('trying to spawn a courier at 700+ energy');
            var ratio = .4, //SOURCE_HARVESTER_RATIO['W31S17'];
                seed = Math.random(),
                sourceId = undefined,
                sourceIdList = [];

            for (id in Memory.colony.rooms['W31S17'].sources) {
                sourceIdList.push(id);
            }

            //todo: clean this up to apply to n elements of SOURCE_HARVESTER_RATIO instead of just 2 and deal with rooms
            if ( seed > ratio ) {
                // assign option 1
                sourceId = sourceIdList[1];
            }
            else {
                // assign option 2
                sourceId = sourceIdList[0];

            }

            // try to spawn one
            name = Game.spawns.Spawn1.createCustomCreep(energy, 'courier', sourceId);
            role = 'courier';

            if ( ( ! name < 0) && DEBUG ) {
                console.log( /*'Courier spawned with targetSource = ' + sourceId + 'as the random gen was: ' + seed + ' and the ratio breakpoint is: ' + SOURCE_HARVESTER_RATIO['W31S17'] */ );
            }

        }

        /*-- Minimum Creep Spawn checks-- */
        else if (numberOfHarvesters < minimumNumberOfHarvesters) {  name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester'); role = 'harvester'; }
        else if (numberOfBuilders < minimumNumberOfBuilders) {  name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder'); role = 'builder'; }
        else if (numberOfRampartRepairers < minimumNumberOfRampartRepairers) {name = Game.spawns.Spawn1.createCustomCreep(energy, 'rampartRepairer'); role = 'rampartRepairer';}
        else if (numberOfWallRepairers < minimumNumberOfWallRepairers) { name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer'); role = 'wallRepairer';}
        else if (numberOfRepairers < minimumNumberOfRepairers) {  name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer'); role = 'repairer';}
        else if (numberOfUpgraders < minimumNumberOfUpgraders) { console.log('in upgraders min count check in cpontroller '); name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader'); role = 'upgrader';}

        /*-- Maximum Creep Spawn checks-- */
        else if (numberOfMiners < maximumNumberOfMiners) { name = Game.spawns.Spawn1.createCustomCreep(energy, 'miner');  role = 'miner';}
        else if (numberOfBuilders < maximumNumberOfBuilders) {  name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');  role = 'builder';}
        else if (numberOfRampartRepairers < maximumNumberOfRampartRepairers) { name = Game.spawns.Spawn1.createCustomCreep(energy, 'rampartRepairer'); role='rampartRepairer'; }
        else if (numberOfUpgraders < maximumNumberOfUpgraders) {  console.log('in upgraders max count check in cpontroller '); name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');  role = 'upgrader'; }
        else if (numberOfWallRepairers < maximumNumberOfWallRepairers) {  name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');  role = 'wallRepairer';}
        else if (numberOfRepairers < maximumNumberOfRepairers) { name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer'); role='repairer'; }
        else if (numberOfHarvesters < maximumNumberOfHarvesters) { name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester'); role = 'harvester'; }

    }
    else {
    // Could not produce a 700 energy creep:
    //console.log('could not produce a standard creep');

        if ( numberOfMiners == 0 && numberOfCouriers == 0 && numberOfHarvesters == 0) {
            // If colony is nearing collapse, spawn general-purpose harvester
            name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
            role = 'havester';
        }
        else if ( numberOfMiners == 0 ) {  name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'partTimeMiner'); role = 'Part-time Miner'; }
        else if ( numberOfCouriers == 0 ) {
            //console.log( 'trying to spawn at the could not produce 700 energy creep brance');
            //name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'courier'); role = 'courier';

            var ratio = 1, //SOURCE_HARVESTER_RATIO['W31S17'];
                seed = Math.random(),
                sourceId = undefined,
                sourceIdList = [];

            for (id in Memory.colony.rooms['W31S17'].sources) {
                sourceIdList.push(id);
            }

            //todo: clean this up to apply to n elements of SOURCE_HARVESTER_RATIO instead of just 2 and deal with rooms
            if ( seed > ratio ) {
                // assign option 1
                sourceId = sourceIdList[0];
            }
            else {
                // assign option 2
                sourceId = sourceIdList[1];
            }

            // try to spawn one
            name = Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'courier', sourceId);
            role = 'courier';

            if ( ( ! name < 0) && DEBUG ) {
                console.log( /*'Courier spawned with targetSource = ' + sourceId + 'as the random gen was: ' + seed + ' and the ratio breakpoint is: ' + SOURCE_HARVESTER_RATIO['W31S17'] */ );
            }


        }

    }

    // print name to console if spawning was a success
    if ( (name != undefined) && !(name < 0)) {

        console.log("Spawned new creep: " + name + ' (' + role + ')' );
    }

};