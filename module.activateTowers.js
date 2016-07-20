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
var TOWER_RAMPART_REPAIR_PERCENT = .005;
var TOWER_ROAD_REPAIR_PERCENT = .25;

module.exports = function() {

    //todo rework this declaration to be room-agnostic
    var towers = Game.rooms.W31S17.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });

    for (let tower of towers) {

        var target = undefined;

        // Determine if there are hostile targets in range of the tower's pos
        if ( Memory.colony.condition == 'invasion' ) {

            target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, { filter: (c) => c.hits < c.hitsMax })

            if (target != undefined) {
                //1st priority: If we found a hostile target, attack it
                tower.attack(target);
                if ( DEBUG ) { console.log('Tower is attacking.'); }
            }

            // 2nd priority: Attempt to heal narby creeps
            var damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS,
                { filter: (c) => c.hits < c.hitsMax }
            );
            if (damagedCreep != undefined) {
                var err = tower.heal(damagedCreep);
                if ( DEBUG ) { console.log('Tower is healing: ' + damagedCreep + ' with status: ' + err); Game.notify( 'Tower is healing.'); }
            }

        }

        else if ( tower.room.energyAvailable > 0 ) {

            // Only perform these actions when the room has a high energy level

            var damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS,
                { filter: (c) => c.hits < c.hitsMax }
            );
            if (damagedCreep != undefined) {
                var err = tower.heal(damagedCreep);
                if ( DEBUG ) { console.log('Tower is healing: ' + damagedCreep + ' with status: ' + err); Game.notify( 'Tower is healing.'); }
            }
            else {
                console.log('Inside Tower activation energy threshold condition');
                // 3rd priority: Attempt to repair anything (except walls) below TOWER_REPAIR_PERCENT hp (default 3%)
                var damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) =>
                            (s.structureType != ( STRUCTURE_WALL) && (s.hits < (s.hitsMax * TOWER_REPAIR_PERCENT) ) )
                        ||  (s.structureType == STRUCTURE_ROAD && (s.hits < s.hitsMax * TOWER_ROAD_REPAIR_PERCENT ) )
                        ||  (s.structureType == STRUCTURE_RAMPART && (s.hits < s.hitsMax * TOWER_RAMPART_REPAIR_PERCENT ) )

                });
                if (damagedStructure != undefined) {
                    var err = tower.repair(damagedStructure);
                    if ( DEBUG ) { console.log('Tower is repairing with status: ' + err); }
                }

            }
        }

    } /* for Towers loop */


};