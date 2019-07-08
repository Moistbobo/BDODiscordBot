import CommandArgs from "../../classes/CommandArgs";
import RPGTimer, {FindOrCreateRPGTimer, CheckIsDead} from "../../models/rpg/RPGTimer";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import Timers from "../../resources/Timers";

const canRespawn = (lastDeathTime: number) => {
    const now = Date.now() / 1000;
    return (now - lastDeathTime) > Timers.rpg.deathCD
}

const respawn = (args: CommandArgs) => {
    args.startTyping();
    let rpgTimer = null;
    let rpgCharacter = null;
    Promise.all([FindOrCreateNewRPGCharacter(args.message.author.id), FindOrCreateRPGTimer(args.message.author.id)])
        .then((res) => {
            rpgCharacter = res[0];
            rpgTimer = res[1];

            if (!(rpgCharacter.hitpoints.current <= 0)) {
                args.sendErrorEmbed({contents: 'You are not dead.'});
                throw new Error('User is not dead');
            }

            console.log('User is dead');

            if (!canRespawn(rpgTimer.lastDeath)) {
                const timeToRespawn = Date.now() / 1000 - rpgTimer.lastDeath;
                args.sendErrorEmbed({contents: `${(Timers.rpg.deathCD - timeToRespawn).toFixed(0)} seconds until you can respawn`});
                throw new Error('Respawn time not met');
            }

            console.log('User can respawn');
            return;
        })
        .then(() => {
            rpgCharacter.hitpoints.current = rpgCharacter.hitpoints.max;
            return rpgCharacter.save();
        })
        .then(() => {
            args.sendOKEmbed({contents: 'You have successfully respawned'});
        })
        .catch((err) => {
            console.log(err.toString());
        })
        .finally(() => {
            args.stopTyping();
        })
};

export const action = respawn;
