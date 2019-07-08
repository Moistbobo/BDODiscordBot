import CommandArgs from "../../classes/CommandArgs";
import RPGCharacter from "../../models/rpg/RPGCharacter";
import RPGTimer from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";

const getRPGCharacter = (userID: string): any => {
    return new Promise((resolve, reject) => {
        RPGCharacter.findOne({userID})
            .then((user) => {
                if (!user) {
                    user = new RPGCharacter();
                    user.userID = userID;
                    resolve(user);
                } else {
                    resolve(user);
                }
            })
            .catch((err) => {
                console.log(err.toString());
                reject(new Error('Error retrieving users'));
            })
    })
};

const getRPGTimers = (userID: string): any => {
    return new Promise((resolve, reject) => {
        RPGTimer.findOne(({userID}))
            .then((rpgTimer) => {
                if (!rpgTimer) {
                    rpgTimer = new RPGTimer();
                    rpgTimer.userID = userID;
                }
                resolve(rpgTimer);
            })
            .catch((err) => {
                reject(new Error('Error retrieving timers'))
            })
    })
};

const calculateDamage = (): number => {
    return Math.floor(Math.random() * Math.floor(20));
};

const attack = (args: CommandArgs) => {
    const sourceUser = args.message.author;
    const targetUser = args.bot.getFirstMentionedUserID(args.message);

    let sourceTimer = null;
    let targetTimer = null;
    let source = null;
    let target = null;
    let damage = null;

    if (!sourceUser || !targetUser) {
        return args.sendErrorEmbed({contents: 'You need to specify a target'});
    }

    if (sourceUser.id === targetUser.id) {
        return args.sendErrorEmbed({contents: 'You bring the gun to your head but you end up shitting yourself instead of pulling the trigger. dum pusc'});
    }


    const now = Date.now() / 1000;

    args.startTyping();

    Promise.all([getRPGTimers(sourceUser.id), getRPGTimers(targetUser.id)])
        .then((timers) => {
            sourceTimer = timers[0];
            targetTimer = timers[1];

            if (!(now - sourceTimer.lastAttack > Timers.rpg.attackCD)) {
                const timeToNextAttack = (Timers.rpg.attackCD - (now - sourceTimer.lastAttack)).toFixed(0);
                args.sendErrorEmbed({contents: `${timeToNextAttack} seconds until your next attack.`});
                throw new Error('Attacker is still on attack cooldown')
            }

            if (!(now - sourceTimer.lastDeath > Timers.rpg.deathCD)) {
                const timeToRespawn = (Timers.rpg.deathCD - (now - sourceTimer.lastDeath));
                args.sendErrorEmbed({contents: `You're dead. .respawn before attack again`});
                throw new Error('Attacker is dead');
            }

            if ((now - targetTimer.lastDeath < Timers.rpg.deathCD)) {
                args.sendErrorEmbed({
                    contents: `${targetUser.username} is already dead so you stab their body a few times. How could you do such a thing?
                Your attack has been used up as well`
                });
                throw new Error('Target is dead');
            }

            return Promise.all([getRPGCharacter(sourceUser.id), getRPGCharacter(targetUser.id)])
        })
        .then((users) => {
            source = users[0];
            target = users[1];

            if (source.hitpoints.current <= 0) {
                args.sendErrorEmbed({contents: `You're dead. .respawn before attacking again`});
                throw new Error('Attacker is dead');
            }

            if( target.hitpoints.current <= 0){
                args.sendErrorEmbed({
                    contents: `${targetUser.username} is already dead so you stab their body a few times. How could you do such a thing?
                Your attack has been used up as well`
                });
                throw new Error('Target is dead');

            }

            damage = calculateDamage();

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

            return Promise.all([sourceTimer.save(), targetTimer.save(), source.save(), target.save()])
        })
        .then(() => {
            // Finally, if the attack is successful, determine what kind of message to display
            if (target.hitpoints.current > 0) {
                args.sendOKEmbed({contents: `${sourceUser.username} attacked ${targetUser.username} for ${damage}HP!\n${targetUser.username} has ${target.hitpoints.current}/${target.hitpoints.max} left!`})
            } else {
                args.sendOKEmbed({
                    contents: `${sourceUser.username} attacked ${targetUser.username} for ${damage}HP!\n${targetUser.username} has ${target.hitpoints.current}/${target.hitpoints.max} left!
                ${targetUser.username} has been killed!`
                })
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
