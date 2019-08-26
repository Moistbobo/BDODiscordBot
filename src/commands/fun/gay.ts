import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewGayResult} from "../../models/gayResult";
import RPGTools from "../../tools/rpg/RPGTools";
import replace from "../../tools/replace";
import {FindOrCreateNewFunResult} from "../../models/funResult";

const sendGayResult = (args: CommandArgs, mentionedUser: any, gayResult: any) => {
    const contents =
        replace(args.strings.gay.gayResultTarget,
            [mentionedUser,
                gayResult.value]);

    return args.sendOKEmbed({
        contents,
        thumbnail: mentionedUser.avatarURL()
    });
};

const gay = (args: CommandArgs) => {
    let targetUser = null;
    let mentionedUser = args.bot.getFirstMentionedUserID(args.message);

    if (!mentionedUser) {
        targetUser = args.message.author;
    } else {
        targetUser = mentionedUser;
    }

    console.log(targetUser);
    FindOrCreateNewFunResult(targetUser.id)
        .then((res) => {
            let funRes = res.gay;
            // Display old result if the cooldown threshold has not been met
            if ((args.timeNow - funRes.lastUpdate) < 86400) {
                sendGayResult(args, targetUser, funRes);
                throw new Error('Gay test cooldown not met');
            }

            funRes.value = Math.floor(RPGTools.GetRandomFloatRange(-50, 1000));

            funRes.lastUpdate = args.timeNow;
            res.fun = funRes;
            return Promise.all([res.save(), sendGayResult(args, targetUser, funRes)])
        })
        .catch((err) => {
            console.log(err);
        })

};

export const action = gay;