import CommandArgs from "../../classes/CommandArgs";
import GTTSChannel from "../../models/gttsChannel";

const getGTTSChannel = (serverID: string) => {
    return GTTSChannel.findOne({serverID});
};

const checkTTSChannel = (args: CommandArgs) => {
    getGTTSChannel(args.message.guild.id)
        .then((gttsChannel)=>{
            if(!gttsChannel){
                return args.sendErrorEmbed({contents:'gtts channel not specified for this server'});
            }
            const gttsEnabledChannel = args.bot.client.channels.get(gttsChannel.channelID);
            args.sendOKEmbed({contents:`The gtts channel of this server is:\n${gttsEnabledChannel}`})
        });
};

export const action = checkTTSChannel;