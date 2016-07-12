module.exports = function() {

    Creep.prototype.announce =
        function(msg = undefined) {

            if (! msg ) { msg = 'Ping!' }
            return this.say( msg );

    };

    Creep.prototype.recyclicide = function( ) {
        if ( Game.spawns.Spawn1.recycleCreep( this ) == ERR_NOT_IN_RANGE ) {
            this.moveTo(Game.spawns.Spawn1);

        }
    };

};