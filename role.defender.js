var settings = require('settings');
const HOME = 'W31S17';

/* Defender should:
------------------
Monitor for hostile creeps
Alert hostile creep presence
Ranged Attack if in rampart
Melee attack if not stationed in rampart
    move to closest open rampart then stay there
    keep track of which rampart it's stationed in

No carry / no harvest


*/

module.exports = {
    run : function(creep) {

        if ( ( creep.memory.manualAttack != undefined ) && ( creep.memory.manualAttack != false ) ) {

            //console.log( creep.memory.manualAttack  );
            var flag = Game.flags[creep.memory.manualAttack];
            console.log( flag  );
            //var creep = Game.creeps[name];

            // try to get within 3 spaces of the flag
            if ( creep.pos.inRangeTo( flag, 3 ) ) {
                creep.memory.manualAttack = false;
                this.attack( creep );
            }
            else {
                creep.moveTo( flag );
            }

        }
        else {

            if ( creep.hits < 300 ) {
                creep.moveTo( Game.flags['Flag1']);
            }
            if (creep.room == HOME )  {
                //this.attackSafely( creep );
                this.attack( creep );
            }
            else {
                this.attack( creep );
            }

        }

    },

    attack : function( tar ) {
        tar.say('KILL!');

        var target = tar.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined ) {
            if (  tar.rangedAttack(target) == ERR_NOT_IN_RANGE ) { tar.moveTo(target); }
        }
        else if ( tar.rangedAttack( tar.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES) ) == ERR_NOT_IN_RANGE ) {
            tar.moveTo(target);
        }
        else {
            tar.say('RECYCLCIDE!');
            tar.recyclicide();
        }
    },
    attackSafely : function ( creep ) {

        var target = tar.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if (target != undefined ) {
            //If we're in a rampart, stay there
            creep.pos.findInRange

            //Else move to a new rampart in range of an attack (if possible)

            //creep.pos.

            if (  tar.rangedAttack(target) == ERR_NOT_IN_RANGE ) { tar.moveTo(target); }
        }
        else if ( target = tar.rangedAttack( tar.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES) ) == ERR_NOT_IN_RANGE ) {
            tar.moveTo(target);
        }
        else {
            tar.say('RECYCLCIDE!');
            tar.recyclicide();
        }
    },

    attackFlag : function ( creep, flagName ) {
        Game.creeps[creep].memory.manualAttack = flagName;
    },

    moveToflag : function (flag) { creep.moveTo(flag); }

}