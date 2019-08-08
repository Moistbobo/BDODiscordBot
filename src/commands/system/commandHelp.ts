import CommandArgs from "../../classes/CommandArgs";
import replace from "../../tools/replace";

const commandHelp = (args: CommandArgs) => {
    const cmdToFind = args.message.content.toLocaleLowerCase();

    const filteredCommands = args.bot.commands.filter((command) =>
        command.name.toLocaleLowerCase() === cmdToFind ||
        command.trigger.includes(cmdToFind));

    if (!filteredCommands) {
        const contents = replace(
            args.strings.commandHelp.errorCommandNotFound,
            [cmdToFind]
        );
        args.sendErrorEmbed({
            contents
        });
    }
    else{
        const cmd = filteredCommands[0];

        args.sendOKEmbed({
            title: cmd.name,
            contents: cmd.description,
            extraFields: [
                {
                    name: args.strings.commandHelp.helpTriggers,
                    value: cmd.trigger.join('\n')
                },
                {
                    name: args.strings.commandHelp.exampleUsage,
                    value: cmd.exampleUsage.join('\n')
                }
            ]
        })
    }
};

export const action = commandHelp;