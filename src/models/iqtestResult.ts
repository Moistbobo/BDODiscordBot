import {Document, Schema, model} from 'mongoose';

export interface IIQTestResult extends Document{
    userID: string,
    lastUpdate: number, //unix time of last update
    iq:number
};

export const IQTestResultSchema = new Schema({
    userID:{
        type: String,
        required: true,
        unique: true
    },
    lastUpdate:{
        type: Number
    },
    iq:{
        type:Number
    }
});

const IQTestResult = model<IIQTestResult>('IQTestResult', IQTestResultSchema);
export default IQTestResult;