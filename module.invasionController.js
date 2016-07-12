/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('module.invasionController');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    run :
        function () {
            // Condition check: Hostiles
            if ( Game.spawns.Spawn1.pos.findClosestByRange(FIND_HOSTILE_CREEPS) ) {
                this.prepareForBattle();
                Memory.colony.condition = 'invasion';
            }
            else {
                Memory.colony.condition = 'OK';
                this.returnToNormal();
            }
        },

    returnToNormal :
        function() {

        },

    prepareForBattle :
        function () {

            for ( let name in Game.creeps ) {
                creep = Game.creeps[name];

                /*
                if ( creep.memory.role == 'courier' || creep.memory.role == 'upgrader'  ) {
                    creep.memory.role = 'harvester';
                }
                */
            }
        }



};