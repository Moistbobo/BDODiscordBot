import * as mongoose from 'mongoose';
import ConfigSchema from '../schema/config';

const Config = mongoose.model('Config', ConfigSchema);

mongoose.connect('mongodb://localhost/configTest', {useNewUrlParser:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
   console.log('Connected to db');
   const newConfig = new Config({
       serverID: '123',
       ttsRoles: ['1','2','3', '4'],
       censoredWords : ['I am a bad word']
   });

   // newConfig.save((err, newConfig)=>{
   //     if(err) return console.error(err);
   //     console.log('Saved');
   //     console.log(newConfig);
   // });

    const searchConfig = new Config({
        serverID: '123'
    });
    Config.find({serverID: '123'}, (err, res)=>{
        console.log(res);
    })
});