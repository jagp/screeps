// import modules
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();
var invasionController = require('module.invasionController');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleCourier = require('role.courier');
var roleWallRepairer = require('role.wallRepairer');
var roleRampartRepairer = require('role.rampartRepairer');
var roleDefender = require('role.defender');
var roleHealer = require('role.healer');

// Meta
var DEBUG = true;

// Colony Conditions
var INDIRECT_HARVESTING = true;

// Colony geographical data
const HOME = 'W31S17';
const SOURCEONE = '576a9bde57110ab231d8818b';
var SOURCE_HARVESTER_RATIO = { HOME: .8 }

// Spawning settings
var AUTOSPAWN_AT_ENERGY = Game.spawns.Spawn1.room.energyCapacityAvailable;
var DEFAULT_SPAWN_ROLE = 'upgrader';
//var spawnEnergy = 500;

var settings = require('settings');

module.exports.loop = function () {



    //Locator:
    announceRoles( 'defender' );

    invasionController.run();

    // Memory Model
    require('module.createMemoryModel')();

    // Acticate Creep Actions
    require('module.activateCreeps')();

    // Activate Towers
    require('module.activateTowers')();

    // Spawn Creeps
    require('module.spawnController')();

};

function announceRoles( targetRole = undefined ) {

    for ( let creep in Game.creeps ){
        role = Game.creeps[creep].memory.role;

        if ( targetRole ) {
            if ( role == targetRole )  {
                Game.creeps[creep].announce( );
            }
        }
        else {

            Game.creeps[creep].announce(role);
        }

    }

}
    function makeOneOfEach ( creepsList, unwantedRole, numberToMake ) {
        var rolesList = ROLES;
        for (i = 0; i < numberToMake; i++) {
            for ( name in creepsList ) {
                creep = creepsList[name];
                if ( creep.memory.role == unwantedRole ) {
                    var newRole = rolesList.pop();
                    console.log('New Role is: ' + newRole);
                    creep.memory.role = newRole;
                    numberToMake--;
                }
            }
        }

    };