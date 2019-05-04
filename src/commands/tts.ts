import callDecTalk from "../tools/callDecTalk";

const tts = (args) =>{
    const voiceChannel = args.message.member.voiceChannel;

    if(voiceChannel){
        voiceChannel.join().then(connection =>{
            callDecTalk(args.message.content, args.message.guild.id).then(res=>{
                console.log('playing sound');
                // args.bot.client.voiceChannel.playFile(`./${args.message.guild.id}.wav`);
                const dispatcher = connection.playFile(`./${args.message.guild.id}.wav`);
            });

        })
    }else{
        args.message.channel.send('You need to be in a voice channel to use this command');
    }


};

export const action = tts;