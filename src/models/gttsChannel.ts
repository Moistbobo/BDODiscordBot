import {Document, Schema, model} from 'mongoose';

// Typescript type definition
export interface IGttsChannel extends Document{
    serverID: string,
    channelID: string
}

export const GTTSChannelSchema = new Schema({
    serverID: {
        type: String,
        required: true,
        unique: true
    },
    channelID:{
        type: String
    }
});

const GTTSChannel = model<IGttsChannel>('GTTSChannel', GTTSChannelSchema);
export default GTTSChannel;