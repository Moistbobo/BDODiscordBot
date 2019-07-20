import {IRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGTools from "./RPGTools";
import CommandArgs from "../../classes/CommandArgs";
import replace from "../replace";
import Command from "../../classes/Command";
import {IRPGMonster} from "../../models/rpg/RPGMonster";

const attackingLevelChance = 10;
const defendingLevelChance = 15;

const ProcessStrUpAttacker = (attacker: IRPGCharacter, args: CommandArgs, username: string) => {
    const chance = RPGTools.GetRandomIntegerFrom(100);

    if (chance < (attackingLevelChance)) {
        const levelAmount = RPGTools.GetRandomFloatRange(0.10, 0.25);
        attacker.stats.str += levelAmount;

        args.sendOKEmbed({
            contents: replace(args.strings.attack.attackerStrengthened, [
                username,
                levelAmount
            ])
        })
    }

    return attacker.save();
};

const ProcessStrUpMonsterKill = (attacker: IRPGCharacter, args: any, username: string, monsterStrings: any, monster: IRPGMonster)=>{
    const chance = RPGTools.GetRandomIntegerFrom(100);
    let monsterStrBonus = monster.strLevelChanceMod;
    if(attacker.stats.str >= monster.playerStrCapThreshold){
        monsterStrBonus = 1.0;
    }

    console.log(`${username} str roll ${chance} | ${attackingLevelChance * monsterStrBonus}`);

    if(chance < (attackingLevelChance * monsterStrBonus)){
        const levelAmount = RPGTools.GetRandomFloatRange(0.10, 0.25);
        attacker.stats.str += levelAmount;

        args.sendOKEmbed({
            contents: replace(args.strings.dungeon.dungeonPlayerStrLevelUp, [
                monsterStrings.name,
                username,
                levelAmount
            ])
        })
    }

    return attacker.save();
};

const ProcessStrUpDefender = (defender: IRPGCharacter, args: CommandArgs, username: string) => {
    const chance = RPGTools.GetRandomIntegerFrom(100);

    if (chance < defendingLevelChance) {
        const levelAmount = RPGTools.GetRandomFloatRange(0.10, 0.25);
        defender.stats.str += levelAmount;
        args.sendOKEmbed({
            contents: replace(args.strings.attack.targetStrengthened, [
                username,
                levelAmount
            ])
        })
    }

    return defender.save();
};

const RPGCharacterManager = {
    ProcessStrUpAttacker,
    ProcessStrUpDefender,
    ProcessStrUpMonsterKill
};

export default RPGCharacterManager;
