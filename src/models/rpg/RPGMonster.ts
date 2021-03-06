import {Document, model, Schema} from 'mongoose';

export interface IRPGMonster extends Document {
    monsterID: string,
    hitpoints: {
        current: number,
        max: number
    },
    baseDamage: number,
    bal: number,
    crit: number,
    critDamageMult: number,
    skills: [string],
    dropTableID: string,
    lootChance: number,
    exp: number
    level:number
}

export const RPGMonsterSchema = new Schema({
    monsterID: {
        type: String,
        unique: true,
        required: true
    },
    hitpoints: {
        current: Number,
        max: Number
    },
    baseDamage: Number,
    bal: Number,
    crit: Number,
    critDamageMult: Number,
    skills: [String],
    dropTableID: String,
    lootChance: {
        type: Number,
        isRequired: true
    },
    exp: {
        type: Number,
        isRequired: true,
        default: 0
    },
    level: Number
});

const RPGMonster = model<IRPGMonster>('RPGMonster', RPGMonsterSchema);
export default RPGMonster;
