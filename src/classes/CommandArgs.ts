import * as Discord from 'discord.js';
import Bot from "./Bot";
interface CommandArgs{
    bot: Bot;
    strings: any;
    message: Discord.Message;
    send: any;
    sendOKEmbed: any;
    sendErrorEmbed: any;
    startTyping: any,
    stopTyping: any,
    user: Discord.User,
    timeNow: number
};

export default CommandArgs;
