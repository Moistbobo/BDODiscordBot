import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";

const sendAttackedNotification = (args: CommandArgs) => {
    const strings = args.strings.sendattackednotification;

    FindOrCreateNewRPGCharacter(args.message.author.id)
        .then((rpgCharacer)=>{
            rpgCharacer.sendAttackedNotification = !rpgCharacer.sendAttackedNotification;

            if(rpgCharacer.sendAttackedNotification){
                args.sendOKEmbed({contents:replace(strings.enabled, [args.user.username])});
            }else{
                args.sendOKEmbed({contents:replace(strings.disabled, [args.user.username])})
            }

            return rpgCharacer.save();
        })
};

export const action = sendAttackedNotification;
