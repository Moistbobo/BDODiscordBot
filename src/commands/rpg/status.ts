import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
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

            const combatStrings = replace(
                args.strings.status.combatStrings,
                [rpgCharacter.hitpoints.current,
                    rpgCharacter.hitpoints.max,
                    `${rpgCharacter.stats.bal * 100}`,
                    `${rpgCharacter.stats.crit * 100}%`,
                    `${rpgCharacter.stats.critDmgMult * 100}%`]
            );

            const expToNextLevel = RPGCharacterManager.CalculateXPNeededForLevel(RPGCharacterManager.CalculatePlayerLevel(rpgCharacter));
            const expStrings = replace(
                args.strings.status.expStrings,
                [
                    rpgCharacter.exp,
                    expToNextLevel,
                    ((rpgCharacter.exp / expToNextLevel) * 100).toPrecision(2)
                ]
            )

            let skillsStrings = replace(
                args.strings.status.skillsStrings,
                [
                    rpgCharacter.stats.hpLevel,
                    rpgCharacter.stats.str,
                    rpgCharacter.stats.int,
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
        })
        .catch((err) => {
            console.log(err.toString());
        })
};

export const action = status;
