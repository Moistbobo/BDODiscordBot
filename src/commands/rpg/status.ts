import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter, {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import {FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";


const status = (args: CommandArgs) => {

    let userIDToSearch = args.message.author.id;
    let user = args.message.author;
    if (args.message.content) {
        user = args.bot.getFirstMentionedUserID(args.message);
        userIDToSearch = user.id;
    }

    args.startTyping();

    IsChannelRPGEnabled(args)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }
            return Promise.all([FindOrCreateNewRPGCharacter(userIDToSearch), FindOrCreateRPGTimer(userIDToSearch)])
        })
        .then((res) => {
            const rpgCharacter = res[0];
            const rpgTimer = res[1];
            const isAFK = (Date.now() / 1000 - rpgTimer.lastActivity) > Timers.rpg.afkTimer;
            console.log(isAFK);

            const contents = replace(args.strings.status.statusString, [
                    user.username,
                    rpgCharacter.hitpoints.current,
                    rpgCharacter.hitpoints.max,
                    rpgCharacter.kills,
                    rpgCharacter.deaths,
                    rpgCharacter.stats.str.toFixed(3),
                    rpgCharacter.stats.crit.toFixed(2),
                    rpgCharacter.stats.critDmgMult.toFixed(2),
                    rpgCharacter.stats.bal.toFixed(2),
                    rpgCharacter.stats.int.toFixed(3),
                    isAFK ? 'Yes' : 'No',
                    rpgCharacter.monsterKills
                ]
            );
            args.sendOKEmbed({contents});
        })
        .catch((err) => {
            console.log(err.toString());
        })
        .finally(() => {
            args.stopTyping();
        })
};

export const action = status;
