import * as Discord from 'discord.js';
import Bot from "./Bot";
interface CommandArgs{
    bot: Bot;
    strings: any;
    message: Discord.Message
};

export default CommandArgs;