import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter, {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGTimer, {CanAttackAgain, FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";
import replace from "../../tools/replace";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";

const calculateDamage = (str: number): number => {
    return Math.floor(Math.max(str, (Math.random() * Math.floor(20)) * str));
};

const attack = (args: CommandArgs) => {

    const sourceUser = args.message.author;
    const targetUser = args.bot.getFirstMentionedUserID(args.message);

    let sourceTimer = null;
    let targetTimer = null;
    let source = null;
    let target = null;
    let damage = null;
    let crit = false;
    let rpgServerStats = null;

    if (!sourceUser || !targetUser) {
        return args.sendErrorEmbed({contents: args.strings.attack.invalidTarget});
    }

    if (sourceUser.id === targetUser.id) {

        const randomMessage = args.strings.attack.attackSelf[RPGTools.getRandomIntegerFrom(args.strings.attack.attackSelf.length)];
        const randomSuffix = args.strings.attack.attackSelfSuffix[RPGTools.getRandomIntegerFrom(args.strings.attack.attackSelfSuffix.length)];

        return args.sendErrorEmbed({contents: replace(randomMessage, [sourceUser.username]) + randomSuffix});
    }


    const now = Date.now() / 1000;

    args.startTyping();
    IsChannelRPGEnabled(args)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }

            return Promise.all([FindOrCreateNewRPGCharacter(sourceUser.id), FindOrCreateNewRPGCharacter(targetUser.id),
                FindOrCreateRPGTimer(sourceUser.id), FindOrCreateRPGTimer(targetUser.id), FindOrCreateRPGServerStats(args.message.guild.id)]);
        })
        .then((result): Promise<any> => {
            source = result[0];
            target = result[1];
            sourceTimer = result[2];
            targetTimer = result[3];
            rpgServerStats = result[4];

            // if(!source.pvpFlagged){
            //     args.sendErrorEmbed({contents: replace(args.strings.attack.attackerNotFlagged, [args.user.username])});
            //     throw new Error('Attacker not flagged');
            // }
            //
            // if (!target.pvpFlagged){
            //     args.sendErrorEmbed({contents: replace(args.strings.attack.targetNotFlagged, [targetUser.username])});
            //     throw new Error('Target not flagged');
            // }

            if (!CanAttackAgain(sourceTimer.lastAttack)) {
                const timeToNextAttack = (Timers.rpg.attackCD - (now - sourceTimer.lastAttack)).toFixed(0);
                const contents = replace(args.strings.attack.attackCooldown, [timeToNextAttack, sourceUser.username]);
                args.sendErrorEmbed({contents});
                throw new Error('Attacker is still on attack cooldown')
            }

            if (source.hitpoints.current <= 0) {
                args.sendErrorEmbed({contents: replace(args.strings.attack.attackerIsDead, [sourceUser.username])});
                throw new Error('Attacker is dead');
            }

            if (target.hitpoints.current <= 0) {
                const random = Math.floor(Math.random() * (args.strings.attack.targetAlreadyDead.length - 1));
                const randomString = args.strings.attack.targetAlreadyDead[random];
                const contents = replace(randomString, [targetUser.username, sourceUser.username]);

                args.sendErrorEmbed({
                    contents
                });
                throw new Error('Target is already dead');
            }
            // All checks passed, let's deal some damage!
            crit = Math.random() < source.stats.crit;

            const baseDamage = RPGTools.DamageCalculation(
                source.stats.str,
                source.stats.bal,
            );

            damage = Math.floor(crit ? baseDamage * source.stats.critDmgMult : baseDamage);


            if ((now - targetTimer.lastActivity) > Timers.rpg.afkTimer && (RPGTools.getRandomIntegerFrom(100) < 75)) {
                source.hitpoints.current -= source.hitpoints.current;
                source.deaths += 1;
                sourceTimer.lastDeath = now;
                rpgServerStats.pvpProtectionDeaths++;
                args.sendOKEmbed({
                    contents: replace(args.strings.attack.attackAFKPunish, [sourceUser.username]),
                    footer: args.strings.attack.attackAFKPunishNote
                });
            } else {
                // temp: respawn the player
                if (target.hitpoints.current > 0) target.hitpoints.current -= damage;

                //     return true;
                // })
                // .then(() => {
                sourceTimer.lastAttack = now;


                if (target.hitpoints.current <= 0) {
                    targetTimer.lastDeath = now;
                    source.kills += 1;
                    target.deaths += 1;
                    // Send notification if the target died
                    if (target.sendAttackedNotification && ((now - targetTimer.lastAttack) > Timers.rpg.notificationTimer)) {
                        targetUser.send(replace(args.strings.attack.attackNotificationKilled, [sourceUser.username, args.message.guild.name]));
                    }
                } else {
                    // send attacked dm if the target survives
                    if (target.sendAttackedNotification && ((now - targetTimer.lastAttack) > Timers.rpg.notificationTimer)) {
                        targetUser.send(replace(args.strings.attack.attackNotificationAttacked, [sourceUser.username, args.message.guild.name]));
                    }
                }

                // // 5% chance for target to get stronger
                if (Math.random() < 0.05) {
                    const strIncrease = Math.min(Math.random(), 0.1).toPrecision(2);

                    target.stats.str += parseFloat(strIncrease);

                    args.sendOKEmbed({
                        contents: replace(args.strings.attack.targetStrengthened, [
                            targetUser.username,
                            strIncrease.toString()
                        ])
                    })
                }

                // 2% chance for attacker to get stronger
                if (Math.random() < 0.02) {
                    const strIncrease = Math.min(Math.random(), 0.1).toPrecision(2);

                    source.stats.str += parseFloat(strIncrease);

                    args.sendOKEmbed({
                        contents: replace(args.strings.attack.attackerStrengthened, [
                            sourceUser.username,
                            strIncrease.toString()
                        ])
                    })
                }

                rpgServerStats.attacks++;
                if (target.hitpoints.current > 0) {
                    const contents = replace(args.strings.attack.attackTargetLives,
                        [sourceUser.username,
                            targetUser.username,
                            damage,
                            target.hitpoints.current,
                            target.hitpoints.max]);

                    if (crit) {
                        const criticalString = replace(args.strings.attack.attackCritical, [sourceUser.username, targetUser.username])
                        args.sendOKEmbed({contents: criticalString + contents});
                    } else {
                        args.sendOKEmbed({contents})
                    }

                } else {
                    rpgServerStats.deaths++;
                    const contents = replace(args.strings.attack.attackTargetLives,
                        [sourceUser.username,
                            targetUser.username,
                            damage,
                            target.hitpoints.current,
                            target.hitpoints.max])
                        + '\n' +
                        replace(args.strings.attack.attackTargetKilled, [targetUser.username]);

                    if (crit) {
                        const criticalString = replace(args.strings.attack.attackCritical, [sourceUser.username, targetUser.username])
                        args.sendOKEmbed({contents: criticalString + contents});
                    } else {
                        args.sendOKEmbed({contents})
                    }
                }
            }

            return Promise.all([sourceTimer.save(), targetTimer.save(), source.save(), target.save(), rpgServerStats.save()])
        })
        .catch((err) => {
            console.log(err.toString());
        })
        .finally(() => {
            args.stopTyping();
        })
};

export const action = attack;
