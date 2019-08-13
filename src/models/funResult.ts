import {Document, Schema, model} from 'mongoose';
import GayResult from "./gayResult";

export const FindOrCreateNewFunResult = (userID: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        FunResult.findOne({userID})
            .then((res) => {
                if (!res) {
                    res = new FunResult();
                    res.userID = userID;
                }

                resolve(res);
            })
            .catch((err)=>{
                console.log(err.toString());
                reject(new Error('Error retrieving Fun Result for user'));
            })
    })
};

export interface IFunObject extends Document {
    lastUpdate: number,
    value: number
}

export interface IFunResult extends Document {
    userID: string,
    gay: IFunObject,
    iq: IFunObject,
    racist: IFunObject
}

export const FunObjectSchema = new Schema({
    lastUpdate: {
        type: Number,
        default: 0,
        required: true
    },
    value: Number
});

const defaultFunObject = {
    lastUpdate: 0
}

export const FunResultSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    gay: {
        type: FunObjectSchema,
        default: defaultFunObject,
    },
    iq: {
        type: FunObjectSchema,
        default: defaultFunObject
    },
    racist: {
        type: FunObjectSchema,
        default: defaultFunObject
    }
});

const FunResult = model<IFunResult>('FunResult', FunResultSchema);
export default FunResult;