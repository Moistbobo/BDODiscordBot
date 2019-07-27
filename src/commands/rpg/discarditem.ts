import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";

const confirmEmoji = '🗑';

const discarditem = (args: CommandArgs) => {
    const userID = args.message.author.id;
    const indices = args.message.content.split(' ');
    let tempObj = {};
    indices.forEach((x) => {
        if (!tempObj.hasOwnProperty(x)) {
            tempObj[x] = 0;
        }
    });
    let mappedIndices = Object.keys(tempObj).map((x) => parseInt(x));

    const index = parseInt(args.message.content);
    let warningMsg = null;
    let rpgChar = null;
    const reverseMappedIndices = mappedIndices.sort((a, b) => b - a);

    const reactionFilter = (reaction, user) => {
        return reaction.emoji.name === confirmEmoji && user.id === args.message.author.id
    };

    if (isNaN(index) || index < 0) return args.sendErrorEmbed({contents: args.strings.discard.enterANumber});

    IsChannelRPGEnabled(args)
        .then((res) => FindOrCreateNewRPGCharacter(userID))
        .then((rpgCharacter) => {
            rpgChar = rpgCharacter;
            let inventory = rpgCharacter.inventory;


            if (!inventory || inventory.length === 0) {
                args.sendErrorEmbed({contents: replace(args.strings.discarditem.inventoryEmpty, [args.message.author.username])});
                throw new Error('Inventory already empty');
            }

            reverseMappedIndices.forEach((x) => {

                if (isNaN(x)) {
                    args.sendErrorEmbed({contents: replace(args.strings.discarditem.invalidIndex, [x])});
                    throw new Error('Invalid index entered - isNAN');
                }

                if (x > inventory.length - 1) {
                    args.sendErrorEmbed({contents: replace(args.strings.discarditem.invalidIndex, [x])});
                    throw new Error('Invalid index entered');
                }
            });

            // Checks finished, send warning message

            const discardingItemNames = reverseMappedIndices.reverse().map((x) =>
                RPGTools.GetItemName(rpgChar.inventory[x].itemID));

            return args.sendOKEmbed({
                contents: replace(args.strings.discarditem.discardItemList, [args.message.author.username, discardingItemNames.join('\n')]),
                footer: args.strings.discarditem.discardItemConfirm
            });
        })
        .then((msg) => {
            warningMsg = msg;
            return msg.react(confirmEmoji);
        })
        .then(() => {
            return warningMsg.awaitReactions(reactionFilter,
                {max: 1, time: 15000})
        })
        .then((collected) => {

            if (!collected.get(confirmEmoji).users.array().find(user => user.id === args.message.author.id)) {
                throw new Error('User did not react in time');
            }


            const discardingItemNames = reverseMappedIndices.reverse().map((x) =>
                RPGTools.GetItemName(rpgChar.inventory[x].itemID));

            let inventory = rpgChar.inventory;
            reverseMappedIndices.forEach((x) => {
                inventory.splice(x, 1);
            });


            rpgChar.inventory = inventory;

            warningMsg.edit(
                args.bot.createOKEmbed({
                    contents: replace(args.strings.discarditem.discardSuccess, [args.message.author.username, discardingItemNames.join('\n')])
                })
            );

            return rpgChar.save();
        })
        // .then(() => {
        //     const itemName = RPGTools.GetItemName(removedItem.itemID);
        //     args.sendOKEmbed({
        //         contents: replace(args.strings.discarditem.discardSuccess, [args.message.author.username])
        //     });
        // })
        .catch((err) => {
            warningMsg.delete();
            console.log('[DISCARD COMMAND]', err);
        })

};

export const action = discarditem;

