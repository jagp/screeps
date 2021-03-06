module.exports = function() {


    // create a new function for StructureSpawn
    StructureSpawn.prototype.createCustomCreep =
        function(energy, bodyTypeName, source = '576a9bde57110ab231d8818d') {

            var body = [];
            var roleName;

            // Specialized body types
            if ( bodyTypeName == 'fullTimeMiner' ) {  //700
                roleName = 'miner';
                body = [ WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE ];
            }

            // Generalized, well-balanced body types
            else if ( bodyTypeName == 'partTimeMiner' ) {
                roleName = 'miner';
                var numberOfParts = Math.floor(energy / 200);
                for (let i = 0; i < numberOfParts; i++) {

                    body.push(WORK); // 100
                    body.push(CARRY); // 50
                    body.push(MOVE); // 50
                }
            }
            else if ( bodyTypeName == 'defender' ) {

                //Defenders:
                roleName = 'defender';
                var numberOfParts = Math.floor(energy / 200);
                for (let i = 0; i < numberOfParts; i++) {

                    body.push(RANGED_ATTACK); // 150
                    body.push(MOVE); // 50

                }

            }
            else if ( bodyTypeName == 'healer' ) {

                //Healers:
                roleName = 'healer';
                var numberOfParts = Math.floor(energy / 300);
                for (let i = 0; i < numberOfParts; i++) {

                    body.push(HEAL); // 250
                    body.push(MOVE); // 50

                }

            }
            else if ( bodyTypeName == 'upgrader' ) {

                //Upgraders:
                //console.log( 'inside body part constuctor, energy =' + energy);
                roleName = 'upgrader';
                var numberOfParts = Math.floor(energy / 200);
                //if (numberOfParts > 6) { numberOfParts = 6; }
                for (let i = 0; i < numberOfParts; i++) {

                    body.push(WORK); // 100
                    body.push(CARRY); // 50
                    body.push(MOVE); // 50

                }
                //body = [ WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE ];
                //console.log( 'inside body part constuctor, energy =' + energy);

            }
            else if ( bodyTypeName == 'courier' ) {

                roleName = 'courier';
                //var numberOfParts = Math.floor(energy / 100);
                var numberOfParts = Math.floor( ( energy * .5 ) / 100);
                for (let i = 0; i < numberOfParts; i++) {

                    body.push(CARRY); // 50
                    body.push(MOVE); // 50

                }

            }
            else {

                roleName = bodyTypeName;
                // Default Workers:
                var numberOfParts = Math.floor(energy / 250);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK); // 100
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY); // 50
                }
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(MOVE); // 50
                    body.push(MOVE); // 50
                }
            }

            // create creep with the created body and the given role
            if ( source ) {
                var createCreepResponse = this.createCreep(body, undefined, { role: roleName, working: false, targetSource: source });
                if ( createCreepResponse < 0 && createCreepResponse != ERR_NOT_ENOUGH_ENERGY && createCreepResponse != ERR_BUSY ) {
                    console.log( 'Creep-building failure in prototype.spawn, error: ' + createCreepResponse + ' role:' + roleName + ' targetSource=' + source  );
                }
                return createCreepResponse;
            }
            else {
                console.log( 'inside no-source clause');
                return this.createCreep(body, undefined, { role: roleName, working: false });
            }
    };

};