import CommandArgs from "../classes/CommandArgs";

const leave = (args: CommandArgs) =>{
    const guildID = args.message.guild.id;
    if(args.bot.voiceSessions[guildID]){
        args.bot.voiceSessions[guildID].leave();
        args.bot.voiceSessions[guildID] = null;
    }
};

export const action = leave;
