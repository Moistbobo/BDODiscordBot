import * as Discord from 'discord.js'
import * as fs from 'fs';
import Command from "./Command";
import DatabaseTools from '../tools/DatabaseTools';
import * as BotConfig from '../config.json'
import EmbedArgs from '../classes/EmbedArgs';
import {FindOrCreateRPGTimer} from "../models/rpg/RPGTimer";
import ProcessOnMessageItemDrop from "../tools/events/onMessage/ProcessOnMessageItemDrop";
import RPGTools from "../tools/rpg/RPGTools";

class Bot {
    strings: object;
    client: Discord.Client;
    commands: Command[];
    config: any;
    voiceSessions: any;
    helpString: {};
    prefix: string;

    constructor(prefix: string, token: string, config: any) {
        this.client = new Discord.Client();
        this.helpString = {};
        this.setListeners();
        this.strings = require('../resources/strings_en').Strings;
        RPGTools.SetString(this.strings);
        this.voiceSessions = {};
        this.config = config;
        this.prefix = prefix;
        this.client.login(token).then(r => console.log('Bot logged in prefix:', this.prefix ));
        DatabaseTools.connectToMongoDB();
    }

    // Init
    setListeners = () => {
        this.client.on('message', this.onMessage);
        this.client.on('error', this.onError);
        this.client.on('ready', this.onReady);
        this.client.on('guildCreate', this.onGuildCreate);
    };

    loadCommands = () => {
        const commandPath = './commands/';
        this.commands = [];
        const folderNames = fs.readdirSync(commandPath);
        folderNames.forEach((folder) => {
            const commandNames = fs.readdirSync(`${commandPath}${folder}/`);
            this.extractCommand(`${commandPath}${folder}/`, commandNames);
        });
    };

    extractCommand = (commandPath: string, commandNames: string[]) => {
        commandNames.forEach((cmd) => {

            const commandName = cmd.replace('.js', '');
            const stringResources = this.strings[commandName];

            if (stringResources !== undefined) {
                let command = new Command;
                command.action = require(`.${commandPath}${commandName}`).action;
                command.trigger = stringResources.trigger.split(',');
                command.trigger = command.trigger.map((e) => {
                    e = e.trim();
                    // e = this.prefix+e;
                    return e;});
                try{
                    const examples = stringResources.usage.split(',');
                    command.exampleUsage = examples.map((e) =>
                    {
                        e = e.trim();
                        // e = this.prefix + e;
                        return e;
                    });
                } catch(err){
                    // console.log(err.toString());
                    console.log(`Command ${stringResources.name} does not have usage string. Ensure that this is inteded.`);
                }

                command.description = stringResources.description;
                command.name = stringResources.name;

                // Also build the help string here
                const helpobj = {
                    name: command.name,
                    description: command.description,
                    trigger: command.trigger
                };

                if (!this.helpString.hasOwnProperty(commandPath.split('/')[2])) {
                    this.helpString[commandPath.split('/')[2]] = {}
                }
                this.helpString[commandPath.split('/')[2]][commandName] = helpobj;

                this.commands.push(command);
            } else {
                if (!cmd.includes('js.map')) {
                    console.log('Check that the following command has strings for description, and trigger ', cmd);
                }
            }
        });
    };


    // Utility functions
    createOKEmbed = (args: EmbedArgs)
        : Discord.MessageEmbed => {
        let embed = new Discord.MessageEmbed();
        embed.setColor(BotConfig.successMessageColor);
        args.footer ? embed.setFooter(args.footer) : null;
        args.contents ? embed.setDescription(args.contents) : null;
        args.author ? embed.setAuthor(args.author) : null;
        args.url ? embed.setURL(args.url) : null;
        args.title ? embed.setTitle(args.title) : null;
        args.image ? embed.setImage(args.image) : null;
        args.thumbnail ? embed.setThumbnail(args.thumbnail) : null;
        if (args.extraFields) {
            args.extraFields.forEach((ef) => {
                if (ef.name === 'blank') {
                    embed.addBlankField(ef.inline);
                } else {
                    embed.addField(
                        ef.name || '',
                        ef.value || '',
                        ef.inline || false
                    )
                }
            })
        }
        return embed;
    };

