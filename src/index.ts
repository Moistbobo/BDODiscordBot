import * as token from './token.json'
import * as config from './config.json'

// const baseString = 'hello {0} my name is {1} and i am here to {2}';
// const values = ['everyone', 'bob' , 'destroy everyone and all '];
// console.log(replace(baseString, values));
//
// console.log('hello world');
//
// Dectalk(replace(baseString, values), '1235');

import Bot from './classes/Bot';

const bot = new Bot('.',token.token, config);