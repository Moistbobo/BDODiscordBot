export const effectActions = ['heal', 'buff'];
export const effectType = ['percentage', 'static'];

const Effects = [
    {
        effectID: "EFF0001",
        effect: {
            action: effectActions[0],
            effectType: effectType[0],
            value: 0.25
        },
        note: 'Heal user 25%',
    }
];

export default Effects;
