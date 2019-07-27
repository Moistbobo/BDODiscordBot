import {Document, Schema, model} from 'mongoose';
import Item, {IItem, ItemSchema} from "./Item";

export const DefaultStats = {
    hp: 150,
    str: 1,
    int: 1,
    hpLevel: 0,
    level: 1
};

export const IncrementPerLevel = {
    hp: 10
};

export interface IRPGCharacter extends Document {
    userID: string,
    hitpoints: {
        current: number,
        max: number
    },
    stats: {
        hpLevel: number,
        bal: number,
        str: number,
        int: number,
        crit: number,
        critDmgMult: number
    },
    exp: number,
    title: string,
    kills: number,
    monsterKills: number,
    deaths: number,
    dungeonLevel: number,
    pvpFlagged: boolean
    inventory: [IItem],
    level: number,
    skillPoints: number,
    effects: [
        {
            effectID: string,
            length: number
        }
        ],
    equippedWeapon: IItem
}

export const FindOrCreateNewRPGCharacter = (userID): Promise<any> => {
    return new Promise((resolve, reject) => {
        RPGCharacter.findOne({userID})
            .then((rpgCharacter) => {
                if (!rpgCharacter) {
                    rpgCharacter = new RPGCharacter();
                    rpgCharacter.userID = userID;
                }

                resolve(rpgCharacter);
            })
            .catch((err) => {
                console.log(err.toString());
                reject(new Error('Error retrieving New RPG Character'));
            })
    })
};

export const RPGCharacterSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    hitpoints: {
        max: {
            type: Number,
            default: 150
        },
        current: {
            type: Number,
            default: 150
        }
    },
    stats: {
        hpLevel: {
            type: Number,
            default: 0
        },
        bal: {
            type: Number,
            default: 0.4
        },
        str: {
            type: Number,
            default: 1.00
        },
        int: {
            type: Number,
            default: 1.00
        },
        crit: {
            type: Number,
            default: 0.10
        },
        critDmgMult: {
            type: Number,
            default: 2.5
        }
    },
    title: String,
    kills: {
        type: Number,
        default: 0
    },
    monsterKills: {
        type: Number,
        default: 0
    },
    deaths: {
        type: Number,
        default: 0
    },
    sendAttackedNotification: {
        type: Boolean,
        default: false
    },
    pvpFlagged: {
        type: Boolean,
        default: false
    },
    exp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    skillPoints: {
        type: Number,
        default: 1
    },
    inventory: [ItemSchema],
    equippedWeapon: ItemSchema,
    dungeonLevel: {
        type: Number,
        default: 1,
        required: true
    },
    effects: [
        {
            effectID: String,
            length: Number
        }
    ]
});

const RPGCharacter = model<IRPGCharacter>('RPGCharacter', RPGCharacterSchema);
export default RPGCharacter;
