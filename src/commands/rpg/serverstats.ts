import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateRPGServerStats} from "../../models/rpg/RPGServerStats";
import replace from "../../tools/replace";

const serverstats = (args:CommandArgs) =>{
    FindOrCreateRPGServerStats(args.message.guild.id)
        .then((rpgServerStats)=>{
            args.sendOKEmbed({contents:
            replace(args.strings.serverstats.serverStatString,
                [args.message.guild.name,
                rpgServerStats.attacks,
                rpgServerStats.heals,
                rpgServerStats.deaths])})
        });
};

export const action = serverstats;
