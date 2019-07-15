import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";

const inventory = (args: CommandArgs) => {
    const userID = args.message.author.id;

    IsChannelRPGEnabled(args)

        .then((res) => {
            if (!res) {
                args.message.react('❌');
                throw new Error('Non RPG Channel');
            }
            return FindOrCreateNewRPGCharacter(userID)
        })
        .then((rpgCharacter) => {
            const inventory = rpgCharacter.inventory;
            let outputString = `${replace(args.strings.inventory.footerText, [args.message.author.username])}\n\n`;
            let counter = 0;

            // if (!inventory || inventory.length === 0) {
            //     args.sendErrorEmbed({contents: replace(args.strings.inventory.inventoryEmpty, [args.message.author.username])});
            //     throw new Error('Inventory is empty');
            // }

            inventory.forEach((item) => {
                // Retrieve name from strings
                let name = RPGTools.GetItemName(item.itemID) || args.strings.error;
                let qty = item.qty;

                outputString += `\`\`\`css\n#${counter++} - ${name} - [x${qty}]\`\`\``
            });

            const equippedWeapon = rpgCharacter.equippedWeapon;

            if(equippedWeapon){
                let name = RPGTools.GetItemName(equippedWeapon.itemID)|| args.strings.error;

                outputString += `** Equipped Weapon **\n\`\`\`${name}\`\`\``
            }

            args.sendOKEmbed({
                contents: outputString,
                footer: replace(args.strings.inventory.footerText, [args.message.author.username], false)
            });
        })
        .catch((err) => {
            console.log('[INVENTORY COMMAND]:', err.toString());
        })
};

export const action = inventory;
