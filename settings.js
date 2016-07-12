/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('settings');
 * mod.thing == 'a thing'; // true
 */



module.exports = function() {

    var ROLES = [ 'upgrader', 'harvester', 'builder', 'wallRepairer', 'repairer' ];

    var SOURCE_HARVESTER_RATIO = {
        'W31S17' : { 0: '66', 1: '34' }

    };

    var INDIRECT_HARVESTING = true;

    var DEBUG = true;

};