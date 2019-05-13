import Dectalk from "../tools/dectalk";
import Command from "../classes/Command";
import CommandArgs from "../classes/CommandArgs";

const tts = (args: CommandArgs) =>{
    const voiceChannel = args.message.member.voiceChannel;

    if(voiceChannel){
        voiceChannel.join().then(connection =>{
            Dectalk(args.message.content, args.message.guild.id).then(res=>{
                console.log('playing sound');
                args.bot.voiceSessions[args.message.guild.id] = voiceChannel;
                // args.bot.client.voiceChannel.playFile(`./${args.message.guild.id}.wav`);
                const dispatcher = connection.playFile(`./dectalk/${args.message.guild.id}.wav`);
            });

        })
    }else{
        args.message.channel.send('You need to be in a voice channel to use this command');
    }


};

export const action = tts;