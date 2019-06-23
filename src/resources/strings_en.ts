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
    }
};

export const Strings = strings;