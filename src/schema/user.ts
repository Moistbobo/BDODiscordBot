import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
    ttsCredits: Number,
    kills: Number,
    deaths: Number,
    assists: Number,
    hitpoints: Number
});

export default userSchema;