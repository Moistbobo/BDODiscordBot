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
import gayStrings from "./strings/en/commands/gayStrings";
import helpStrings from "./strings/en/commands/helpStrings";

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
        usage: 'commands',
        ...commandStrings
    },
    general: {
        noPermission: `You do not have permission to use this command`,
        levelUp: `{0} has reached level {1}!`
    },
    rpg: {
        nonRPGChannel: `This channel is not RPG enabled.`
    },
    helloWorld: {
        action: 'hello world!',
        description: 'Says hello world',
        trigger: 'hw,hello',
        usage: 'hello'
    },
    tts: {
        action: '',
        description: 'Makes bot speak a text to speech in the voice channel you are in',
        trigger: 'tts',
        name: 'TTS',
        usage: 'tts [text to speak], tts hello world'
    },
    leave: {
        description: 'Makes bot leave voice channel',
        trigger: 'leave',
        name: 'Leave',
        usage: 'leave'
    },
    googletts: {
        description: 'Makes bot speak text generated using google api',
        trigger: 'gtts',
        name: 'GoogleTTS',
        usage: 'gtts [lang?] [text to speak], gtts hello world, gtts en-US hello world, gtts vi-NH hello world'
    },
    patchnotes: {
        description: 'Retrieve latest BDO patchnotes. If no number is specified then only the latest patchnotes will be retrieved',
        trigger: 'patchnotes,pn',
        name: 'Patch Notes',
        usage:'pn [history?], pn, pn 5'
    },
    value: {
        description: 'Get the value of marketplace items',
        trigger: 'val, value',
        name: 'Value',
        usage: 'val [selling price], val 1600000, val 1.6bil'
    },
    setchannel: {
        description: 'Set a gtts enabled channel',
        trigger: 'sc, setchannel',
        name: 'Set Channel',
        usage: 'sc',
        hidden: true
    },
    alive: {
        description: 'Check if bot is alive',
        trigger: 'alive, a',
        name: 'Alive',
        usage:'a, alive',
        hidden: true
    },
    checkttschannel: {
        description: 'Check the gtts enabled channel on the server',
        trigger: 'checkttschannel, ctc',
        name: 'Check TTS Channel',
        usage: 'ctc'
    },
    suggestmanga: {
        description: 'Suggest a random manga based on genre. If no genre is specified, it will be randomized',
        trigger: 'suggestmanga, sm',
        name: 'Suggest Manga',
        usage: 'sm [genre?] [page?], sm comedy, sm action 20'
    },
    getgenrelist: {
        description: 'Get list of valid anime/manga genres',
        trigger: 'getgenrelist, ggl',
        name: 'Get Genre List',
        usage: 'ggl'
    },
    suggestanime: {
        description: 'Suggest a random anime based on genre. Genre and page values are optional',
        trigger: 'suggestanime, sa',
        name: 'Suggest Anime',
        usage: 'sa [genre?] [page?], sa action 10, sa comedy'
    },
    iqtest: {
        description: 'Check iq of yourself or another user',
        trigger: 'iqtest, iq',
        name: 'IQ Test',
        usage: 'iq [user?], iq, iq @Moistbobo, iq moistbobo'
    },
    attack: {
        description: 'Attack another user. User can be referenced by a mention, username, or discord name',
        trigger: 'att, attack',
        name: 'Attack',
        usage: 'attack [user], attack @Moistbobo, attack Moistbobo',
        ...attackStrings
    },
    status: {
        description: 'Check the RPG stats of the user. If no user is given, then it will return the RPG stats of the author',
        trigger: 'status, stats',
        name: 'Status',
        usage: 'status [user?], status, status @Moistbobo, status Moistbobo',
        ...statusStrings
    },
    respawn: {
        description: 'Respawn if you\'ve been killed',
        trigger: 'respawn',
        name: 'Respawn',
        usage: 'respawn',
        ...respawnStrings
    },
    heal: {
        description: 'Heal yourself or another user. If no user is specified, then the author will self-heal',
        trigger: 'heal',
        name: 'Heal',
        usage: 'heal [user?], heal, heal @Moistbobo, heal moistbobo',
        ...healStrings
    },
    serverstats: {
        description: 'Show accumulated rpg stats for server',
        trigger: 'serverstats',
        name: 'Server Stats',
        usage: 'serverstats',
        ...serverStatStrings
    },
    setrpgchannel: {
        description: '[ADMIN ONLY]\nEnables RPG commands on the channel.',
        trigger: 'setrpgchannel',
        name: 'Set RPG Channel',
        usage: 'setrpgchannel',
        hidden: true,
        ...setRPGChannelStrings
    },
    sendattackednotification: {
        description: 'Have the bot DM you whenever you get attacked',
        trigger: 'sendattackednotification,san',
        name: 'Send Attacked Notifications',
        usage: 'san',
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
        usage: 'inventory',
        ...inventoryStrings
    },
    discarditem: {
        description: 'Discard an item from your inventory. Discard multiple items by specifying multiple indices',
        trigger: 'discard',
        name: 'Discard',
        usage: 'discard [item index one] [item index two] [item index three]..., discard 1 2 3',
        ...discardStrings
    },
    equip: {
        description: 'Equip an item',
        trigger: 'equip',
        name: 'Equip',
        usage: 'equip [item index], equip 1',
        ...equipStrings
    },
    unequipweapon: {
        description: 'Unequip your weapon',
        trigger: 'unequipweapon, uew',
        name: 'Unequip Weapon',
        usage: 'uew',
        ...unequipWeaponStrings
    },
    craftrecipes: {
        description: 'Check all available recipes',
        trigger: 'craftrecipes, cr',
        name: 'Craft Recipes',
        usage: 'cr',
        ...craftRecipeStrings
    },
    craft: {
        description: 'Craft an item according to index. Recipes can be checked using the craftrecipes command',
        trigger: 'craft',
        name: 'Craft',
        usage: 'craft [recipe index], craft 1',
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
        usage: 'rs [search terms]. rs Demon Spear Chogganator',
        ...rpgSearchStrings
    },
    dungeon: {
        description: 'Explore the dungeon and fight monsters. Optional value for dungeon floor if it has been unlocked, otherwise it will default to the highest dungeon floor',
        trigger: 'dungeon, explore',
        name: 'Dungeon',
        usage: 'dungeon [floor?], dungeon, dungeon 1, dungeon 2',
        ...dungeonStrings
    },
    use: {
        description: 'Use an item in your inventory',
        trigger: 'use',
        name: 'Use',
        usage: 'use [item index], use 1',
        ...useStrings
    },
    addSkill: {
        description: 'Use a skillpoint. Defaults to 1 if no amount is specified.',
        trigger: 'addskill, as',
        name: 'Add Skill',
        usage: 'addskill [int/str/hp] [amount?], addskill int, addskill str 5',
        ...addSkillStrings
    },
    resetSkills: {
        description: 'Reset your skill points to 0',
        trigger: 'resetskills',
        name: 'Reset Skill',
        usage: 'resetskills',
        ...resetSkillStrings
    },
    gay: {
        description: 'Calculate how gay the specified user is. Defaults to message sender if no user is specified',
        trigger: 'gay, calcgay, g',
        name: 'Calculate gay',
        usage: 'gay [user?], gay, gay @Moistbobo',
        ...gayStrings
    },
    commandHelp: {
        description: 'Show Additional help for commands',
        trigger: 'chelp, ch, commandhelp',
        name: 'Command Help',
        usage: 'ch [command], ch commandHelp',
        ...helpStrings
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
