import {IRPGMonster} from "../../models/rpg/RPGMonster";
import RPGTools from "./RPGTools";
import {IRPGCharacter} from "../../models/rpg/RPGCharacter";

const CalculateMonsterDamage = (monster: IRPGMonster) => {
    const critMod = (Math.random() < monster.crit) ? monster.critDamageMult : 1.0;
    const balanceMod = RPGTools.GetRandomFloatRange(monster.bal, 1.0);

    console.log(critMod);
    const finalDamage = (monster.baseDamage * balanceMod) * critMod;
    console.log('Damage: ', finalDamage);
    return {damage: Math.floor(finalDamage), isCrit: critMod !== 1.0}
};

const CalcMaxDamage = (str: number, equip: number, otherBonuses: number) => {
    const baseConstant = 5;
    const baseLog = 1.5;

    return baseConstant * (Math.log(equip * str) / Math.log(baseLog));
};

const CalculatePlayerDamage = (rpgChar: IRPGCharacter) => {
    const equipmentBonus = rpgChar.equippedWeapon ? rpgChar.equippedWeapon.baseDamage + 10 : 10;
    const maxDamage = CalcMaxDamage(rpgChar.stats.str, equipmentBonus, 0);

    console.log(`Player max damage: ${maxDamage}`);

    const balanceMod = RPGTools.GetRandomFloatRange(rpgChar.stats.bal, 1.0);
    const isCrit = Math.random() < rpgChar.stats.crit;
    const finalDamage = (maxDamage * balanceMod) * (isCrit ? rpgChar.stats.critDmgMult : 1.0)

    return {isCrit, damage: Math.floor(finalDamage)};
};

const RPGCombatTools = {
    CalculateMonsterDamage,
    CalculatePlayerDamage
};

export default RPGCombatTools;
