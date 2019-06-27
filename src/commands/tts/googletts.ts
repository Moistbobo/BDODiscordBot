import CommandArgs from "../../classes/CommandArgs";

const googletts = (args: CommandArgs) => {
    if (!args.message.member.hasPermission("MANAGE_GUILD")) {
        args.message.channel.send('You need more permissions to use this command');
        return;
    }
    if(args.message.guild.id !== '159467701113192448' &&
        args.message.guild.id !== '333037240970117120' ){
        args.message.channel.send('This command costs money so it will only work in the Chocord');
        return;
    }
    const voiceChannel = args.message.member.voice.channel;
    if (voiceChannel) {
        const textToSpeech = require('@google-cloud/text-to-speech');
        console.log(textToSpeech);

        const ttsclient = new textToSpeech.TextToSpeechClient();
        const text = args.message.content;
        const serverID = args.message.guild.id;
        const language = args.message.content.split(' ')[1];

        console.log(args.message.content.split(' '));
        let lang: string;

        console.log('language:', language);
        if (language.length > 5 || !language.includes('-')) {
            lang = 'en-AU';
        } else {
            lang = language;
        }
        const request = {
            input: {text: text.replace(lang, '')},
            // Select the language and SSML Voice Gender (optional)
            voice: {languageCode: lang, ssmlGender: 'MALE'},
            // Select the type of audio encoding
            audioConfig: {audioEncoding: 'LINEAR16'},
        };

        // Performs the Text-to-Speech request

        // Write the binary audio content to a local file

        ttsclient.synthesizeSpeech(request).then(res => {
            const util = require('util');
            const fs = require('fs');
            const [audio] = res;
            const writeFile = util.promisify(fs.writeFile);
            return writeFile(`./gtts/${serverID}.wav`, audio.audioContent, 'binary');
        }).then(res => {
            console.log(`Audio content written to file:./gtts/${serverID}.wav`);
            args.bot.voiceSessions[args.message.guild.id] = voiceChannel;
            return voiceChannel.join();
        }).then(connection => {
            console.log('Speaking now');
            connection.play(`./gtts/${serverID}.wav`);
        })
    } else {
        args.message.channel.send('You need to be in a voice channel to use this command');
    }
};

export const action = googletts;