import Dectalk from "../../tools/dectalk";
import CommandArgs from "../../classes/CommandArgs";

/**
 * Make /tts directory to store tts files if it doesn't exist
 */
const makeTTSFolderIfNotExist = () => {
    const fs = require('fs');
    if (!fs.existsSync('./tts')) {
        fs.mkdirSync('./tts');
    }
};

const tts = (args: CommandArgs) => {
    const voiceChannel = args.message.member.voice.channel;

    if (!voiceChannel) {
        return args.send('You need to be in a voice channel to use this command');
    }

    makeTTSFolderIfNotExist();
    voiceChannel.join().then(connection => {
        Dectalk(args.message.content, args.message.guild.id).then(res => {
            args.bot.voiceSessions[args.message.guild.id] = voiceChannel;
            connection.play(`./tts/${args.message.guild.id}.wav`);
        });
    })

};

export const action = tts;