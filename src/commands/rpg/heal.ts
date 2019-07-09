import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {CanHeal, FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";

const heal = (args: CommandArgs) => {
    const userID = args.message.author.id;

    IsChannelRPGEnabled(args.message.guild.id, args.message.channel.id)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }
            return Promise.all([FindOrCreateRPGTimer(userID), FindOrCreateNewRPGCharacter(userID), FindOrCreateRPGServerStats(args.message.guild.id)])
        })
        .then((result) => {
            let rpgTimer = result[0];
            let rpgCharacter = result[1];
            let rpgServerStats = result[2];


            if (!CanHeal(rpgTimer.lastHeal)) {
                const timeToHeal = Timers.rpg.healCD - (Date.now() / 1000 - rpgTimer.lastHeal);
                args.sendErrorEmbed({
                    contents: replace(args.strings.heal.timeUntilHeal, [timeToHeal.toFixed(0),
                        args.message.author.username])
                });
                throw new Error('Heal is on CD');
            }

            if (rpgCharacter.hitpoints.current === rpgCharacter.hitpoints.max) {
                args.sendErrorEmbed({
                    contents: replace(args.strings.heal.hpFull,
                        [args.message.author.username])
                });
                throw new Error('User is at max HP');
            }

            if (rpgCharacter.hitpoints.current <= 0) {
                args.sendErrorEmbed({contents: replace(args.strings.heal.userIsDead, [args.message.author.username])});
                throw new Error('User is dead');
            }

            const healAmount = RPGTools.HealCalculation(rpgCharacter.stats.int, rpgCharacter.stats.bal);

            rpgCharacter.hitpoints.current = Math.min(rpgCharacter.hitpoints.max, rpgCharacter.hitpoints.current + healAmount);
            rpgTimer.lastHeal = Date.now() / 1000;
            rpgServerStats.heals++;

            args.sendOKEmbed({
                contents: replace(args.strings.heal.healSuccess, [healAmount,
                    rpgCharacter.hitpoints.current,
                    rpgCharacter.hitpoints.max,
                    args.message.author.username])
            });


            return Promise.all([rpgCharacter.save(), rpgTimer.save(), rpgServerStats.save()]);
        })
        .catch((err) => {
            console.log(err.toString());
        })
};

export const action = heal;
