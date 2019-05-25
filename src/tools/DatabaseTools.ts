import * as Mongoose from 'mongoose';
import ConfigSchema from '../schema/config';
import UserSchema from '../schema/user';

const dbURI = 'mongodb://localhost/chobot';
const Config = Mongoose.model('ServerConfig', ConfigSchema);
const User = Mongoose.model('User', UserSchema);

class DatabaseTools {


    /**
     * Initialize database for the bot
     */
    static createNewServer = (serverID: String) => {
        Mongoose.connect(dbURI).then(() => {
            const db = Mongoose.connection;
            db.once('open', () => {
                const newConfig = new Config({
                    serverID
                });

                newConfig.save().then(res => {
                    console.log('Server config saved');
                });
            });
        });
    };

    static createNewUser = (userID: String) => {
        Mongoose.connect(dbURI).then(() => {
            const db = Mongoose.connection;
            db.once('open', () => {
                const newUser = new User({
                    id: userID,
                    ttsCredits: 0,
                    kills: 0,
                    deaths: 0,
                    assists: 0,
                    hitpoints: 0,
                    chollars: 0
                });

                newUser.save().then(res => {
                    console.log('New user saved');
                    console.log(newUser);
                });
            });
        });
    }
}

export default DatabaseTools;