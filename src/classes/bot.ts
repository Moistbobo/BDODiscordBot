import * as Discord from 'discord.js'
import * as fs from 'fs';
import Command from "./command";

class Bot {
    strings: object;
    client: Discord.Client;
    test: any;
    commands: Command[];
    config: any;
    voiceSessions: any;

    constructor(prefix: string, token: string) {
        this.client = new Discord.Client();
        this.client.on('message', this.onMessage);
        this.client.on('error', this.onError);
        this.client.on('ready', this.onReady);
        this.strings = require('../resources/strings_en').Strings;
        this.client.login(token);
        this.test = require('../commands/helloWorld');
    }

    // Init
    loadCommands = () => {
        const commandPath = './commands/';
        this.commands = [];

        fs.readdir(commandPath, (err, commandNames) => {
            if (err) {
                console.log(err);
            }

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
            if(cmd.hasOwnProperty('action')){
                cmd.action({bot: this, strings: this.strings, message: msg});
            }else{
                console.log(command + ' is missing a command action');
            }
        }
    };

}

export default Bot;