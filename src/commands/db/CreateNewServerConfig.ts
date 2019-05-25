import CommandArgs from "../../classes/CommandArgs";
import DatabaseTools from "../../tools/DatabaseTools";

const createNewServerConfig = (args: CommandArgs) => {
    DatabaseTools.createNewServer(args.message.guild.id);
    args.message.channel.send('Created new database entry for this server');
};

export const action = createNewServerConfig;