import CommandArgs from "../../classes/CommandArgs";

const rpghelp = (args: CommandArgs) =>{
    args.sendOKEmbed({
        contents: `Temporary help screen for RPG commands:\n.attack\n.respawn\n.status\n.heal`
    })
};

const action = rpghelp;
