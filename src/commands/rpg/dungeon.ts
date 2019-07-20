import CommandArgs from "../../classes/CommandArgs";
import RPGTools from "../../tools/rpg/RPGTools";
import replace from "../../tools/replace";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import RPGCombatTools from "../../tools/rpg/RPGCombatTools";
import dungeonSpawnRates from "../../resources/rpg/monsters/dungeonSpawnRates";
import RPGMonster from "../../models/rpg/RPGMonster";
import RPGDropTable from "../../models/rpg/RPGDropTable";
import {FindOrCreateRPGTimer} from "../../models/rpg/RPGTimer";
import {FindOrCreateRPGServerStats} from "../../models/rpg/RPGServerStats";
import RPGCharacterManager from "../../tools/rpg/RPGCharacterManager";

const attackEmoji = '⚔';
const runEmoji = '🏃';
const turnTimeout = 2000;
const battleTime = 120000;

const dungeon = (args: CommandArgs) => {
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

    Promise.all([FindOrCreateRPGTimer(author.id),
        FindOrCreateNewRPGCharacter(author.id),
        FindOrCreateRPGServerStats(args.message.guild.id)])
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

            const spawnTable = dungeonSpawnRates[rpgCharacter.dungeonLevel];
            const monsterIDToSpawn = RPGTools.GetMonsterIDFromTable(spawnTable);
            mStrings = RPGTools.GetMonsterStrings(monsterIDToSpawn);
            return Promise.all([RPGMonster.findOne({monsterID: monsterIDToSpawn}), rpgTimer.save()]);
        })
        .then((res) => {
            [monster,] = res;
            return args.sendOKEmbed({
                contents: replace(args.strings.dungeon.monsterEncountered,
                    [args.message.author.username,
                        mStrings.name]),
                image: mStrings.img
            })
        })
        .then((msg) => {
            message = msg;
            return msg.react(attackEmoji);
        })
        // .then((msg) => {
        //     return message.react(runEmoji)
        // })
        .then(() => {
            collector = message.createReactionCollector(collectorFilter, {
                time: battleTime,
                errors: ['time']
            });
            collector.on('collect', onCollected);
            collector.on('end', onEnd);
        })
        .catch((err) => {
            console.log('[DUNGEON COMMAND]: ', err);
        });

    // This is also the "Player turn"
    const onCollected = (element, user) => {
        if (!acceptReactions || rpgCharacter.hitpoints.current <= 0) return;

        FindOrCreateNewRPGCharacter(author.id)
            .then((rpgChar) => {
                rpgCharacter = rpgChar;

                acceptReactions = false;

                // const playerDamage = RPGTools.DamageCalculation(rpgCharacter.stats.str, rpgCharacter.stats.bal);

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

                    Promise.all([
                        RPGCharacterManager.ProcessStrUpMonsterKill(rpgCharacter, args, author.username, mStrings, monster),
                        rpgServerStats.save(),
                    ])
                        .then(() => {
                            return message.edit(
                                args.bot.createOKEmbed({
                                    contents: newMessage,
                                    image: mStrings.imgDead
                                })
                            )
                        })
                        .then(() => {
                            if (Math.random() < monster.lootChance) {
                                const dropTableID = monster.dropTableID;
                                return RPGDropTable.findOne({dropTableID})
                            } else {
                                throw new Error('Failed drop roll: no drops 4 u')
                            }
                        }).then((dropTable) => {
                        const itemID = RPGTools.GetItemIDFromTable(dropTable.table);

                        args.sendOKEmbed({
                            contents: replace(args.strings.dungeon.dungeonObtainItemFromMonster,
                                [author.username,
                                    RPGTools.GetItemName(itemID),
                                    mStrings.name
                                ])
                        });
                        return RPGTools.AddItemToUserInventory(author.id, itemID)
                    }).catch((err) => {
                        console.log('[DUNGEON COMMAND]:', err);
                    });


                    collector.stop();
                } else {
                    const newMessage =
                        args.strings.dungeon.yourAttack +
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
                            image: mStrings.img
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
                image: mStrings.img
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
                    })
                ).then(() => {
                    return rpgCharacter.save();
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
                        image: mStrings.img
                    })
                ).then(() => {
                    return rpgCharacter.save();
                });
            }
        }, turnTimeout)
    };
};

export const action = dungeon;
