import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import ItemFactory from "../../models/rpg/Factories/ItemFactory";
import {ItemTypes} from "../../models/rpg/Item";

const createItem = (args: CommandArgs) => {
    const userID = args.message.author.id;
    const itemID = args.message.content.split(' ')[0];
    const count = parseInt(args.message.content.split(' ')[1]);

    if (!args.message.content) return;
    console.log(count);
    Promise.all([FindOrCreateNewRPGCharacter(userID),
        ItemFactory.CreateNewItem(itemID, count || 1)])
        .then((res) => {
            const rpgCharacter = res[0];
            const newItem = res[1];

            // if(!newItem) throw new Error(`Could not find ItemID ${itemID} in database`);

            let itemIndex = rpgCharacter.inventory.findIndex((x) => x.itemID === newItem.itemID);
            if (newItem.itemType !== ItemTypes[0] && itemIndex !== -1) {
                console.log('Item is stackable, adding it to the players inventory');
                rpgCharacter.inventory[itemIndex].qty+= newItem.qty;
            } else {
                console.log('Adding item to player inventory');
                rpgCharacter.inventory.push(newItem);
            }

            return rpgCharacter.save();
        })
        .catch((err) => {
            console.log(err.toString());
        })
};

export const action = createItem;
