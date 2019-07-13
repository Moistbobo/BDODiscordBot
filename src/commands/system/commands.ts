import CommandArgs from "../../classes/CommandArgs";
import replace from "../../tools/replace";

const commands = (args: CommandArgs) => {

    const commands = args.bot.helpString;
    const commandCategory = args.message.content.trim();

    if (!args.bot.helpString.hasOwnProperty(commandCategory)) {
        return args.sendErrorEmbed({
            contents: replace(args.strings.commands.noCategoryFound,
                [args.message.content,
                    Object.keys(args.bot.helpString).join(' ')])
        })
    }

    let helpString = `**${commandCategory}**\n\n`;

    const commandCategories = Object.values(commands[commandCategory]);
    commandCategories.forEach((command: any) => {
        if(!command.hidden){
            const append = `[Name:]\n${command.name}\n\n[Description:]\n${command.description}\n\n[Triggers:]\n${command.trigger.join(' ')}`;
            helpString = helpString + '```ini\n' + append + '```\n';
        }
    });

    // console.log(helpString);
    args.message.author.send(helpString).then(() => {
        args.message.react('📧');
    });
};

export const action = commands;
