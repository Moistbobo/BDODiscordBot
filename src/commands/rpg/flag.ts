import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import {FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";

const flag = (args: CommandArgs) => {

    IsChannelRPGEnabled(args.message.guild.id, args.message.channel.id)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }

            return Promise.all([FindOrCreateNewRPGCharacter(args.user.id), FindOrCreateRPGTimer(args.user.id)])
        })
        .then((res) => {
            const char = res[0];
            const timer = res[1];
            const now = Date.now() / 1000;

            const timeLeft = Math.floor(now - timer.lastAttack);
            if (char.pvpFlagged) {
                if ((timeLeft) > Timers.rpg.unFlagTimer) {
                    // Player is flagged and meets the time requirement to unflag
                    char.pvpFlagged = false;
                    args.sendOKEmbed({contents: replace(args.strings.flag.unflagged, [args.user.username])});
                } else {
                    args.sendErrorEmbed({contents: replace(args.strings.flag.unflagCDError, [args.user.username, Timers.rpg.unFlagTimer - timeLeft])})
                }
            } else {
                char.pvpFlagged = true;
                args.sendOKEmbed({contents: replace(args.strings.flag.flagged, [args.user.username])});
            }

            return char.save();
        })
};

export const action = flag;
