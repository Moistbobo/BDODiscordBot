const callDecTalk = (textToSpeak:string, serverID: string) => {
    return new Promise((resolve)=>{
        const execFile = require('child_process').execFile;
        execFile('./say.exe', ['-w', `./dectalk/${serverID}.wav`, textToSpeak], (err, stdout, sterr)=>{
            console.log('[CALLDECTALK FUNCTION]');
            console.log(err);
            console.log(stdout);
            console.log(sterr);

            resolve(serverID);
        });

    });
};

export default callDecTalk;