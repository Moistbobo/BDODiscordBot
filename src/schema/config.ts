import * as mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
    serverID: {type: String, unique: true, dropDups: true, required: true},
    ttsRoles: [String],
    censoredWords: [String],
    warChannels: [{
        name: String,
        channel: String
    }]
});

export default configSchema;