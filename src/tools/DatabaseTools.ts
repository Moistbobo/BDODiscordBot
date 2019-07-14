import Mongoose from 'mongoose';

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

    static connectToMongoDBPromise = () => {
        return new Promise((resolve, reject) => {

            Mongoose.connect(dbURI,
                {
                    useNewUrlParser: true,
                    useCreateIndex: true
                }).then(() => {
                resolve(true);
            }).catch((err) => {
                reject(new Error('Error connecting to database'))
            })
        });
    }
}

export default DatabaseTools;
