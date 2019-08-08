import CommandArgs from "../../classes/CommandArgs";
import replace from "../../tools/replace";

const commandHelp = (args: CommandArgs) => {
    const cmdToFind = args.message.content.toLocaleLowerCase().replace(args.bot.prefix,'');


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
    } else {
        const cmd = filteredCommands[0];

        let triggers = cmd.trigger;
        let usage = cmd.exampleUsage;

        triggers = triggers.map((e) => args.bot.prefix + e.trim());
        usage = usage.map((e) => args.bot.prefix + e.trim());

        args.sendOKEmbed({
            title: cmd.name,
            contents: cmd.description,
            extraFields: [
                {
                    name: args.strings.commandHelp.helpTriggers,
                    value: triggers.join('\n')
                },
                {
                    name: args.strings.commandHelp.exampleUsage,
                    value: usage.join('\n')
                }
            ]
        })
    }
};

export const action = commandHelp;