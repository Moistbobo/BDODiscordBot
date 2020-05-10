import CommandArgs from "../../classes/CommandArgs";
import GTTSChannel from "../../models/gttsChannel";

const googletts = (args: CommandArgs) => {
    const voiceChannel = args.message.member.voice.channel;
    const serverID = args.message.guild.id;

    const hardCodedServerIds = ['159467701113192448','676333485471825938'];

    if(!hardCodedServerIds.includes(serverID)){
        return args.sendErrorEmbed({contents: 'Google tts is not enabled for this server.'})
    }

    if (!args.message.content || args.message.content.split(' ').length < 1) {
        return args.sendErrorEmbed({contents: 'You need to specify some text to speak'});
    } else if (!voiceChannel) {
        return args.sendErrorEmbed({contents: 'You need to be in a voice channel to use this command'});
    }

    checkGTTSChannel(serverID)
        .then((gttsChannel) => {
            if (!gttsChannel) {
                return args.sendErrorEmbed({contents: 'No gtts channel specified on server'});
            }else if(gttsChannel.channelID !== args.message.channel.id){
                console.log(gttsChannel.channelID, args.message.channel.id);
                return args.sendErrorEmbed({contents:'This channel is not gtts enabled'});
            }
            googlettsMainFunction(args, voiceChannel, serverID);
        })
        .catch((err) => {
            console.log(err);
        });
};

/**
 * Generate TTS using google cloud services
 * @param lang
 * @param text
 */
const makeTTSRequest = (lang: string, text: string, ssmlVoiceGender?: string): Promise<any> => {
    const googleTTS = require('@google-cloud/text-to-speech');
    const ttsClient = new googleTTS.TextToSpeechClient();
    const request = {
        input: {text: text.replace(lang, '')},
        voice: {languageCode: lang, ssmlGender: ssmlVoiceGender || 'MALE'},
        audioConfig: {audioEncoding: 'LINEAR16'}
    };
    return ttsClient.synthesizeSpeech(request);
};

/**
 * Make /gtts directory to store tts files if it doesn't exist
 */
const makeGTTSFolderIfNotExist = () => {
    const fs = require('fs');
    if (!fs.existsSync('./gtts')) {
        fs.mkdirSync('./gtts');
    }
};

/**
 * Write audio byte array received from google cloud services into a file
 * @param ttsByteArray
 * @param serverID
 */
const writeTTSBinaryToWAV = (ttsByteArray: any, serverID: string): Promise<any> => {
    const util = require('util');
    const fs = require('fs');
    const [audio] = ttsByteArray;
    const writeFile = util.promisify(fs.writeFile);
    return writeFile(`./gtts/${serverID}.wav`, audio.audioContent, 'binary');
};

const checkGTTSChannel = (serverID: string) => {
    return GTTSChannel.findOne({serverID});
};

const googlettsMainFunction = (args: CommandArgs, voiceChannel: any, serverID: string, gender?: string) => {
    const language = args.message.content.split(' ')[0];

    let lang: string;

    let ssmlGender = 'F'?'FEMALE':'MALE';

    if (language.length > 5 || !language.includes('-')) {
        // Use australian english as default voice because it sounds cool
        lang = 'en-US';
    } else {
        lang = language;
    }

    makeGTTSFolderIfNotExist();
    makeTTSRequest(lang, args.message.content).then(res => {
        return writeTTSBinaryToWAV(res, serverID);
    }).then(() => {
        console.log(`Audio content written to file:./gtts/${serverID}.wav`);
        args.bot.voiceSessions[args.message.guild.id] = voiceChannel;
        return voiceChannel.join();
    }).then(connection => {
        console.log('Speaking now');
        connection.play(`./gtts/${serverID}.wav`);
    }).catch((err) => {
        console.log('Something went wrong generating tts');
        console.log(err);
    })
};

export const action = googletts;
