import * as Mongoose from 'mongoose';
const dbURI = 'mongodb://localhost/chobot';

class DatabaseTools {

    /**
     * Initialize database for the bot
     */
    static connectToMongoDB = () => {
        Mongoose.connect(dbURI,
            {
                useNewUrlParser: true,
                useCreateIndex: true
            }).then(() => {
     console.log('Connected to internal mongodb')
        });
    };
}

export default DatabaseTools;