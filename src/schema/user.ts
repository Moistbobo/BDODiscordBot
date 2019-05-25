import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
    id: String,
    ttsCredits: Number,
    kills: Number,
    deaths: Number,
    assists: Number,
    hitpoints: Number,
    chollars: Number
});

export default userSchema;