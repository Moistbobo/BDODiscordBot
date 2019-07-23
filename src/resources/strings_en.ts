import attackStrings from "./strings/en/commands/attackStrings";
import statusStrings from "./strings/en/commands/statusStrings";
import healStrings from "./strings/en/commands/healStrings";
import respawnStrings from "./strings/en/commands/respawnStrings";
import serverStatStrings from "./strings/en/commands/serverStatsStrings";
import setRPGChannelStrings from "./strings/en/commands/setRPGChannelStrings";
import sendAttackedNotificationStrings from "./strings/en/commands/sendAttackedNotificationStrings";
import flagStrings from "./strings/en/commands/flagStrings";
import commandStrings from "./strings/en/commands/commandStrings";
import OneRarityWeaponStrings from "./strings/en/items/weapons/1_rarityStrings";
import inventoryStrings from "./strings/en/commands/inventoryStrings";
import discardStrings from "./strings/en/commands/discardStrings";
import equipStrings from "./strings/en/commands/equipStrings";
import unequipWeaponStrings from "./strings/en/commands/unequipWeaponStrings";
import ThreeRarityWeaponStrings from "./strings/en/items/weapons/3_rarityStrings";
import MaterialStrings from "./strings/en/items/materialStrings";
import RecipeStrings from "./strings/en/items/recipeStrings";
import craftRecipeStrings from "./strings/en/commands/craftRecipeStrings";
import craftStrings from "./strings/en/commands/craftStrings";
import enableItemDropStrings from "./strings/en/commands/enableItemDropStrings";
import OnMessageItemDropStrings from "./strings/en/events/onMessageItemDropStrings";
import rpgSearchStrings from "./strings/en/commands/rpgSearchStrings";
import dungeonMonsterStrings from "./strings/en/monsters/dungeonMonsterStrings";
import dungeonStrings from "./strings/en/commands/dungeonStrings";
import ConsumableStrings from "./strings/en/items/consumableStrings";
import useStrings from "./strings/en/commands/useStrings";
import addSkillStrings from "./strings/en/commands/addSkillStrings";
import resetSkillStrings from "./strings/en/commands/resetSkillStrings";

const strings = {
    items: {
        ...OneRarityWeaponStrings,
        ...ThreeRarityWeaponStrings,
        ...MaterialStrings,
        ...ConsumableStrings
    },
    monsters: {
        ...dungeonMonsterStrings
    },
    recipes: {
        ...RecipeStrings,
    },
    ...OnMessageItemDropStrings,
    error: 'String not found',
    commands: {
        description: 'Show list of commands',
        trigger: 'commands, scs',
        name: 'commands',
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
        name: 'Alive',
        hidden: true
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
    createitem: {
        description: 'Create an item',
        trigger: 'createitem',
        name: 'Create Item',
        hidden: true
    },
    inventory: {
        description: 'Check your inventory',
        trigger: 'inventory',
        name: 'Inventory',
        ...inventoryStrings
    },
    discarditem: {
        description: 'Discard an item from your inventory',
        trigger: 'discard',
        name: 'Discard',
        ...discardStrings
    },
    equip: {
        description: 'Equip an item',
        trigger: 'equip',
        name: 'Equip',
        ...equipStrings
    },
    unequipweapon: {
        description: 'Unequip your weapon',
        trigger: 'unequipweapon, uew',
        name: 'Unequip Weapon',
        ...unequipWeaponStrings
    },
    craftrecipes: {
        description: 'Check all available recipes',
        trigger: 'craftrecipes, cr',
        name: 'Craft Recipes',
        ...craftRecipeStrings
    },
    craft: {
        description: 'Craft an item according to index',
        trigger: 'craft',
        name: 'Craft',
        ...craftStrings
    },
    enableitemdrops: {
        description: 'Enable item drop for a channel',
        trigger: 'eid, enableitemdrops',
        name: 'Enable Item Drops',
        hidden: true,
        ...enableItemDropStrings
    },
    rpgsearch: {
        description: 'Look up an entity in RPG mode',
        trigger: 'rs, rpgsearch',
        name: 'RPG Search',
        ...rpgSearchStrings
    },
    dungeon: {
        description: 'Explore the dungeon and fight monsters',
        trigger: 'dungeon, explore',
        name: 'Dungeon',
        ...dungeonStrings
    },
    use: {
        description: 'Use an item in your inventory',
        trigger: 'use',
        name: 'Use',
        ...useStrings
    },
    addSkill: {
        description: 'Use a skillpoint',
        trigger: 'addskill, as',
        name: 'Add Skill',
        ...addSkillStrings
    },
    resetSkills:{
        description: 'Reset your skill points to 0',
        trigger: 'resetskills',
        name: 'Reset Skill',
        ...resetSkillStrings
    }
    // flag: {
    //     description: 'Enable/Disable PVP mode',
    //     trigger: 'flag,f,pvp',
    //     name: 'Flag',
    //     ...flagStrings
    // }
    // manga: {
    //     description: 'Get information for a single manga',
    //     trigger: 'manga, m'
    // }
};


export const Strings = strings;
