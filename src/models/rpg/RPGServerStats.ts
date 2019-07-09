import {Document, Schema, model} from 'mongoose';


export const FindOrCreateRPGServerStats = (serverID: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        RPGServerStats.findOne({serverID})
            .then((rpgServerStats) => {
                if (!rpgServerStats) {
                    rpgServerStats = new RPGServerStats();
                    rpgServerStats.serverID = serverID
                }
                resolve(rpgServerStats);
            })
            .catch((err) => {
                console.log(err.toString());
                reject(new Error('Error retrieving RPGTimer'));
            })
    })
};

export const IsChannelRPGEnabled = (serverID: string, channelID: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        FindOrCreateRPGServerStats(serverID)
            .then((rpgServerStats) => {
                resolve(rpgServerStats.rpgChannels.includes(channelID));
            })
            .catch((err) => {
                console.log(err.toString());
                reject(new Error('Error retrieving rpg server stats'));
            })
    });
};

export interface IRPGServerStats extends Document {
    serverID: string,
    attacks: number,
    heals: number,
    deaths: number,
    rpgChannels: number[]
}

export const RPGServerStatsSchema = new Schema({
    serverID: {
        type: String,
        required: true,
        unique: true
    },
    attacks: {
        type: Number,
        default: 0
    },
    heals: {
        type: Number,
        default: 0
    },
    deaths: {
        type: Number,
        default: 0
    },
    rpgChannels: {
        type: Array
    }
});

const RPGServerStats = model<IRPGServerStats>('RPGServerStats', RPGServerStatsSchema);
export default RPGServerStats;
