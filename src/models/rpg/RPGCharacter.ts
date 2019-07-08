import {Document, Schema, model} from 'mongoose';

export interface IRPGCharacter extends Document{
    userID: string,
    hitpoints:{
        current: number,
        max:number
    },
    kills: number,
    deaths: number
}

export const FindOrCreateNewRPGCharacter = (userID):Promise<any>=>{
    return new Promise((resolve, reject)=>{
        RPGCharacter.findOne({userID})
            .then((rpgCharacter)=>{
                if(!rpgCharacter){
                    rpgCharacter = new RPGCharacter();
                    rpgCharacter.userID = userID;
                }

                resolve(rpgCharacter);
            })
            .catch((err)=>{
                console.log(err.toString());
                reject(new Error('Error retrieving New RPG Character'));
            })
    })
}

export const RPGCharacterSchema = new Schema({
    userID:{
        type:String,
        required: true,
        unique: true
    },
    hitpoints:{
        max:{
            type: Number,
            default: 100
        },
        current:{
            type: Number,
            default: 100
        }
    },
    kills:{
        type: Number,
        default: 0
    },
    deaths: {
        type: Number,
        default: 0
    }
});

const RPGCharacter = model<IRPGCharacter>('RPGCharacter', RPGCharacterSchema);
export default RPGCharacter;
