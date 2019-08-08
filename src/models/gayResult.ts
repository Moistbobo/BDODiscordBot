import {Document, Schema, model} from 'mongoose';

export const FindOrCreateNewGayResult = (userID: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        GayResult.findOne({userID})
            .then((gayResult) => {
                if (!gayResult) {
                    gayResult = new GayResult();
                    gayResult.userID = userID;
                    gayResult.lastUpdate = 0;
                }
                resolve(gayResult);
            })
            .catch((err)=>{
                console.log(err.toString());
                reject(new Error('Error retrieving Gay Result for user'));
            })
    })
};

export interface IGayResult extends Document {
    userID: string,
    lastUpdate: number,
    gay: number
};

export const GayResultSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    lastUpdate: Number,
    iq: Number,
    gay: Number
});

const GayResult = model<IGayResult>('GayResult', GayResultSchema);
export default GayResult;