const dungeonEasyMonsters = {
    DMON0001: {
        monsterID: 'DMON0001',
        hitpoints: {
            current: 45,
            max: 45
        },
        baseDamage: 10,
        bal: 0.2,
        crit: 0.05,
        critDamageMult: 2.5,
        skills: [],
        dropTableID: 'DEASY_0001',
        lootChance: 0.2
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
