const DamageCalculation = (str: number, bal: number, equipment = 20, otherBonuses = 1.0) => {
    const maxDamage = CalcMaxDamage(str, equipment, otherBonuses);
    const balanceMod = getRandomArbitrary(bal, 1.0);

    return parseFloat((maxDamage * balanceMod).toFixed(0));
};

const HealCalculation = (int:number, bal:number, equipment= 10, otherBonuses=1.0) =>{
  const maxHeal = CalcMaxHeal(int, equipment, otherBonuses);
  const balanceMod = getRandomArbitrary(bal, 1.5);

  return parseFloat((maxHeal * balanceMod).toFixed(0));
};

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};

const CalcMaxDamage = (str: number, equip: number, otherBonuses: number) => {
    const baseConstant = 5;
    const baseLog = 1.5;

    return baseConstant * (Math.log(equip * str) / Math.log(baseLog));
};

const CalcMaxHeal = (int: number, equip:number, otherBonuses: number)=>{
    const baseConstant = 5;
    const baseLog = 2;

    return baseConstant * (Math.log(equip * int) / Math.log(baseLog));
};

const RPGTools = {
    CalcMaxDamage,
    DamageCalculation,
    CalcMaxHeal,
    HealCalculation
};

export default RPGTools;
