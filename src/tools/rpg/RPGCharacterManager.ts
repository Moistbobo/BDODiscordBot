import {IRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGTools from "./RPGTools";
import CommandArgs from "../../classes/CommandArgs";
import replace from "../replace";
import {IRPGMonster} from "../../models/rpg/RPGMonster";

const attackingLevelChance = 10;
const defendingLevelChance = 15;
const strHardCap = 18;
export const maxLevel = 50;
export const maxLevelPenalty = 0.25;

const CalculatePlayerLevel = (rpgChar: IRPGCharacter) => {
    return Math.floor(
        rpgChar.skillPoints +
        rpgChar.stats.str - 1 +
        rpgChar.stats.int - 1 +
        rpgChar.stats.hpLevel
    )
};

const CalculateXPNeededForLevel = (level: number) => {
    const levelConstant = 100;
    return Math.floor((level * levelConstant) * Math.log10(level * levelConstant));
};

const AddXPPlayer = (rpgChar: IRPGCharacter, exp: number, args: CommandArgs) => {
    const playerLevel = CalculatePlayerLevel(rpgChar);
    let softCapPenalty = 1.0;
    if (playerLevel >= maxLevel) {
        // throw new Error('Player has reached level cap');
        softCapPenalty = maxLevelPenalty;
    }

    rpgChar.exp += Math.floor(exp * softCapPenalty);

    if (rpgChar.exp > CalculateXPNeededForLevel(playerLevel)) {
        rpgChar.exp = (rpgChar.exp - CalculateXPNeededForLevel(playerLevel));
        rpgChar.skillPoints++;

        args.sendOKEmbed({
            contents: replace(
                args.strings.general.levelUp,
                [args.message.author,
                    playerLevel + 1]
            ),
            thumbnail: args.message.author.avatarURL()
        })
    }

    return rpgChar.save();
};

// Lose 2% exp on death
const ApplyDeathXPPenalty = (rpgChar: IRPGCharacter) => {
    const expPenalty = 0.02;
    rpgChar.exp = Math.min(0, rpgChar.exp - (CalculateXPNeededForLevel(CalculatePlayerLevel(rpgChar) * expPenalty)));

    return rpgChar;
};

const ProcessStrUpAttacker = (attacker: IRPGCharacter, args: CommandArgs, username: string) => {
    // if (attacker.stats.str >= strHardCap) return attacker.save();
    // const chance = RPGTools.GetRandomIntegerFrom(100);
    //
    // if (chance < (attackingLevelChance)) {
    //     const levelAmount = RPGTools.GetRandomFloatRange(0.10, 0.25);
    //     attacker.stats.str += levelAmount;
    //
    //     args.sendOKEmbed({
    //         contents: replace(args.strings.attack.attackerStrengthened, [
    //             username,
    //             levelAmount
    //         ])
    //     })
    // }

    return attacker.save();
};

const ProcessStrUpMonsterKill = (attacker: IRPGCharacter, args: any, username: string, monsterStrings: any, monster: IRPGMonster) => {
    // if (attacker.stats.str >= strHardCap) return attacker.save();
    // const chance = RPGTools.GetRandomIntegerFrom(100);
    // let monsterStrBonus = monster.strLevelChanceMod;
    // if (attacker.stats.str >= monster.playerStrCapThreshold) {
    //     monsterStrBonus = 1.0;
    // }
    //
    // console.log(`${username} str roll ${chance} | ${attackingLevelChance * monsterStrBonus}`);
    //
    // if (chance < (attackingLevelChance * monsterStrBonus)) {
    //     const levelAmount = RPGTools.GetRandomFloatRange(0.10, 0.25);
    //     attacker.stats.str += levelAmount;
    //
    //     args.sendOKEmbed({
    //         contents: replace(args.strings.dungeon.dungeonPlayerStrLevelUp, [
    //             monsterStrings.name,
    //             username,
    //             levelAmount
    //         ])
    //     })
    // }

    return attacker.save();
};

const ProcessStrUpDefender = (defender: IRPGCharacter, args: CommandArgs, username: string) => {
    // if (defender.stats.str >= strHardCap) return defender.save();
    // const chance = RPGTools.GetRandomIntegerFrom(100);
    //
    // if (chance < defendingLevelChance) {
    //     const levelAmount = RPGTools.GetRandomFloatRange(0.10, 0.25);
    //     defender.stats.str += levelAmount;
    //     args.sendOKEmbed({
    //         contents: replace(args.strings.attack.targetStrengthened, [
    //             username,
    //             levelAmount
    //         ])
    //     })
    // }

    return defender.save();
};

const RPGCharacterManager = {
    ProcessStrUpAttacker,
    ProcessStrUpDefender,
    ProcessStrUpMonsterKill,
    AddXPPlayer,
    ApplyDeathXPPenalty,
    CalculatePlayerLevel,
    CalculateXPNeededForLevel
};

export default RPGCharacterManager;
