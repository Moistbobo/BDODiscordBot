import CommandArgs from "../../classes/CommandArgs";
import GTTSChannel from "../../models/gttsChannel";

const createNewGTTSChannel = (serverID: string, channelID: string) => {
    const newGTTSChannel = new GTTSChannel({
        serverID,
        channelID
    });

    newGTTSChannel.save()
        .then(() => {
            return true;
        })
        .catch((err) => {
            console.log(err);
            return false;
        })
};

const updateGTTSChannel = (serverID: string, channelID: string) => {
    GTTSChannel.findOne({serverID})
        .then((gttsChannel)=>{
            gttsChannel.channelID = channelID
            gttsChannel.save();
        })
        .catch((err)=>{
            console.log(err);
        })
};

const setChannel = (args: CommandArgs) => {

    if (!args.message.member.hasPermission("MANAGE_GUILD")) {
        args.sendErrorEmbed({contents:'You need the `MANAGE GUILD` permission to use this command'});
        return;
    }

    const serverID = args.message.guild.id;
    const channelID = args.message.channel.id;

    GTTSChannel.findOne({serverID: serverID})
        .then((gttsChannel) => {
            if (!gttsChannel) {
                createNewGTTSChannel(serverID, channelID);
                args.sendOKEmbed({contents: 'Google TTS channel successfully set'});
            }else{
                updateGTTSChannel(serverID, channelID);
                args.sendOKEmbed({contents: 'Google TTS channel successfully updated'});
            }
        });

};

export const action = setChannel;