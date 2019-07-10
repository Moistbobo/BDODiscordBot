import {Document, Schema, model} from 'mongoose';

export interface IRPGCharacter extends Document {
    userID: string,
    hitpoints: {
        current: number,
        max: number
    },
    stats: {
        bal: number,
        str: number,
        int: number,
        crit: number,
        critDmgMult: number
    },
    title: string,
    kills: number,
    deaths: number,
    pvpFlagged: boolean
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
}

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
    }
});

const RPGCharacter = model<IRPGCharacter>('RPGCharacter', RPGCharacterSchema);
export default RPGCharacter;
