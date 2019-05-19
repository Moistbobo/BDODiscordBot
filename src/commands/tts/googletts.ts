import CommandArgs from "../../classes/CommandArgs";

const invalidCharacters = ['"','|','<','>','?','/','\\','*'];

const googletts = (args: CommandArgs) => {
    if (!args.message.member.hasPermission("MANAGE_GUILD")) {
        args.message.channel.send('You need more permissions to use this command');
        return;
    }

    if (args.bot.config.gtts_enabled_guilds.indexOf(args.message.guild.id) === -1) {
        args.message.channel.send('This command costs money so it will only work in the Chocord');
        return;
    }


    try {
        const voiceChannel = args.message.member.voice.channel;
        if (voiceChannel) {
            const textToSpeech = require('@google-cloud/text-to-speech');
            console.log(textToSpeech);

            const ttsclient = new textToSpeech.TextToSpeechClient();
            let text = args.message.content;
            const language = args.message.content.split(' ')[1];
            const fs = require('fs');
            const serverID = args.message.guild.id;

            console.log(args.message.content.split(' '));
            let lang: string;

            console.log('language:', language);
            if (language.length > 5 || !language.includes('-')) {
                lang = 'en-AU';
            } else {
                lang = language;
            }
            text = text.replace(lang, '').trim();

            let ttsFilePath ='';

            if(invalidCharacters.some(x=> text.includes(x))){
                ttsFilePath = `./gtts/${serverID}/${lang}-%TEXTTHATISFULLOFBADCHARACTERSTHATWILLDESTROYTHEWORLD%.mp3`;
            }else{
                ttsFilePath = `./gtts/${serverID}/${lang}-${text}.mp3`;
            }

            fs.stat(ttsFilePath, (err, stats) => {
                err ? console.error(err) : null;
                if (stats !== undefined) {
                    args.bot.voiceSessions[args.message.guild.id] = voiceChannel;
                    voiceChannel.join().then((connection) => {
                        console.log('Playing cached voice video');
                        connection.play(ttsFilePath);
                        return;
                    });
                } else {
                    const request = {
                        input: {text: text.replace(lang, '').trim()},
                        // Select the language and SSML Voice Gender (optional)
                        voice: {languageCode: lang, ssmlGender: 'MALE'},
                        // Select the type of audio encoding
                        audioConfig: {audioEncoding: 'MP3'},
                    };

                    console.log('Synthesizing google tts');
                    ttsclient.synthesizeSpeech(request).then(res => {
                        console.log('Attempting to write text to speech');
                        const [audio] = res;
                        const util = require('util');
                        // Check if directories exist and create them if they don't
                        !fs.existsSync(`./gtts`) ? fs.mkdirSync(`./gtts`) : null;
                        !fs.existsSync(`./gtts/${serverID}`) ? fs.mkdirSync(`./gtts/${serverID}`) : null;
                        const writeFile = util.promisify(fs.writeFile);
                        return writeFile(ttsFilePath, audio.audioContent, 'binary');
                    }).then(res => {
                        console.log(`Audio content written to file:${ttsFilePath}`);
                        args.bot.voiceSessions[args.message.guild.id] = voiceChannel;
                        return voiceChannel.join();
                    }).then(connection => {
                        console.log('Speaking now');
                        connection.play(ttsFilePath);
                    })
                }
                return;
            });
        } else {
            args.message.channel.send('You need to be in a voice channel to use this command');
        }
    } catch (err) {
        console.error(err);
    }

};

export const action = googletts;