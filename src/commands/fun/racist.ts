import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewFunResult} from "../../models/funResult";
import RPGTools from "../../tools/rpg/RPGTools";
import replace from "../../tools/replace";


const sendResultMessage = (user: any, racism: number, args: CommandArgs) =>{
    let resultString =  replace(args.strings.racist.result_base,
        [
            user,
            racism
        ]);

    if(racism <= 0){
        resultString += `\n${args.strings.racist.result_low}`
    } else if (racism <= 100){
        resultString += `\n${args.strings.racist.result_medium}`
    } else if (racism <= 250){
        resultString += `\n${args.strings.racist.result_high}`
    } else if (racism <= 500){
        resultString += `\n${args.strings.racist.result_veryhigh}`
    } else if (racism <= 750){
        resultString += `\n${args.strings.racist.result_ultrahigh}`
    } else if (racism <= 1000){
        resultString += `\n${args.strings.racist.result_brandon}`
    }

    return args.sendOKEmbed({
        contents: resultString,
        thumbnail: user.avatarURL()
    })
};

const racist = (args: CommandArgs) => {
    // let targetUser = args.bot.getFirstMentionedUserID(args.message);
    // !targetUser ? targetUser = args.message.author : null;

    let targetUser = args.bot.getFirstMentionedUserID(args.message) || args.message.author;

    let funRes = null;
    FindOrCreateNewFunResult(targetUser.id)
        .then((res) => {
            funRes = res;

            if ((args.timeNow - funRes.racist.lastUpdate) < 86400) {
                console.log(`Time left for racist cooldown for user ${targetUser.username}:
                ${args.timeNow - funRes.racist.lastUpdate}`);
                return sendResultMessage(targetUser, funRes.racist.value, args);
            }

            const racism = Math.floor( RPGTools.GetRandomFloatRange(-100, 1000));
            funRes.racist.value = racism;
            funRes.racist.lastUpdate = args.timeNow;


            return Promise.all([funRes.save(), sendResultMessage(targetUser, funRes.racist.value, args)])
        })

};

export const action = racist;