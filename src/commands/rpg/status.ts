import CommandArgs from "../../classes/CommandArgs";
import {DefaultStats, FindOrCreateNewRPGCharacter, IncrementPerLevel} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import {FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";
import RPGCharacterManager from "../../tools/rpg/RPGCharacterManager";


const status = (args: CommandArgs) => {

    let userIDToSearch = args.message.author.id;
    let user = args.message.author;
    if (args.message.content) {
        user = args.bot.getFirstMentionedUserID(args.message);
        userIDToSearch = user.id;
    }

    args.startTyping();

    IsChannelRPGEnabled(args)
        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel')
            }
            return Promise.all([FindOrCreateNewRPGCharacter(userIDToSearch), FindOrCreateRPGTimer(userIDToSearch)])
        })
        .then((res) => {
            const rpgCharacter = res[0];
            const rpgTimer = res[1];
            const isAFK = (Date.now() / 1000 - rpgTimer.lastActivity) > Timers.rpg.afkTimer;
            console.log(isAFK);

            const contents = replace(args.strings.status.statusString, [
                    user.username,
                    RPGCharacterManager.CalculatePlayerLevel(rpgCharacter)
                ]
            );

            rpgCharacter.hitpoints.max = DefaultStats.hp + (rpgCharacter.stats.hpLevel * IncrementPerLevel.hp);
            rpgCharacter.hitpoints.current = Math.min(rpgCharacter.hitpoints.current, rpgCharacter.hitpoints.max);

            const weapon = rpgCharacter.equippedWeapon;

            let weaponBalBonus = weapon?weapon.weaponStats.balBonus || 0 : 0;
            let weaponCritBonus = weapon?weapon.weaponStats.critBonus || 0 : 0;
            let weaponCritDamageBonus = weapon?weapon.weaponStats.critDamageBonus || 0:0;


            const balBonusString = weaponBalBonus&&weaponBalBonus>0? ` +(${weaponBalBonus * 100})`:'';
            const critBonusString = weaponCritBonus&&weaponCritBonus>0? ` +(${weaponCritBonus * 100}%)`:'';
            const critDamageBonusString = weaponCritDamageBonus&&weaponCritDamageBonus>0? ` +(${weaponCritDamageBonus * 100}%)`:'';

            const combatStrings = replace(
                args.strings.status.combatStrings,
                [rpgCharacter.hitpoints.current,
                    rpgCharacter.hitpoints.max,
                    `${rpgCharacter.stats.bal * 100}${balBonusString}`,
                    `${rpgCharacter.stats.crit * 100}%${critBonusString}`,
                    `${rpgCharacter.stats.critDmgMult * 100}%${critDamageBonusString}`]
            );

            const expToNextLevel = RPGCharacterManager.CalculateXPNeededForLevel(RPGCharacterManager.CalculatePlayerLevel(rpgCharacter));
            const expStrings = replace(
                args.strings.status.expStrings,
                [
                    rpgCharacter.exp,
                    expToNextLevel,
                    ((rpgCharacter.exp / expToNextLevel) * 100).toPrecision(2)
                ]
            );

            let skillsStrings = replace(
                args.strings.status.skillsStrings,
                [
                    Math.floor(rpgCharacter.stats.hpLevel),
                    Math.floor(rpgCharacter.stats.str),
                    Math.floor(rpgCharacter.stats.int),
                ]
            );

            if (rpgCharacter.skillPoints > 0) {
                skillsStrings +=
                    replace(args.strings.status.skillsStringsUnused,
                        [rpgCharacter.skillPoints])
            }

            const statusStrings = replace(
                args.strings.status.statusStrings,
                [
                    isAFK ? args.strings.status.yes : args.strings.status.no
                ]
            );

            const otherStatsStrings = replace(
                args.strings.status.otherStatsStrings,
                [
                    rpgCharacter.kills,
                    rpgCharacter.deaths,
                    rpgCharacter.monsterKills
                ]
            );

            args.sendOKEmbed(
                {
                    contents,
                    thumbnail: user.avatarURL(),
                    extraFields: [
                        {
                            name: args.strings.status.expTitle,
                            value: expStrings,
                            inline: false
                        },
                        {
                            name: args.strings.status.combatTitle,
                            value: combatStrings + '\n\n',
                            inline: true
                        },
                        {
                            name: args.strings.status.skillsTitle,
                            value: skillsStrings,
                            inline: true
                        },
                        {
                            name: args.strings.status.otherStatsTitle,
                            value: otherStatsStrings + '\n\n',
                            inline: true
                        },
                        {
                            name: args.strings.status.statusTitle,
                            value: statusStrings,
                            inline: true
                        }
                    ]
                });
            args.stopTyping();

            return rpgCharacter.save();
        })
        .catch((err) => {
            console.log(err.toString());
        })
};

export const action = status;
