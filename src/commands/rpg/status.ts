import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter, {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";


const status = (args: CommandArgs) => {

    let userIDToSearch = args.message.author.id;
    let user = args.message.author;
    if (args.message.content) {
        user = args.bot.getFirstMentionedUserID(args.message);
        userIDToSearch = user.id;
    }

    args.startTyping();
    FindOrCreateNewRPGCharacter(userIDToSearch)
        .then((rpgCharacter) => {
            const contents = replace(args.strings.status.statusString, [user.username,
                rpgCharacter.hitpoints.current,
                rpgCharacter.hitpoints.max,
                rpgCharacter.kills,
                rpgCharacter.deaths,
                rpgCharacter.stats.str,
                rpgCharacter.stats.crit,
                rpgCharacter.stats.critDmgMult]);
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