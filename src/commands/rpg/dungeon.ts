import CommandArgs from "../../classes/CommandArgs";
import RPGTools from "../../tools/rpg/RPGTools";
import replace from "../../tools/replace";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGCombatTools from "../../tools/rpg/RPGCombatTools";
import dungeonSpawnRates from "../../resources/rpg/monsters/dungeonSpawnRates";
import RPGMonster from "../../models/rpg/RPGMonster";
import RPGDropTable from "../../models/rpg/RPGDropTable";
import {FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGCharacterManager, {maxLevel, maxLevelPenalty} from "../../tools/rpg/RPGCharacterManager";
import dungeonUnlockRules from "../../resources/rpg/monsters/dungeonUnlockRules";

const attackEmoji = '⚔';
const runEmoji = '🏃';
const turnTimeout = 2000;
const battleTime = 120000;

const dungeon = (args: CommandArgs) => {
    let itemID = null;
    let monster = null;
    let mStrings = null;
    const author = args.message.author;
    let message = null;
    let collector = null;
    let rpgCharacter = null;
    let rpgTimer = null;
    let rpgServerStats = null;
    let acceptReactions = true;


    const collectorFilter = (reaction, user) => {
        return [attackEmoji, runEmoji].includes(reaction.emoji.name) &&
            user.id === args.message.author.id;
    };

    IsChannelRPGEnabled(args)
        .then(() => {
            return Promise.all([FindOrCreateRPGTimer(author.id),
                FindOrCreateNewRPGCharacter(author.id),
                FindOrCreateRPGServerStats(args.message.guild.id)])
        })
        .then((res) => {
            [rpgTimer, rpgCharacter, rpgServerStats] = res;

            const {timeLeft, onCooldown} = RPGTools.CheckIfDungeonOnCooldown(rpgTimer);

            if (onCooldown) {
                args.sendErrorEmbed(
                    {
                        contents: replace(args.strings.dungeon.dungeonOnCooldown, [author.username, timeLeft])
                    }
                );
                throw new Error(`User ${author.username} on cooldown`);
            }

            if (rpgCharacter.hitpoints.current <= 0) {
                args.sendErrorEmbed({contents: replace(args.strings.attack.attackerIsDead, [author.username])});
                throw new Error(`User ${author.username} is dead`);
            }

            rpgTimer.lastDungeon = Date.now() / 1000;

            const dungeonFloor = parseInt(args.message.content) || rpgCharacter.dungeonLevel;
            if (isNaN(dungeonFloor) || dungeonFloor > Object.keys(dungeonSpawnRates).length) {
                args.sendErrorEmbed({
                    contents: replace(args.strings.dungeon.dungeonInvalidFloor,
                        [author.username,
                            dungeonFloor])
                });
                throw new Error(`User ${author.username} specified invalid dungeon floor ${dungeonFloor}`);
            }

            if (dungeonFloor > rpgCharacter.dungeonLevel) {

                let unlockMonster = dungeonUnlockRules.find((x) => x.unlocks === dungeonFloor);
                // unlockMonster = unlockMonster[0];
                console.log(unlockMonster);
                args.sendErrorEmbed({
                    contents: replace(args.strings.dungeon.dungeonFloorNotUnlocked,
                        [author.username,
                            dungeonFloor]),
                    footer: replace(args.strings.dungeon.dungeonUnlockTerms,
                        [dungeonFloor, RPGTools.GetMonsterStrings(unlockMonster.monster).name,
                            unlockMonster.floor],
                        false
                    )
                });
                throw new Error(`User ${author.username} has not unlocked floor ${dungeonFloor} yet`);
            }

            const spawnTable = dungeonSpawnRates[dungeonFloor];
            const monsterIDToSpawn = RPGTools.GetMonsterIDFromTable(spawnTable);
            console.log('Spawning', monsterIDToSpawn);
            mStrings = RPGTools.GetMonsterStrings(monsterIDToSpawn);
            return Promise.all([RPGMonster.findOne({monsterID: monsterIDToSpawn}), rpgTimer.save()]);
        })
        .then((res) => {
            [monster,] = res;
            return args.sendOKEmbed({
                contents: replace(args.strings.dungeon.monsterEncountered,
                    [args.message.author.username,
                        mStrings.name]),
                image: mStrings.img,
                thumbnail: author.avatarURL()
            })
        })
        .then((msg) => {
            message = msg;
            return msg.react(attackEmoji);
        })
        .then(() => {
            collector = message.createReactionCollector(collectorFilter, {
                time: battleTime,
                errors: ['time']
            });
            collector.on('collect', onCollected);
            collector.on('end', onEnd);
        })
        .catch((err) => {
            console.log('[DUNGEON COMMAND]: ', err.toString());
        });

    // This is also the "Player turn"
    const onCollected = (element, user) => {
        if (!acceptReactions || rpgCharacter.hitpoints.current <= 0) return;

        FindOrCreateNewRPGCharacter(author.id)
            .then((rpgChar) => {
                rpgCharacter = rpgChar;
                acceptReactions = false;
                const {isCrit, damage} = RPGCombatTools.CalculatePlayerDamage(rpgCharacter);

                const attackString = isCrit ? replace(args.strings.attack.attackCritical, [author.username, mStrings.name]) : '';
                monster.hitpoints.current -= damage;

                if (monster.hitpoints.current <= 0) {
                    const newMessage =
                        args.strings.dungeon.yourAttack +
                        attackString +
                        replace(args.strings.attack.attackTargetLives,
                            [args.message.author.username,
                                mStrings.name,
                                damage,
                                monster.hitpoints.current,
                                monster.hitpoints.max]) + '\n\n' +
                        replace(RPGTools.GetRandomStringFromArr(args.strings.dungeon.dungeonBattleWinnerStrings),
                            [mStrings.name,
                                author.username]);

                    rpgServerStats.monsterKills++;
                    rpgCharacter.monsterKills++;

                    let itemDropped = false;

                    Promise.all([
                        RPGCharacterManager.AddXPPlayer(rpgCharacter, monster.exp, args),
                        rpgServerStats.save(),
                    ])
                        .then(() => {
                            if (Math.random() < monster.lootChance) {
                                const dropTableID = monster.dropTableID;
                                itemDropped = true;
                                return RPGDropTable.findOne({dropTableID})
                            } else {
                                // throw new Error('Failed drop roll: no drops 4 u')
                                return null;
                            }
                        }).then((dropTable) => {
                        if (dropTable) {
                            itemID = RPGTools.GetItemIDFromTable(dropTable.table);
                            if (itemID)
                                return RPGTools.AddItemToUserInventory(author.id, itemID);
                            else
                                return;
                        } else {
                            return;
                        }
                    }).then(() => {
                        const expToNextLevel = RPGCharacterManager.CalculateXPNeededForLevel(RPGCharacterManager.CalculatePlayerLevel(rpgCharacter));
                        let expPenalty = RPGCharacterManager.CalculatePlayerLevel(rpgChar) >= maxLevel ? maxLevelPenalty : 1.0;
                        console.log(monster.exp * expPenalty);
                        let extraFields = [
                            {
                                name: args.strings.dungeon.dungeonBattleResultTitle,
                                value: replace(
                                    args.strings.dungeon.dungeonBattleResultEXPGained,
                                    [author.username,
                                        Math.floor(monster.exp * expPenalty),
                                        rpgCharacter.exp,
                                        RPGCharacterManager.CalculateXPNeededForLevel(RPGCharacterManager.CalculatePlayerLevel(rpgCharacter)),
                                        `${((rpgCharacter.exp / expToNextLevel) * 100).toPrecision(2)}%`]
                                )
                            }
                        ];

                        if (itemID) {
                            extraFields.push({
                                name: args.strings.dungeon.dungeonItemObtained,
                                value: replace(args.strings.dungeon.dungeonObtainItemFromMonster,
                                    [author.username,
                                        RPGTools.GetItemName(itemID),
                                        mStrings.name
                                    ])
                            })
                        }

                        let promises = [];

                        // See if the monster unlocked a new dungeon floor for the player
                        const floorUnlockRule = dungeonUnlockRules.find((x) => x.monster === monster.monsterID);
                        if (floorUnlockRule &&
                            floorUnlockRule.unlocks > rpgCharacter.dungeonLevel) {
                            rpgCharacter.dungeonLevel = floorUnlockRule.unlocks;
                            extraFields.push({
                                name: args.strings.dungeon.dungeonFloorUnlockedTitle,
                                value: replace(args.strings.dungeon.dungeonFloorUnlockedString,
                                    [author.username,
                                        floorUnlockRule.unlocks])
                            });
                            promises.push(rpgCharacter.save());
                        }

                        promises.push(
                            message.edit(
                                args.bot.createOKEmbed({
                                    contents: newMessage,
                                    image: mStrings.imgDead,
                                    extraFields,
                                    thumbnail: author.avatarURL()
                                })
                            )
                        );


                        return Promise.all(promises);
                    })
                        .catch((err) => {
                            console.log('[DUNGEON COMMAND PLAYER TURN]:', err);
                        });


                    collector.stop();
                } else {

                    const newMessage =
                        args.strings.dungeon.yourAttack +
                        attackString +
                        replace(args.strings.attack.attackTargetLives,
                            [args.message.author.username,
                                mStrings.name,
                                damage,
                                monster.hitpoints.current,
                                monster.hitpoints.max]);

                    message.edit(
                        args.bot.createOKEmbed({
                            contents: newMessage + '\n\n\`=======================================\`\n\n' +
                                `${replace(args.strings.dungeon.monsterAttack, [mStrings.name])}
                        ${args.strings.dungeon.waitingForPlayer}`,
                            image: mStrings.img,
                            thumbnail: author.avatarURL()
                        })
                    ).then(() => {
                        monsterTurn(newMessage);
                    })
                }
            });
    };

    const onEnd = () => {
        if (monster.hitpoints.current < 0) return;
        message.edit(
            args.bot.createOKEmbed({
                contents: replace(RPGTools.GetRandomStringFromArr(args.strings.dungeon.dungeonBattleTimeoutStrings),
                    [mStrings.name]),
                // image: mStrings.img,
                thumbnail: author.avatarURL()
            })
        );
    };

    const monsterTurn = (prevMessage) => {
        setTimeout(() => {
            // Do monster turn after timeout
            acceptReactions = true;

            const {damage, isCrit} = RPGCombatTools.CalculateMonsterDamage(monster);

            rpgCharacter.hitpoints.current -= damage;

            if (rpgCharacter.hitpoints.current <= 0) {
                rpgCharacter.deaths++;
                rpgTimer.lastDeath = Date.now() / 1000;
                rpgCharacter = RPGCharacterManager.ApplyDeathXPPenalty(rpgCharacter);
                const newMessage =
                    `${prevMessage}` + '\n\n\`=======================================\`\n\n' +
                    replace(args.strings.dungeon.monsterAttack, [mStrings.name]) +
                    replace(isCrit ? RPGTools.GetRandomStringFromArr(mStrings.attackStringsCrit) :
                        RPGTools.GetRandomStringFromArr(mStrings.attackStrings),
                        [author.username,
                            damage]) + '\n\n' +
                    replace(args.strings.dungeon.playerHPLeft,
                        [
                            args.message.author.username,
                            rpgCharacter.hitpoints.current,
                            rpgCharacter.hitpoints.max])
                    + '\n\n' +
                    replace(RPGTools.GetRandomStringFromArr(args.strings.dungeon.dungeonBattleWinnerStrings),
                        [author.username,
                            mStrings.name,]);

                message.edit(
                    args.bot.createOKEmbed({
                        contents: newMessage,
                        image: mStrings.img,
                        thumbnail: author.avatarURL()
                    })
                ).then(() => {
                    return Promise.all([rpgCharacter.save(), rpgTimer.save()]);
                    // return rpgCharacter.save();
                });
            } else {
                const newMessage =
                    `${prevMessage}` + '\n\n\`=======================================\`\n\n' +
                    replace(args.strings.dungeon.monsterAttack, [mStrings.name]) +
                    replace(isCrit ? RPGTools.GetRandomStringFromArr(mStrings.attackStringsCrit) :
                        RPGTools.GetRandomStringFromArr(mStrings.attackStrings),
                        [author.username,
                            damage]) + '\n\n' +
                    replace(args.strings.dungeon.playerHPLeft,
                        [
                            args.message.author.username,
                            rpgCharacter.hitpoints.current,
                            rpgCharacter.hitpoints.max]);

                message.edit(
                    args.bot.createOKEmbed({
                        contents: newMessage,
                        image: mStrings.img,
                        thumbnail: author.avatarURL()
                    })
                ).then(() => {
                    return rpgCharacter.save();
                });
            }
        }, turnTimeout)
    };
};

export const action = dungeon;

