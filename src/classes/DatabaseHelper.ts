import ConfigSchema from '../schema/config';
import * as Mongoose from 'mongoose';
class DatabaseHelper {
    constructor(){
        Mongoose.connect('mongodb://localhost/dectalkbot').then(res=>{
            console.log('Connected to db');
        });
    }

    createNewConfig = (serverID: String) =>{
        const db = Mongoose.connection;
        const Config = Mongoose.model('Config', ConfigSchema);
        const newConfig = new Config({
            serverID
        });

        db.once('open', ()=>{
            newConfig.save().then(res=>{
                console.log(res);
                console.log('Saved new config');
            });
        });
    };

    onError = (err) =>{
        console.error(err);
    };

}

export default DatabaseHelper;