import {Document, Schema, model} from 'mongoose';
import Timers from "../../resources/Timers";

export const FindOrCreateRPGTimer = (userID: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        RPGTimer.findOne({userID})
            .then((rpgTimer) => {
                if (!rpgTimer) {
                    rpgTimer = new RPGTimer();
                    rpgTimer.userID = userID
                }
                resolve(rpgTimer);
            })
            .catch((err) => {
                console.log(err.toString());
                reject(new Error('Error retrieving RPGTimer'));
            })
    })
};

// User is dead if now - deathTime is less than the death timer
export const CheckCanRespawn = (lastDeathTime) =>{
  const now = Date.now()/1000;
  return (now - lastDeathTime) < Timers.rpg.deathCD;
};

export const CanAttackAgain = (lastAttackTime) =>{
    const now = Date.now()/1000;
    return (now - lastAttackTime) > Timers.rpg.attackCD;
};

export const CanHeal = (lastHealTime) =>{
    const now = Date.now()/1000;
    return (now - lastHealTime) > Timers.rpg.healCD;
};

export interface IRPGTimer extends Document {
    userID: string,
    lastAttack: number,
    lastDeath: number,
    lastHeal: number,
    lastActivity: number
}

export const RPGTimerSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    lastAttack: {
        type: Number,
        default: 0
    },
    lastDeath: {
        type: Number,
        default: 0
    },
    lastHeal:{
        type:Number,
        default: 0
    },
    lastActivity:{
        type:Number,
        default:0
    }
});

const RPGTimer = model<IRPGTimer>('RPGTimer', RPGTimerSchema);
export default RPGTimer;
