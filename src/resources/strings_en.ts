const strings = {
    helloWorld: {
        action: 'hello world!',
        description: 'Says hello world',
        trigger: 'hw,hello'
    },
    tts: {
        action: '',
        description: 'Makes bot speak a text to speech in the voice channel you are in',
        trigger: 'tts'
    },
    leave:{
        description: 'Makes bot leave voice channel',
        trigger: 'leave'
    },
    googletts:{
        description: 'Makes bot speak text generated using google api',
        trigger: 'gtts'
    },
    CreateNewServerConfig:{
        description: 'Create a new config on the db for the current server',
        trigger: 'createnewserverconfig,cnsc,csc'
    },
    patchnotes:{
        description: 'Retrieve latest BDO patchnotes',
        trigger: 'patchnotes,pn'
    },
    value:{
        description: 'Get the value of marketplace items',
        trigger: 'val, value'
    },
    setchannel:{
        description: 'Set a gtts enabled channel',
        trigger: 'sc, setchannel'
    },
    alive:{
        description: 'Check if bot is alive',
        trigger: 'alive, a'
    },
    checkttschannel:{
        description: 'Check the gtts enabled channel on the server',
        trigger: 'checkttschannel, ctc'
    },
    suggestmanga:{
        description: 'Suggest a random manga based on genre. If no genre is specified, it will be randomized',
        trigger: 'suggestmanga, sm'
    }
};

export const Strings = strings;