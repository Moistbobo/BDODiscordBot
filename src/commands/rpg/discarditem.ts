import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";

const discarditem = (args: CommandArgs) => {
    const userID = args.message.author.id;
    const index = parseInt(args.message.content);
    let removedItem = null;

    if (isNaN(index) || index < 0) return args.sendErrorEmbed({contents: args.strings.discard.enterANumber});

    IsChannelRPGEnabled(args)
        .then((res) => FindOrCreateNewRPGCharacter(userID))
        .then((rpgCharacter) => {
            let inventory = rpgCharacter.inventory;

            if (!inventory || inventory.length === 0) {
                args.sendErrorEmbed({contents: replace(args.strings.discarditem.inventoryEmpty, [args.message.author.username])});
                throw new Error('Inventory already empty');
            }

            if (index > inventory.length - 1) {
                args.sendErrorEmbed({contents: replace(args.strings.discarditem.discardStrings.invalidIndex, [index])});
                throw new Error('Invalid index entered');
            }

            removedItem = inventory[index];
            inventory.splice(index, 1);
            rpgCharacter.inventory = inventory;

            return rpgCharacter.save();
        })
        .then(() => {
            const itemName = RPGTools.GetItemName(removedItem.itemID);
            args.sendOKEmbed({
                contents: replace(args.strings.discarditem.discardSuccess, [args.message.author.username,
                    itemName])
            });
        })
        .catch((err) => {
            console.log('[DISCARD COMMAND]', err);
        })

};

export const action = discarditem;

