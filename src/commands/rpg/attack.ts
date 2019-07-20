import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter, {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGTimer, {CanAttackAgain, FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";
import replace from "../../tools/replace";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";
import RPGCharacterManager from "../../tools/rpg/RPGCharacterManager";
import RPGCombatTools from "../../tools/rpg/RPGCombatTools";

const sendAttackedNotification = (target: any, targetTimer: any, source: any, targetUser: any, sourceUser: any, guildName: string, strings: any) => {
    const now = Date.now();
    if (target.hitpoints.current <= 0) {
        targetTimer.lastDeath = now;
        source.kills += 1;
        target.deaths += 1;
        // Send notification if the target died
        if (target.sendAttackedNotification && ((now - targetTimer.lastAttack) > Timers.rpg.notificationTimer)) {
            targetUser.send(replace(strings.attack.attackNotificationKilled, [sourceUser.username, guildName]));
        }
    } else {
        // send attacked dm if the target survives
        if (target.sendAttackedNotification && ((now - targetTimer.lastAttack) > Timers.rpg.notificationTimer)) {
            targetUser.send(replace(strings.attack.attackNotificationAttacked, [sourceUser.username, guildName]));
        }
    }
};

const attack = (args: CommandArgs) => {

    const sourceUser = args.message.author;
    const targetUser = args.bot.getFirstMentionedUserID(args.message);

    let sourceTimer = null;
    let targetTimer = null;
    let source = null;
    let target = null;
    let rpgServerStats = null;

    if (!sourceUser || !targetUser) {
        return args.sendErrorEmbed({contents: args.strings.attack.invalidTarget});
    }

    if (sourceUser.id === targetUser.id) {

        const randomMessage = args.strings.attack.attackSelf[RPGTools.GetRandomIntegerFrom(args.strings.attack.attackSelf.length)];
        const randomSuffix = args.strings.attack.attackSelfSuffix[RPGTools.GetRandomIntegerFrom(args.strings.attack.attackSelfSuffix.length)];

        return args.sendErrorEmbed({contents: replace(randomMessage, [sourceUser.username]) + randomSuffix});
    }

    const now = Date.now() / 1000;

    args.startTyping();
    IsChannelRPGEnabled(args)
        .then(() => {
            return Promise.all([FindOrCreateNewRPGCharacter(sourceUser.id), FindOrCreateNewRPGCharacter(targetUser.id),
                FindOrCreateRPGTimer(sourceUser.id), FindOrCreateRPGTimer(targetUser.id), FindOrCreateRPGServerStats(args.message.guild.id)]);
        })
        .then((result): Promise<any> => {
            [source, target, sourceTimer, targetTimer, rpgServerStats] = result;

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
                const random = Math.floor(Math.random() * (args.strings.attack.targetAlreadyDead.length));
                const randomString = args.strings.attack.targetAlreadyDead[random];
                const contents = replace(randomString, [targetUser.username, sourceUser.username]);

                args.sendErrorEmbed({
                    contents
                });
                throw new Error('Target is already dead');
            }

            // PVP AFK protection: 75% to trigger
            if ((now - targetTimer.lastActivity) > Timers.rpg.afkTimer && (RPGTools.GetRandomIntegerFrom(100) < 75)) {
                source.hitpoints.current -= source.hitpoints.current;
                source.deaths += 1;
                sourceTimer.lastDeath = now;
                rpgServerStats.pvpProtectionDeaths++;
                args.sendOKEmbed({
                    contents: replace(args.strings.attack.attackAFKPunish, [sourceUser.username]),
                    footer: args.strings.attack.attackAFKPunishNote
                });
                args.stopTyping();
                return Promise.all([rpgServerStats.save(), source.save()]);
            } else {
                const {isCrit, damage} = RPGCombatTools.CalculatePlayerDamage(source);

                const critString = isCrit ?
                    replace(args.strings.attack.attackCritical,
                        [sourceUser.username,
                            targetUser.username]) : '';

                if (target.hitpoints.current > 0) target.hitpoints.current -= damage;
                sourceTimer.lastAttack = now;

                // Attacked notification
                // if (target.hitpoints.current <= 0) {
                //     targetTimer.lastDeath = now;
                //     source.kills += 1;
                //     target.deaths += 1;
                //     // Send notification if the target died
                //     if (target.sendAttackedNotification && ((now - targetTimer.lastAttack) > Timers.rpg.notificationTimer)) {
                //         targetUser.send(replace(args.strings.attack.attackNotificationKilled, [sourceUser.username, args.message.guild.name]));
                //     }
                // } else {
                //     // send attacked dm if the target survives
                //     if (target.sendAttackedNotification && ((now - targetTimer.lastAttack) > Timers.rpg.notificationTimer)) {
                //         targetUser.send(replace(args.strings.attack.attackNotificationAttacked, [sourceUser.username, args.message.guild.name]));
                //     }
                // }
                sendAttackedNotification(target, targetTimer, source, targetUser, sourceUser, args.message.guild.name, args.strings);
                rpgServerStats.attacks++;

                const targetDeadString = target.hitpoints.current <= 0 ?
                    replace(args.strings.attack.attackTargetKilled, [targetUser.username]) : '';

                const attackStringContents = replace(args.strings.attack.attackTargetLives,
                    [sourceUser.username,
                        targetUser.username,
                        damage,
                        target.hitpoints.current,
                        target.hitpoints.max])
                    + '\n' + targetDeadString;

                isCrit ?
                    args.sendOKEmbed({contents: critString + attackStringContents}) :
                    args.sendOKEmbed({contents: attackStringContents});

                args.stopTyping();
                return Promise.all([sourceTimer.save(), targetTimer.save(), RPGCharacterManager.ProcessStrUpAttacker(source, args, sourceUser.username), RPGCharacterManager.ProcessStrUpDefender(target, args, targetUser.username), rpgServerStats.save()])
            }
        })
        .catch((err) => {
            args.stopTyping();
            console.log(err.toString());
        })

};

export const action = attack;
