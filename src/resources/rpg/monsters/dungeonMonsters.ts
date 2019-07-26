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
        exp: 50,
        level: 3
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
        lootChance: 0.35,
        strLevelChanceMod: 3.5,
        playerStrCapThreshold: 6,
        exp: 80,
        level: 5
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
        lootChance: 0.4,
        exp: 80,
        level: 8
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
        exp: 250,
        level: 10
    },
    DMON0200:{
        monsterID: 'DMON0200',
        hitpoints: {
            current: 150,
            max: 150
        },
        baseDamage: 40,
        bal: 0.5,
        crit: 0.15,
        critDamageMult: 1.80,
        skills: [],
        dropTableID: 'D2_MOB1',
        lootChance: 1,
        exp: 400
    },
    DMON0201:{
        monsterID: 'DMON0201',
        hitpoints:{
            current: 100,
            max: 100
        },
        baseDamage:30,
        bal: 0.5,
        crit: 0.05,
        critDamageMult: 1.80,
        skills: [],
        dropTableID: 'D2_MOB1',
        lootChance: 1,
        exp: 360
    },
    DMON0202:{
        monsterID: 'DMON0202',
        hitpoints:{
            current: 200,
            max: 200
        },
        baseDamage: 30,
        bal: 0.4,
        crit:0.10,
        critDamageMult: 1.8,
        skills: [],
        dropTableID: 'D2_MOB1',
        lootChance: 1,
        exp: 450
    },
    DMON0210:{
        monsterID: 'DMON0210',
        hitpoints:{
            current: 400,
            max: 400
        },
        baseDamage: 40,
        bal: 0.6,
        crit:0.10,
        critDamageMult: 2.5,
        skills: [],
        dropTableID: 'D2_BOSS',
        lootChance: 0.6,
        exp: 800
    }
};

export default dungeonMonsters;
