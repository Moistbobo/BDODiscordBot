import CommandArgs from "../../classes/CommandArgs";
import {
    DefaultStats,
    FindOrCreateNewRPGCharacter,
    IncrementPerLevel,
    IRPGCharacter
} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";

const validSkills = ['str', 'int', 'hp'];


const allocateSkillPoint = (rpgChar: IRPGCharacter, skill: string, amt: number): IRPGCharacter => {
    console.log('Adding skill points');

    if (skill === validSkills[0]) {
        rpgChar.stats.str += amt;
    } else if (skill === validSkills[1]) {
        rpgChar.stats.int += amt;
    } else if (skill === validSkills[2]) {
        // For hp, recalculate user's max hp
        rpgChar.stats.hpLevel += amt;
        rpgChar.hitpoints.max = DefaultStats.hp + (IncrementPerLevel.hp * rpgChar.stats.hpLevel);
        rpgChar.hitpoints.current = Math.min(rpgChar.hitpoints.current, rpgChar.hitpoints.max);
    }

    if (validSkills.includes(skill)) {
        rpgChar.skillPoints -= amt;
    }

    return rpgChar;
};

const getSkillLevel = (rpgChar: IRPGCharacter, skill: string) => {
    skill === 'hp' ? skill = 'hpLevel' : null;

    return rpgChar.stats[skill];
};

const addSkill = (args: CommandArgs) => {
    // split message content into skill and number
    // if no number, default to 1

    const author = args.message.author;
    let rpgChar, skill, allocation = null;

    IsChannelRPGEnabled(args)
        .then(() => {
            return Promise.all([FindOrCreateNewRPGCharacter(author.id)]);
        })
        .then((res) => {
            [rpgChar] = res;
            let contentsSplit = args.message.content.split(' ');

            skill = contentsSplit[0].toLowerCase();
            allocation = parseInt(contentsSplit[1]) || 1;

            // User can not use command if they have no skill points
            if (rpgChar.skillPoints === 0) {
                const contents = replace(args.strings.addSkill.errNoSkillPoints,
                    [author.username]);
                args.sendErrorEmbed({contents});
                throw new Error(`User ${author.username} has no skill points to use`);
            }

            // User can no use more skill points than they already have
            if (rpgChar.skillPoints < allocation) {
                const contents = replace(args.strings.addSkill.errNotEnoughSkillPoints,
                    [author.username,
                        allocation]);
                args.sendErrorEmbed({contents});
                throw new Error(`User ${author.username} does not have ${allocation} skill points to use`)
            }

            // User can not allocate points to nonexistent skills
            if (!validSkills.includes(skill)) {
                const contents = replace(
                    args.strings.useSkill.errInvalidSkill,
                    [author.username,
                        skill,
                        validSkills.join(', ')]
                );
                args.sendErrorEmbed({contents});
                throw new Error(`User ${author.username} tried to allocate points to invalid skill ${skill}`);
            }

            // Allocate skill points if everything is okay
            rpgChar = allocateSkillPoint(rpgChar, skill, allocation);

            return rpgChar.save();
        })
        .then(() => {

            const skillLevel = getSkillLevel(rpgChar, skill);

            const contents = replace(args.strings.addSkill.successAddSkill,
                [author.username,
                    allocation,
                    skill,
                    skillLevel]);
            args.sendOKEmbed({contents});
        })
        .catch((err) => {
            console.log('[ADD SKILL COMMAND]: ', err.toString());
        });
};

export const action = addSkill;
