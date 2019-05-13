import CommandArgs from "../classes/CommandArgs";

const leave = (args: CommandArgs) =>{
    const guildID = args.message.guild.id;
    console.log('leave');
    if(args.bot.voiceSessions[guildID]){
        args.bot.voiceSessions[guildID].leave().then(res=>{
            console.log('[LEAVE COMMAND] left voice channel')
        });
    }
};

export const action = leave;
