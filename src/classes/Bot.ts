import * as Discord from 'discord.js'
import * as fs from 'fs';
import Command from "./Command";
import DatabaseHelper from "./DatabaseHelper";

class Bot {
    strings: object;
    client: Discord.Client;
    test: any;
    commands: Command[];
    config: any;
    voiceSessions: any;
    dbHelper : DatabaseHelper;

    constructor(prefix: string, token: string, config: any) {
        this.client = new Discord.Client();
        this.dbHelper = new DatabaseHelper();
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

        fs.readdir(commandPath, (err, folderNames) => {
            err? console.error(err):null;
            console.log(folderNames);
            folderNames.forEach((folder)=>{
                fs.readdir(`${commandPath}${folder}/`, (err, commandNames) =>{
                    err? console.error(err):null;
                    this.extractCommand(`${commandPath}${folder}/`, commandNames);
                })
            });
        })
    };

    extractCommand = (commandPath: String, commandNames : String[]) =>{
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
        const command = msg.content.substring(1).split(' ')[0];

        const cmd = this.commands.find((x) =>
            x.trigger.includes(command.toLowerCase())
        );

        msg.content = msg.content.substring(1+command.toLowerCase().length);

        if(cmd){
            const commandArgs = {
                bot: this,
                strings: this.strings,
                message: msg
            };
            if(cmd.hasOwnProperty('action')){
                try{
                    cmd.action(commandArgs);
                }catch(exception){
                    console.error(exception);
                }
            }else{
                console.log(command + ' is missing a command action');
            }
        }
    };

    onGuildCreate = (guild) =>{
        console.log(guild);
        this.dbHelper.createNewConfig(guild.id);
    }

}

export default Bot;