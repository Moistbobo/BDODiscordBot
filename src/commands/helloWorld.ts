import CommandArgs from "../classes/CommandArgs";

const helloWorld = (args: CommandArgs) => {
    const strings = args.strings.helloWorld;
    console.log(strings);
    console.log(strings.action);
};

export const action = helloWorld;