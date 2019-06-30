import CommandArgs from "../../classes/CommandArgs";
import GTTSChannel from "../../models/gttsChannel";

const checkGTTSChannel = (serverID) => {
    return GTTSChannel.findOne({serverID});
};

const leave = (args: CommandArgs) => {

    checkGTTSChannel(args.message.guild.id)
        .then((gttsChannel) => {
            if (gttsChannel.channelID !== args.message.channel.id) {
                return args.sendErrorEmbed({contents: 'This channel is not gtts enabled'});
            }
            else if(!gttsChannel){
                return args.sendErrorEmbed({contents:'tts channel not set for this server'});
            }

            const guildID = args.message.guild.id;

            if (args.bot.voiceSessions[guildID]) {
                args.bot.voiceSessions[guildID].leave();
                args.bot.voiceSessions[guildID] = null;
            }
        });
};

export const action = leave;
