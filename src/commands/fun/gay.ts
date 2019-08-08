import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewGayResult} from "../../models/gayResult";
import RPGTools from "../../tools/rpg/RPGTools";
import replace from "../../tools/replace";

const sendGayResult = (args: CommandArgs, mentionedUser: any, gayResult: any) => {
    const contents =
        replace(args.strings.gay.gayResultTarget,
            [mentionedUser,
                gayResult.gay]);

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
    FindOrCreateNewGayResult(targetUser.id)
        .then((gayResult) => {
            console.log(gayResult);
            // Display old result if the cooldown threshold has not been met
            if ((args.timeNow - gayResult.lastUpdate) < 86400) {
                sendGayResult(args, targetUser, gayResult);
                throw new Error('Gay test cooldown not met');
            }

            if (!gayResult.gay) {
                gayResult.gay = RPGTools.GetRandomIntegerFrom(10);
            } else {
                const random = RPGTools.GetRandomIntegerFrom(20);
                if (RPGTools.GetRandomIntegerFrom(2) === 1) {
                    gayResult.gay += random;
                } else {
                    gayResult.gay -= random;
                }
            }

            gayResult.lastUpdate = args.timeNow;
            return Promise.all([gayResult.save(), sendGayResult(args, targetUser, gayResult)])
        })
        .catch((err) => {
            console.log(err.toString());
        })

};

export const action = gay;