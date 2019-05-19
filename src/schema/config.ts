import * as mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
    id: {type: String, unique: true, dropDups: true, required: true},
    ttsRoles: [String],
    censoredWords: [String],
    warChannels: [{
        channelID: String,
        warRoleID: [String]
    }]
});

export default serverSchema;