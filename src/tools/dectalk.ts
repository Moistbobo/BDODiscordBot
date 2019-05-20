const Dectalk = (textToSpeak:string, serverID: string) => {
    return new Promise((resolve)=>{
        console.log(process.platform);
        if(process.platform === 'linux'){
            const exec = require('child_process').exec;

            exec(`DISPLAY=:0.0 wine ./say.exe -w ./dectalk/${serverID}.wav "${textToSpeak}"`, (err, stdout, sterr)=>{
                console.log('[CALLDECTALK FUNCTION]');
                console.log(err);
                console.log(stdout);
                console.log(sterr);

                resolve(serverID);
            })

        }else if (process.platform === 'win32'){
            const execFile = require('child_process').execFile;
            execFile('./say.exe', ['-w', `./dectalk/${serverID}.wav`, textToSpeak], (err, stdout, sterr)=>{
                console.log('[CALLDECTALK FUNCTION]');
                console.log(err);
                console.log(stdout);
                console.log(sterr);

                resolve(serverID);
            });
        }


    });
};

export default Dectalk;