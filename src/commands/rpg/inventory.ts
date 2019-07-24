import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";
import {IItem, ItemTypes} from "../../models/rpg/Item";

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

            const equippedWeapon = rpgCharacter.equippedWeapon;

            inventory.forEach((item: IItem) => {
                // Retrieve name from strings
                let name = RPGTools.GetItemName(item.itemID) || args.strings.error;
                let qty = item.qty;

                let compareEquippedWeaponDifference = '';

                if (equippedWeapon && item.itemType === ItemTypes[0]) {
                    if (equippedWeapon.baseDamage > item.baseDamage) {
                        compareEquippedWeaponDifference = `[${item.baseDamage - equippedWeapon.baseDamage}]`
                    } else if (equippedWeapon.baseDamage === item.baseDamage) {
                        compareEquippedWeaponDifference = `(0)`
                    } else {
                        compareEquippedWeaponDifference = `(+${item.baseDamage - equippedWeapon.baseDamage})`;
                    }
                }

                if (!equippedWeapon && item.itemType === ItemTypes[0]) {
                    compareEquippedWeaponDifference = `(+${item.baseDamage})`
                }

                let quantityString =
                    item.itemType !== ItemTypes[0] ?
                        ` - [x${qty}]` : '';

                outputString += `\`\`\`css\n#${counter++} - [${item.itemType}] ${name} ${compareEquippedWeaponDifference} ${quantityString} \`\`\``
            });


            if (equippedWeapon) {
                let name = RPGTools.GetItemName(equippedWeapon.itemID) || args.strings.error;

                outputString += `** Equipped Weapon **\n\`\`\`${name}\n\n${replace(args.strings.inventory.inventoryWeaponDamageBonus,
                    [equippedWeapon.baseDamage], false)}\`\`\``
            }

            args.sendOKEmbed({
                contents: outputString,
                footer: replace(args.strings.inventory.footerText, [args.message.author.username], false),
                thumbnail: args.message.author.avatarURL()
            });
        })
        .catch((err) => {
            console.log('[INVENTORY COMMAND]:', err.toString());
        })
};

export const action = inventory;
