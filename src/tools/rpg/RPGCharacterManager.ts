import {IRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGTools from "./RPGTools";
import CommandArgs from "../../classes/CommandArgs";
import replace from "../replace";

const attackingLevelChance = 10;
const defendingLevelChance = 15;

const ProcessStrUpAttacker = (attacker: IRPGCharacter, args: CommandArgs, username: string) => {
    const chance = RPGTools.GetRandomIntegerFrom(100);

    if (chance < attackingLevelChance) {
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
    ProcessStrUpDefender
};

export default RPGCharacterManager;
