import attackStrings from "./strings/attack";
import statusStrings from "./strings/status";
import healStrings from "./strings/heal";
import respawnStrings from "./strings/respawn";
import serverStatStrings from "./strings/serverStats";
import setRPGChannelStrings from "./strings/setRPGChannel";
import sendAttackedNotificationStrings from "./strings/sendAttackedNotification";
import flagStrings from "./strings/flag";
import commandStrings from "./strings/commandStrings";

const strings = {
    commands: {
        description: 'Show list of commands',
        trigger: 'commands, scs',
        name: 'Commands',
        ...commandStrings
    },
    general: {
        noPermission: `You do not have permission to use this command`
    },
    rpg: {
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
        trigger: 'tts',
        name: 'TTS'
    },
    leave: {
        description: 'Makes bot leave voice channel',
        trigger: 'leave',
        name: 'Leave'
    },
    googletts: {
        description: 'Makes bot speak text generated using google api',
        trigger: 'gtts',
        name: 'GoogleTTS'
    },
    patchnotes: {
        description: 'Retrieve latest BDO patchnotes',
        trigger: 'patchnotes,pn',
        name: 'Patch Notes'
    },
    value: {
        description: 'Get the value of marketplace items',
        trigger: 'val, value',
        name: 'Value'
    },
    setchannel: {
        description: 'Set a gtts enabled channel',
        trigger: 'sc, setchannel',
        name: 'Set Channel'
    },
    alive: {
        description: 'Check if bot is alive',
        trigger: 'alive, a',
        name: 'Alive'
    },
    checkttschannel: {
        description: 'Check the gtts enabled channel on the server',
        trigger: 'checkttschannel, ctc',
        name: 'Check TTS Channel'
    },
    suggestmanga: {
        description: 'Suggest a random manga based on genre. If no genre is specified, it will be randomized',
        trigger: 'suggestmanga, sm',
        name: 'Suggest Manga'
    },
    getgenrelist: {
        description: 'Get list of valid anime/manga genres',
        trigger: 'getgenrelist, ggl',
        name: 'Get Genre List'
    },
    suggestanime: {
        description: 'Suggest a random anime based on genre',
        trigger: 'suggestanime, sa',
        name: 'Suggest Anime'
    },
    iqtest: {
        description: 'Check your iq',
        trigger: 'iqtest, iq',
        name: 'IQ Test'
    },
    attack: {
        description: 'Attack another user',
        trigger: 'att, attack',
        name: 'Attack',
        ...attackStrings
    },
    status: {
        description: 'Check your RPG stats',
        trigger: 'status, stats',
        name: 'Status',
        ...statusStrings
    },
    respawn: {
        description: 'Respawn if you\'ve been killed',
        trigger: 'respawn',
        name: 'Respawn',
        ...respawnStrings
    },
    heal: {
        description: 'RNG Heal',
        trigger: 'heal',
        name: 'Heal',
        ...healStrings
    },
    serverstats: {
        description: 'Show accumulated rpg stats for server',
        trigger: 'serverstats',
        name: 'Server Stats',
        ...serverStatStrings
    },
    setrpgchannel: {
        description: 'Enables RPG commands on the channel',
        trigger: 'setrpgchannel',
        name: 'Set RPG Channel',
        ...setRPGChannelStrings
    },
    sendattackednotification: {
        description: 'Have the bot DM you whenever you get attacked',
        trigger: 'sendattackednotification,san',
        name: 'Send Attacked Notifications',
        ...sendAttackedNotificationStrings
    },
    flag: {
        description: 'Enable/Disable PVP mode',
        trigger: 'flag,f,pvp',
        name: 'Flag',
        ...flagStrings
    }
    // manga: {
    //     description: 'Get information for a single manga',
    //     trigger: 'manga, m'
    // }
};


export const Strings = strings;
