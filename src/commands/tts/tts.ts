import Dectalk from "../../tools/dectalk";
import CommandArgs from "../../classes/CommandArgs";

const tts = (args: CommandArgs) =>{
    const voiceChannel = args.message.member.voice.channel;
    if(voiceChannel){
            voiceChannel.join().then(connection =>{
                Dectalk(args.message.content, args.message.guild.id).then(res=>{
                    args.bot.voiceSessions[args.message.guild.id] = voiceChannel;
                    connection.play(`./dectalk/${args.message.guild.id}.wav`);
                });
            })
    }else{
        args.message.channel.send('You need to be in a voice channel to use this command');
    }
};

export const action = tts;