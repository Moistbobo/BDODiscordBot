import CommandArgs from "../../classes/CommandArgs";

const alive = (args: CommandArgs) => {
    args.sendOKEmbed({contents: 'I\'m alive'});
};

export const action = alive;