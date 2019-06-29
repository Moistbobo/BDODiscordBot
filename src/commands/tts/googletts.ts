import CommandArgs from "../../classes/CommandArgs";

/**
 * Generate TTS using google cloud services
 * @param lang
 * @param text
 */
const makeTTSRequest = (lang: string, text: string): Promise<any> => {
    const googleTTS = require('@google-cloud/text-to-speech');
    const ttsClient = new googleTTS.TextToSpeechClient();
    const request = {
        input: {text: text.replace(lang, '')},
        voice: {languageCode: lang, ssmlGender: 'MALE'},
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

const googletts = (args: CommandArgs) => {
    const voiceChannel = args.message.member.voice.channel;

    // Content is required to generate tts
    if (!args.message.content || args.message.content.split(' ').length < 1) {
        return args.sendErrorEmbed({contents: 'You need to specify some text to speak'});
    } else if (!voiceChannel) {
        return args.sendErrorEmbed({contents: 'You need to be in a voice channel to use this command'});
    }

    const language = args.message.content.split(' ')[1];

    let lang: string;
    if (language.length > 5 || !language.includes('-')) {
        // Use australian english as default voice because it sounds cool
        lang = 'en-AU';
    } else {
        lang = language;
    }

    const serverID = args.message.guild.id;
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