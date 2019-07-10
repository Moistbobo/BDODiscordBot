const DamageCalculation = (str: number, bal: number, equipment = 20, otherBonuses = 1.0) => {
    const maxDamage = CalcMaxDamage(str, equipment, otherBonuses);
    const balanceMod = getRandomArbitrary(bal, 1.0);

    return Math.floor((maxDamage * balanceMod));
};

const HealCalculation = (int:number, bal:number, equipment= 10, otherBonuses=1.0) =>{
  const maxHeal = CalcMaxHeal(int, equipment, otherBonuses);
  const balanceMod = getRandomArbitrary(bal, 1.5);

  return Math.floor((maxHeal * balanceMod));
};

const getRandomArbitrary = (min:number, max:number):number => {
    return Math.random() * (max - min) + min;
};

const getRandomIntegerFrom = (max:number):number=>{
    return Math.floor(Math.random() * max);
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
    HealCalculation,
    getRandomIntegerFrom
};

export default RPGTools;
