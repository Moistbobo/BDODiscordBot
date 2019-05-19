import * as Mongoose from 'mongoose';
import ConfigSchema from '../schema/config';
import UserSchema from '../schema/user';

class DatabaseTools {

    /**
     * Initialize database for the bot
     */
    static initDBConnection = (serverID: String) => {
        Mongoose.connect('mongodb://localhost/chobot').then(() => {
            const db = Mongoose.connection;
            const Config = Mongoose.model('Config', ConfigSchema);
            const newConfig = new Config({
                serverID
            });

            db.once('open', () => {
                newConfig.save().then(res=>{
                    console.log('Server config saved');
                })
            });
        });

    }
}