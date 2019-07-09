import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateRPGServerStats} from "../../models/rpg/RPGServerStats";

const setrpgchannel = (args: CommandArgs) => {
    const channelID = args.message.channel.id;

    if (!args.message.member.hasPermission("MANAGE_GUILD")) {
        return args.sendErrorEmbed({contents:args.strings.general.noPermission});
    }

    FindOrCreateRPGServerStats(args.message.guild.id)
        .then((rpgServerStats) => {
            if (rpgServerStats.rpgChannels.includes(channelID)) {
                rpgServerStats.rpgChannels = rpgServerStats.rpgChannels.filter((x) => x != channelID);
                args.sendErrorEmbed({contents: args.strings.setrpgchannel.channelRemoved});

            } else {
                rpgServerStats.rpgChannels.push(channelID);
                args.sendOKEmbed({contents: args.strings.setrpgchannel.channelSet});
            }

            return rpgServerStats.save();
        })
};

export const action = setrpgchannel;
