/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('activateTowers');
 * mod.thing == 'a thing'; // true
 */
var DEBUG = false;
var TOWER_REPAIR_PERCENT = .03;

module.exports = function() {

    //todo rework this declaration to be room-agnostic
    var towers = Game.rooms.W31S17.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    if ( Game.spawns.Spawn1.room.energyAvailable > Game.spawns.Spawn1.room.energyCapacityAvailable * .5)  {
        for (let tower of towers) {

            var target = undefined;

            // Determine if there are hostile targets in range of the tower's pos
            if ( Memory.colony.condition == 'invasion' ) {
                target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (c) => c.hits < c.hitsMax })
            }

            if (target != undefined) {
                //1st priority: If we found a hostile target, attack it
                tower.attack(target);
                if ( DEBUG ) { console.log('Tower is attacking.'); }
            }
            else {
                // 2nd priority: Attempt to heal narby creeps
                var damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS,
                    { filter: (c) => c.hits < c.hitsMax }
                );
                if (damagedCreep != undefined) {
                    var err = tower.heal(damagedCreep);
                    if ( DEBUG ) { console.log('Tower is healing: ' + damagedCreep + ' with status: ' + err); Game.notify( 'Tower is healing.'); }
                }
                else {
                    // 3rd priority: Attempt to repair anything (except walls) below OWER_REPAIR_PERCENT hp (default 3%)
                    var damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => (s.hits < (s.hitsMax * TOWER_REPAIR_PERCENT) ) && (s.structureType != STRUCTURE_WALL)
                    });
                    if (damagedStructure != undefined) {
                        var err = tower.repair(damagedStructure);
                        if ( DEBUG ) { console.log('Tower is repairing with status: ' + err); }
                    }

                }
            }
        }
    }

};