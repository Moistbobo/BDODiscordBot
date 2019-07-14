import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateRPGServerStats} from "../../models/rpg/RPGServerStats";

const enableItemDrops = (args: CommandArgs) =>{
    const channelID = args.message.channel.id;

    FindOrCreateRPGServerStats(args.message.guild.id)
        .then((rpgServerStats)=>{
            if (rpgServerStats.itemDropChannels.includes(channelID)) {
                rpgServerStats.itemDropChannels = rpgServerStats.itemDropChannels.filter((x) => x != channelID);
                args.sendErrorEmbed({contents: args.strings.enableitemdrops.channelRemoved});

            } else {
                rpgServerStats.itemDropChannels.push(channelID);
                args.sendOKEmbed({contents: args.strings.enableitemdrops.channelSet});
            }

            return rpgServerStats.save();
        })
};

export const action = enableItemDrops;
