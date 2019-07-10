import attackStrings from "./strings/attack";
import statusStrings from "./strings/status";
import healStrings from "./strings/heal";
import respawnStrings from "./strings/respawn";
import serverStatStrings from "./strings/serverStats";
import setRPGChannelStrings from "./strings/setRPGChannel";
import sendAttackedNotificationStrings from "./strings/sendAttackedNotification";
import flagStrings from "./strings/flag";

const strings = {
    general:{
        noPermission: `You do not have permission to use this command`
    },
    rpg:{
        nonRPGChannel: `This channel is not RPG enabled.`
    },
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
    leave: {
        description: 'Makes bot leave voice channel',
        trigger: 'leave'
    },
    googletts: {
        description: 'Makes bot speak text generated using google api',
        trigger: 'gtts'
    },
    CreateNewServerConfig: {
        description: 'Create a new config on the db for the current server',
        trigger: 'createnewserverconfig,cnsc,csc'
    },
    patchnotes: {
        description: 'Retrieve latest BDO patchnotes',
        trigger: 'patchnotes,pn'
    },
    value: {
        description: 'Get the value of marketplace items',
        trigger: 'val, value'
    },
    setchannel: {
        description: 'Set a gtts enabled channel',
        trigger: 'sc, setchannel'
    },
    alive: {
        description: 'Check if bot is alive',
        trigger: 'alive, a'
    },
    checkttschannel: {
        description: 'Check the gtts enabled channel on the server',
        trigger: 'checkttschannel, ctc'
    },
    suggestmanga: {
        description: 'Suggest a random manga based on genre. If no genre is specified, it will be randomized',
        trigger: 'suggestmanga, sm'
    },
    getgenrelist: {
        description: 'Get list of valid genres',
        trigger: 'getgenrelist, ggl'
    },
    suggestanime: {
        description: 'Suggest a random anime based on genre',
        trigger: 'suggestanime, sa'
    },
    iqtest: {
        description: 'Check your iq',
        trigger: 'iqtest, iq'
    },
    attack: {
        description: 'Attack another user',
        trigger: 'att, attack',
        ...attackStrings
    },
    status: {
        description: 'Check your RPG stats',
        trigger: 'status, stats',
        ...statusStrings
    },
    respawn: {
        description: 'Respawn if you\'ve been killed',
        trigger: 'respawn',
        ...respawnStrings
    },
    rpghelp:{
        description: 'Temp placeholder for rpg commands',
        trigger: 'rpghelp'
    },
    heal:{
        description: 'RNG Heal',
        trigger: 'heal',
        ...healStrings
    },
    serverstats:{
        description: 'Show accumulated rpg stats for server',
        trigger: 'serverstats',
        ...serverStatStrings
    },
    setrpgchannel:{
        description: 'Enables RPG commands on the channel',
        trigger: 'setrpgchannel',
        ...setRPGChannelStrings
    },
    sendattackednotification:{
        description: 'Have the bot DM you whenever you get attacked',
        trigger: 'sendattackednotification,san',
        ...sendAttackedNotificationStrings
    },
    flag:{
        description: 'Enable/Disable PVP mode',
        trigger: 'flag,f,pvp',
        ...flagStrings
    }
    // manga: {
    //     description: 'Get information for a single manga',
    //     trigger: 'manga, m'
    // }
};


export const Strings = strings;
