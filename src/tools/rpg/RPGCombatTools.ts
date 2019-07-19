import {IRPGMonster} from "../../models/rpg/RPGMonster";
import RPGTools from "./RPGTools";

const CalculateMonsterDamage = (monster: IRPGMonster) => {
    const critMod = (Math.random() < monster.crit) ? monster.critDamageMult : 1.0;
    const balanceMod = RPGTools.GetRandomFloatRange(monster.bal, 1.0);

    const finalDamage = (monster.baseDamage * balanceMod) * critMod;
    return {damage: Math.floor(finalDamage), isCrit: critMod !== 1.0}
};


const RPGCombatTools = {
    CalculateMonsterDamage
};

export default RPGCombatTools;
