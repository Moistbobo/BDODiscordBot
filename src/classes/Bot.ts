import * as Discord from 'discord.js'
import * as fs from 'fs';
import Command from "./Command";
import DatabaseTools from '../tools/DatabaseTools';
import * as BotConfig from '../config.json'

class Bot {
    strings: object;
    client: Discord.Client;
    commands: Command[];
    config: any;
    voiceSessions: any;

    constructor(prefix: string, token: string, config: any) {
        this.client = new Discord.Client();
        this.client.on('message', this.onMessage);
        this.client.on('error', this.onError);
        this.client.on('ready', this.onReady);
        this.client.on('guildCreate', this.onGuildCreate);
        this.strings = require('../resources/strings_en').Strings;
        this.client.login(token);
        this.voiceSessions = {};
        this.config = config;
    }

    // Init
    loadCommands = () => {
        const commandPath = './commands/';
        this.commands = [];
        const folderNames = fs.readdirSync(commandPath);
        folderNames.forEach((folder) => {
            const commandNames = fs.readdirSync(`${commandPath}${folder}/`);
            this.extractCommand(`${commandPath}${folder}/`, commandNames);
        });
    };

    extractCommand = (commandPath: String, commandNames: String[]) => {
        commandNames.forEach((cmd) => {

            const commandName = cmd.replace('.js', '');
            const stringResources = this.strings[commandName];

            if (stringResources !== undefined) {
                let command = new Command;
                command.action = require(`.${commandPath}${commandName}`).action;
                command.trigger = stringResources.trigger.split(',');
                command.description = stringResources.description;
                this.commands.push(command);
            } else {
                console.log('Check that the following command has strings for description, and trigger ', cmd);
            }
        })
    };

    // Utility functions
    createOKEmbed = (contents: string, title: any = null, footer: any = null, author: any = null, url: any = null)
        : Discord.MessageEmbed => {
        let embed = new Discord.MessageEmbed();
        embed.setColor(BotConfig.successMessageColor);
        embed.setFooter(footer);
        embed.setDescription(contents);
        embed.setAuthor(author);
        url ? embed.setURL(url) : null;

        return embed;
    };

    createErrorEmbed = (contents: string, footer: any) => {

    };

    // Listeners

    onReady = () => {
        this.loadCommands();
        console.log('Bot ready');
    };

    onError = (err) => {
        console.log('An error has occurred');
        console.log(err);
    };

    onMessage = (msg) => {
        // if(msg.author.id !== '184186982631473153'){
        //     return;
        // }
        const command = msg.content.substring(1).split(' ')[0];

        const cmd = this.commands.find((x) =>
            x.trigger.includes(command.toLowerCase())
        );

        msg.content = msg.content.substring(1 + command.toLowerCase().length);

        if (cmd) {
            const commandArgs = {
                bot: this,
                strings: this.strings,
                message: msg
            };
            if (cmd.hasOwnProperty('action')) {
                try {
                    cmd.action(commandArgs);
                } catch (exception) {
                    console.error(exception);
                }
            } else {
                console.log(command + ' is missing a command action');
            }
        }
    };

    onGuildCreate = (guild) => {
        console.log(guild);
        DatabaseTools.createNewServer(guild.id);
    }

}

export default Bot;