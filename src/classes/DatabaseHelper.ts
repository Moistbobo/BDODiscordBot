import ServerSchema from '../schema/config';
import UserSchema from '../schema/user';
import * as Mongoose from 'mongoose';

class DatabaseHelper {
    constructor() {
        Mongoose.connect('mongodb://localhost/dectalkbot').then(res => {
            console.log('Connected to db');
        });
    }

    createNewConfig = (serverID: String) => {
        const db = Mongoose.connection;
        const ServerDBO = Mongoose.model('Server', ServerSchema);
        const serverConfig = new ServerDBO({
            id: serverID
        });

        db.once('open', () => {
            serverConfig.save().then(res => {
                console.log(res);
                console.log('Saved new config');
            });
        });
    };

    retrieveUserData = (userID: String) => {
        const UserDBO = Mongoose.model('User', UserSchema);

        return new Promise(resolve => {
            UserDBO.find({id: userID}, (error, user) => {
                console.log(user);
                resolve(user);
            })
        })
    };

    createUserData = (userID: String) => {
        const UserDBO = Mongoose.model('User', UserSchema);

        UserDBO.create({id: userID, hitpoints: 100}, (err, res) => {
            if (err) console.error(err);
            console.log(res);
            console.log('Created new user');
        })
    };

    onError = (err) => {
        console.error(err);
    };

}

export default DatabaseHelper;