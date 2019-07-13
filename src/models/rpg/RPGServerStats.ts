import {Document, Schema, model} from 'mongoose';
import {Message} from "discord.js";
import CommandArgs from "../../classes/CommandArgs";


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

export const IsChannelRPGEnabled = (args: CommandArgs): Promise<any> => {
    const serverID = args.message.guild.id;
    const channelID = args.message.channel.id;
    const message = args.message;
    return new Promise((resolve, reject) => {
        FindOrCreateRPGServerStats(serverID)
            .then((rpgServerStats) => {
                const isRPGChannel = rpgServerStats.rpgChannels.includes(channelID);

                if (isRPGChannel) {
                    resolve(true);
                } else {
                    message.react('❌');
                    reject(new Error('Channel is not RPG Enabled'));
                }
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
    pvpProtectionDeaths: number,
    rpgChannels: [number]
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
        type: [Array]
    },
    pvpProtectionDeaths: {
        type: Number,
        default: 0
    }
});

const RPGServerStats = model<IRPGServerStats>('RPGServerStats', RPGServerStatsSchema);
export default RPGServerStats;
