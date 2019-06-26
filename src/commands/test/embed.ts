import CommandArgs from '../../classes/CommandArgs';
import * as Discord from 'discord.js';
import * as Botconfig from '../../../src/config.json';

const embed = (args: CommandArgs) => {
    let embed = new Discord.MessageEmbed();
    embed.setColor(Botconfig.successMessageColor);
    embed.setTitle('This is the title text');
    embed.setDescription('This is the description text');
    embed.setAuthor('This is the author text');
    embed.setFooter('This is the footer text');
    embed.setURL('http://www.google.ca');

    args.message.channel.send(embed);
};

export const action = embed;