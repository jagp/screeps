/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.activateCreeps');
 * mod.thing == 'a thing'; // true
 */
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();
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

var census = require('module.censusTaker');

module.exports = function() {

    // for every creep name in Game.creeps, cause them to perform their roles
    // todo: this should be handled with an elegant loop taking in the array of role names
    for (let name in Game.creeps) {

        // get the creep object
        var creep = Game.creeps[name];

        // if creep is harvester, call harvester script, and so on
        if (creep.memory.role == 'harvester') { roleHarvester.run(creep); }
        else if (creep.memory.role == 'defender') { roleDefender.run(creep); }
        else if (creep.memory.role == 'healer') { roleHealer.run(creep); }
        else if (creep.memory.role == 'miner') { roleMiner.run(creep); }
        else if (creep.memory.role == 'courier') { roleCourier.run(creep); }
        else if (creep.memory.role == 'upgrader') { roleUpgrader.run(creep); }
        else if (creep.memory.role == 'builder') { roleBuilder.run(creep); }
        else if (creep.memory.role == 'repairer') { roleRepairer.run(creep); }
        else if (creep.memory.role == 'wallRepairer') { roleWallRepairer.run(creep);  }
        else if (creep.memory.role == 'rampartRepairer') { roleRampartRepairer.run(creep); }
    }

};