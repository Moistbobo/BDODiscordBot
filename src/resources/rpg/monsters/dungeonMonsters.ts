const dungeonMonsters = {
    DMON0001: {
        monsterID: 'DMON0001',
        hitpoints: {
            current: 60,
            max: 60
        },
        baseDamage: 10,
        bal: 0.2,
        crit: 0.05,
        critDamageMult: 2.5,
        skills: [],
        dropTableID: 'DEASY_0001',
        lootChance: 0.2,
        strLevelChanceMod: 2.5,
        playerStrCapThreshold: 3,
        exp: 15
    },
    DMON0002:{
      monsterID: 'DMON0002',
      hitpoints: {
          current: 40,
          max: 40
      },
        baseDamage: 20,
        bal: 0.1,
        crit: 0.55,
        critDamageMult: 4.0,
        skills: [],
        dropTableID: 'DEASY_0002',
        lootChance: 0.3,
        strLevelChanceMod: 3.5,
        playerStrCapThreshold: 6,
        exp: 25
    },
    DMON0003:{
        monsterID: 'DMON0003',
        hitpoints: {
            current: 80,
            max: 80
        },
        baseDamage: 50,
        bal: 0.4,
        crit: 0.01,
        critDamageMult: 10.0,
        skills: [],
        dropTableID: 'DEASY_0003',
        lootChance: 0.3,
        strLevelChanceMod: 3.5,
        playerStrCapThreshold: 6,
        exp: 30
    },
    DMON0005:{
        monsterID: 'DMON0005',
        hitpoints: {
            current: 200,
            max: 200
        },
        baseDamage: 30,
        bal: 0.8,
        crit: 0.50,
        critDamageMult: 1.80,
        skills: [],
        dropTableID: 'DEASY_0005',
        lootChance: 0.8,
        strLevelChanceMod: 10,
        playerStrCapThreshold: 10,
        exp: 50
    },
    DMON00010:{
        monsterID: 'DMON00010',
        hitpoints: {
            current: 300,
            max: 300
        },
        baseDamage: 40,
        bal: 0.5,
        crit: 0.15,
        critDamageMult: 1.80,
        skills: [],
        dropTableID: '',
        lootChance: 0.8,
        strLevelChanceMod: 10,
        playerStrCapThreshold: 10,
        exp: 40
    }
};

export default dungeonMonsters;
