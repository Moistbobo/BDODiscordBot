import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter, {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";


const status = (args: CommandArgs) => {

    let userIDToSearch = args.message.author.id;
    let user = args.message.author;
    if (args.message.content) {
        user = args.bot.getFirstMentionedUserID(args.message);
        userIDToSearch = user.id;
    }

    args.startTyping();

    IsChannelRPGEnabled(args.message.guild.id, args.message.channel.id)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }
            return FindOrCreateNewRPGCharacter(userIDToSearch)
        })
        .then((rpgCharacter) => {
            const contents = replace(args.strings.status.statusString, [user.username,
                rpgCharacter.hitpoints.current,
                rpgCharacter.hitpoints.max,
                rpgCharacter.kills,
                rpgCharacter.deaths,
                rpgCharacter.stats.str,
                rpgCharacter.stats.crit,
                rpgCharacter.stats.critDmgMult,
                rpgCharacter.stats.bal,
                rpgCharacter.stats.int]);
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
