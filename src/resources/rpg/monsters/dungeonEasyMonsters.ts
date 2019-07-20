const dungeonEasyMonsters = {
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
        lootChance: 0.2
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
        lootChance: 0.3
    },
    DMON0005:{
        monsterID: 'DMON0005',
        hitpoints: {
            current: 200,
            max: 200
        },
        baseDamage: 20,
        bal: 0.5,
        crit: 0.30,
        critDamageMult: 1.80,
        skills: [],
        dropTableID: 'DEASY_0005',
        lootChance: 0.8
    }
};

export default dungeonEasyMonsters;
