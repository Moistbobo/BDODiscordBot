import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter, {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGTimer, {CanAttackAgain, FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";
import replace from "../../tools/replace";

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

    if (!sourceUser || !targetUser) {
        return args.sendErrorEmbed({contents: args.strings.attack.invalidTarget});
    }

    if (sourceUser.id === targetUser.id) {
        const randomMessage = args.strings.attack.attackSelf[Math.floor(Math.random() * (args.strings.attack.attackSelf.length - 1))];
        const randomSuffix = args.strings.attack.attackSelfSuffix[Math.floor(Math.random() * (args.strings.attack.attackSelfSuffix.length - 1))];

        return args.sendErrorEmbed({contents: randomMessage + randomSuffix});
    }


    const now = Date.now() / 1000;

    args.startTyping();

    Promise.all([FindOrCreateNewRPGCharacter(sourceUser.id), FindOrCreateNewRPGCharacter(targetUser.id),
        FindOrCreateRPGTimer(sourceUser.id), FindOrCreateRPGTimer(targetUser.id)])
        .then((result) => {
            source = result[0];
            target = result[1];
            sourceTimer = result[2];
            targetTimer = result[3];

            if (!CanAttackAgain(sourceTimer.lastAttack)) {
                const timeToNextAttack = (Timers.rpg.attackCD - (now - sourceTimer.lastAttack)).toFixed(0);
                const contents = replace(args.strings.attack.attackCooldown, [timeToNextAttack, sourceUser.username]);
                args.sendErrorEmbed({contents});
                throw new Error('Attacker is still on attack cooldown')
            }

            if (source.hitpoints.current <= 0) {
                args.sendErrorEmbed({contents: args.strings.attack.attackerIsDead});
                throw new Error('Attacker is dead');
            }

            if (target.hitpoints.current <= 0) {
                const random = Math.floor(Math.random() * (args.strings.attack.targetAlreadyDead.length - 1));
                const randomString = args.strings.attack.targetAlreadyDead[random];
                const contents = replace(randomString, [targetUser.username]) + '\n' + args.strings.attack.attackAlsoUsedUp;

                args.sendErrorEmbed({
                    contents
                });
                throw new Error('Target is already dead');
            }
            return true;
        })
        .then(() => {
            // All checks passed, let's deal some damage!
            crit = Math.random() < source.stats.crit;


            const baseDamage = calculateDamage(source.stats.str);
            damage = Math.round(crit ? baseDamage * source.stats.critDmgMult : baseDamage);

            // temp: respawn the player
            if (target.hitpoints.current > 0) target.hitpoints.current -= damage;

            return true;
        })
        .then(() => {
            const now = Date.now() / 1000;
            sourceTimer.lastAttack = now;

            if (target.hitpoints.current <= 0) {
                targetTimer.lastDeath = now;
                source.kills += 1;
                target.deaths += 1;
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



            return Promise.all([sourceTimer.save(), targetTimer.save(), source.save(), target.save()])
        })
        .then(() => {
            // Finally, if the attack is successful, determine what kind of message to display
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
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            args.stopTyping();
        })
};

export const action = attack;