    createErrorEmbed = (args: EmbedArgs)
        : Discord.MessageEmbed => {
        let embed = new Discord.MessageEmbed();
        embed.setColor(BotConfig.errorMessageColor);
        args.footer ? embed.setFooter(args.footer) : null;
        args.contents ? embed.setDescription(args.contents) : null;
        args.author ? embed.setAuthor(args.author) : null;
        args.url ? embed.setURL(args.url) : null;
        args.title ? embed.setTitle(args.title) : null;
        args.image ? embed.setImage(args.image) : null;
        args.thumbnail ? embed.setThumbnail(args.thumbnail) : null;
        if (args.extraFields) {
            args.extraFields.forEach((ef) => {
                if (ef.name === 'blank') {
                    embed.addBlankField(ef.inline);
                } else {
                    embed.addField(
                        ef.name || 'undefined',
                        ef.value || 'undefined',
                        ef.inline || false
                    )
                }
            })
        }
        return embed;
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

    onMessage = (msg: Discord.Message) => {

        // Update user's last activity for rpg use
        const userID = msg.author.id;
        if (userID === this.client.user.id) {
            return;
        }
        const commandArgs = {
            bot: this,
            strings: this.strings,
            message: msg,
            send: (content) => msg.channel.send(content),
            sendOKEmbed: (args) => msg.channel.send(this.createOKEmbed(args)),
            sendErrorEmbed: (args) => msg.channel.send(this.createErrorEmbed(args)),
            startTyping: () => msg.channel.startTyping(),
            stopTyping: () => msg.channel.stopTyping(),
            user: msg.author,
            timeNow: Date.now() / 1000
        };

        ProcessOnMessageItemDrop(commandArgs)
            .then(() => {
                // console.log('Dropped item');
            })
            .catch((err) => {
                // console.log(err.toString());
            });

        FindOrCreateRPGTimer(userID)
            .then((rpgTimer) => {
                rpgTimer.lastActivity = Date.now() / 1000;

                return rpgTimer.save();
            })
            .then(() => {
                // console.log('run command');
                if (msg.content[0] !== this.prefix) {
                    console.log(msg.content[0]);
                    return;
                }

                const command = msg.content.substring(1).split(' ')[0];


                const cmd = this.commands.find((x) =>
                    x.trigger.includes(command.toLowerCase())
                );
                if(cmd && cmd.name) console.log(`User ${msg.author.username} triggered command ${cmd.name}`);
                // Trim the command args off the message contents
                msg.content = msg.content.substring(1 + command.toLowerCase().length + 1);

                if (cmd) {

                    if (cmd.hasOwnProperty('action')) {
                        try {
                            cmd.action(commandArgs);
                        } catch (exception) {
                            console.log(exception);
                        }
                    } else {
                        console.log(command + ' is missing a command action');
                    }
                }
            })
            .catch((err)=>{
                console.log(err.toString());
            })
    };

    onGuildCreate = (guild) => {
        console.log(guild);
    };

    getUserByID = (id: string, name: string, msg: Discord.Message): any => {
        const searchByName = msg.guild.members.find((member) => member.user.username.toLowerCase() === name.toLowerCase());
        const searchByID = msg.guild.members.find((member) => member.id === id.replace(/[<@>!]/g, ''));

        if (searchByName) {
            return searchByName.user.id;
        } else if (searchByID) {
            return searchByID.user.id;
        } else {
            return null;
        }
    };

    /**
     * Returns the member object of the first mentioned user in the message,
     * can search by mention, discord name, or nickname (in that priority)
     * @param msg
     */
    getFirstMentionedUserID = (msg: Discord.Message): Discord.User => {
        // First, check if there are any mentions in the message and return the ID
        const mentions = msg.mentions.users.array();
        let id = null;
        if (mentions && mentions.length > 0) {
            id = mentions[0];
        }

        // If not, then we need to search the entire list of users for their name
        msg.content = msg.content.trim();
        const searchByName = msg.guild.members.find((member) =>
            member.user.username.toLowerCase() === msg.content.toLowerCase() ||
            member.nickname === msg.content
        );

        if (searchByName) {
            id = searchByName.user;
        }

        // console.log('[ID Search:]', id);
        return id;
    }
}

export default Bot;
