import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import replace from "../../tools/replace";

const serverstats = (args: CommandArgs) => {
    IsChannelRPGEnabled(args)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }
            return FindOrCreateRPGServerStats(args.message.guild.id);
        })
        .then((rpgServerStats) => {
            args.sendOKEmbed({
                contents:
                    replace(args.strings.serverstats.serverStatString,
                        [args.message.guild.name,
                            rpgServerStats.attacks,
                            rpgServerStats.heals,
                            rpgServerStats.deaths,
                            rpgServerStats.pvpProtectionDeaths])
            })
            return rpgServerStats.save();
        });
};

export const action = serverstats;
