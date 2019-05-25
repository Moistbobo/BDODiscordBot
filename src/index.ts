import * as config from './config.json'

import Bot from './classes/Bot';

!process.env.bobobotToken ? console.log('Make sure bobobotToken exists in your system variables.\n' +
    'If running from docker, set the -e bobobotToken=$[YOUR_TOKEN_HERE]') :
    console.log('Logging into token:\n', process.env.bobobotToken);
const bot = new Bot('.', process.env.bobobotToken, config);
