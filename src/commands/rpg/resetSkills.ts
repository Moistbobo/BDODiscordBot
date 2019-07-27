import CommandArgs from "../../classes/CommandArgs";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import {
    DefaultStats,
    FindOrCreateNewRPGCharacter,
    IncrementPerLevel,
    IRPGCharacter
} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";

const confirmEmoji = '✅';

const refundSkillPoints = (rpgChar: IRPGCharacter) => {
    let refundedSkillPoints =
        rpgChar.stats.hpLevel - 1 +
        rpgChar.stats.str - 1 +
        rpgChar.stats.int - 1 +
        rpgChar.skillPoints;

    refundedSkillPoints = Math.round(refundedSkillPoints);

    rpgChar.stats.hpLevel = 1;
    rpgChar.stats.str = 1;
    rpgChar.stats.int = 1;
    rpgChar.skillPoints = 0;


    rpgChar.hitpoints.max = DefaultStats.hp + (IncrementPerLevel.hp * rpgChar.stats.hpLevel);
    rpgChar.hitpoints.current = Math.min(rpgChar.hitpoints.current, rpgChar.hitpoints.max);
    rpgChar.skillPoints = refundedSkillPoints;
    rpgChar.level = refundedSkillPoints;

    return rpgChar;
};

const resetSkills = (args: CommandArgs) => {
    const author = args.message.author;
    const reactionFilter = (reaction, user) => {
        return reaction.emoji.name === confirmEmoji && user.id === author.id
    };
    let rpgChar = null;
    let warningMsg = null;

    IsChannelRPGEnabled(args)
        .then(() => {
            return args.sendOKEmbed({
                contents: replace(args.strings.resetSkills.warningReset,
                    [author.username]),
                footer: args.strings.resetSkills.warningFooter
            });

        })
        .then((msg) => {
            warningMsg = msg;
            return warningMsg.react(confirmEmoji);
        })
        .then(() => {
            return warningMsg.awaitReactions(reactionFilter,
                {max: 1, time: 15000})
        })
        .then((collected) => {
            warningMsg.delete();
            if (!collected.get(confirmEmoji).users.array().find(user => user.id === author.id)) {
                throw new Error('User did not react in time');
            }
            return FindOrCreateNewRPGCharacter(author.id);
        })
        .then((char) => {
            rpgChar = refundSkillPoints(char);

            const equippedWeapon = rpgChar.equippedWeapon;
            if (equippedWeapon) {
                rpgChar.inventory.push(equippedWeapon);
                rpgChar.equippedWeapon = null;
            }
            return rpgChar.save()
        })
        .then(() => {
            const contents =
                replace(
                    args.strings.resetSkills.successResetSkill,
                    [author.username,
                        rpgChar.skillPoints
                    ]);
            args.sendOKEmbed({contents, footer: args.strings.resetSkills.weaponUnequipped});
        })
        .catch((err) => {
            console.log('[RESET SKILL COMMAND]:', err.toString());
        })
};

export const action = resetSkills;
