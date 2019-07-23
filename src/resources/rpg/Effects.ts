export const effectActions = ['heal', 'buff'];
export const healType = ['percentage', 'static'];
export const buffType = ['str', 'int', 'staticDamage'];

const Effects = [
    {
        effectID: "EFF0001",
        effect: {
            action: effectActions[0],
            effectType: healType[0],
            value: 0.25,
            length: 0
        },
        note: 'Heal user 25%',
    },
    {
        effectID: 'EFF0002',
        effect:{
            action: effectActions[1],
            effectType: buffType[0],
            value: 100,
            length: 1
        },
        note: 'Buff user Strength by 100'
    },
    {
        effectID: 'EFF0003',
        effect:{
            action: effectActions[1],
            effectType: buffType[1],
            value: 50,
            length: 1
        },
        note: 'Buff user Int by 100'
    }
];

export default Effects;
