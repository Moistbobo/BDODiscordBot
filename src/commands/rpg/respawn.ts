import CommandArgs from "../../classes/CommandArgs";
import RPGTimer, {FindOrCreateRPGTimer, CheckCanRespawn} from "../../models/rpg/RPGTimer";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import Timers from "../../resources/Timers";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";

const canRespawn = (lastDeathTime: number) => {
    const now = Date.now() / 1000;
    return (now - lastDeathTime) > Timers.rpg.deathCD
}

const respawn = (args: CommandArgs) => {
    args.startTyping();
    let rpgTimer = null;
    let rpgCharacter = null;
    IsChannelRPGEnabled(args.message.guild.id, args.message.channel.id)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }
            return Promise.all([FindOrCreateNewRPGCharacter(args.message.author.id), FindOrCreateRPGTimer(args.message.author.id)])
        })
        .then((res) => {
            rpgCharacter = res[0];
            rpgTimer = res[1];

            if (!(rpgCharacter.hitpoints.current <= 0)) {
                args.sendErrorEmbed({contents: replace(args.strings.respawn.respawnFailedNotDead, [args.message.author.username])});
                throw new Error('User is not dead');
            }

            console.log('User is dead');

            if (!canRespawn(rpgTimer.lastDeath)) {
                const timeToRespawn = Date.now() / 1000 - rpgTimer.lastDeath;
                const contents = replace(args.strings.respawn.timeToRespawn, [args.message.author.username,
                    (Timers.rpg.deathCD - timeToRespawn).toFixed(0)]);
                args.sendErrorEmbed({contents});
                throw new Error('Respawn time not met');
            }

            return;
        })
        .then(() => {
            rpgCharacter.hitpoints.current = rpgCharacter.hitpoints.max;
            return rpgCharacter.save();
        })
        .then(() => {
            args.sendOKEmbed({contents: replace(args.strings.respawn.respawnSuccess, [args.message.author.username])});
        })
        .catch((err) => {
            console.log(err.toString());
        })
        .finally(() => {
            args.stopTyping();
        })
};

export const action = respawn;
