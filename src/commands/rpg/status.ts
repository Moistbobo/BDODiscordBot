import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter, {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";


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
            args.sendOKEmbed({contents: `${user.username}'s RPG stats\n\nHP:${rpgCharacter.hitpoints.current}/${rpgCharacter.hitpoints.max}\n\nKills:${rpgCharacter.kills}\nDeaths:${rpgCharacter.deaths}`})
        })
        .catch((err)=>{
            console.log(err.toString());
        })
        .finally(()=>{
            args.stopTyping();
        })
};

export const action = status;
