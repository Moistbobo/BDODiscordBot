import CommandArgs from "../../classes/CommandArgs";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {ItemTypes} from "../../models/rpg/Item";
import RPGTools from "../../tools/rpg/RPGTools";

const equip = (args: CommandArgs) => {
    const userID = args.message.author.id;
    const index = parseInt(args.message.content.replace('#',''));
    let itemToEquip = null;
    let previousWeapon = null;

    IsChannelRPGEnabled(args)
        .then(() => {
            return FindOrCreateNewRPGCharacter(userID);
        })
        .then((rpgCharacter) => {
            const inventory = rpgCharacter.inventory;

            if (index > inventory.length - 1) {
                args.sendErrorEmbed({contents: replace(args.strings.discarditem.invalidIndex, [index])});
                throw new Error('Invalid index');
            }

            // Find out what type of item is being equipped
            itemToEquip = inventory[index];
            const itemType = itemToEquip.itemType;

            // weapons
            if (itemType === ItemTypes[0]) {

                // check if the player meets the stat requirements
                if (rpgCharacter.stats.str < itemToEquip.requirements.str) {
                    args.sendErrorEmbed({
                        contents: replace(args.strings.equip.strRequirement,
                            [itemToEquip.requirements.str,
                                RPGTools.GetItemName(itemToEquip.itemID),
                                rpgCharacter.stats.str,
                                args.message.author.username])
                    });
                    throw new Error('User does not meet str requirement')
                } else if (rpgCharacter.stats.int < itemToEquip.requirements.int) {
                    args.sendErrorEmbed({
                        contents: replace(args.strings.equip.intRequirement,
                            [itemToEquip.requirements.int,
                                RPGTools.GetItemName(itemToEquip.itemID),
                                rpgCharacter.stats.int,
                                args.message.author.username])
                    });
                    throw new Error('User does not meet int requirement')
                }

                previousWeapon = rpgCharacter.equippedWeapon;

                if (previousWeapon) {
                    rpgCharacter.equippedWeapon = itemToEquip;
                    rpgCharacter.inventory.splice(index, 1);
                    rpgCharacter.inventory.push(previousWeapon);
                } else {
                    rpgCharacter.equippedWeapon = itemToEquip;
                    rpgCharacter.inventory.splice(index, 1);
                }
            } else {
                args.sendErrorEmbed({
                    contents: replace(args.strings.equip.notEquippable,
                        [
                            args.message.author.username,
                            RPGTools.GetItemName(itemToEquip.itemID)
                        ])
                });
                throw new Error('Invalid Item type');
            }

            return rpgCharacter.save();
        })
        .then(() => {
            if (itemToEquip) {
                args.sendOKEmbed({
                    contents: replace(args.strings.equip.equipped,
                        [
                            args.message.author.username,
                            RPGTools.GetItemName(itemToEquip.itemID)
                        ]),
                    footer: previousWeapon ? replace(args.strings.equip.previousWeaponFooter,
                        [RPGTools.GetItemName(previousWeapon.itemID)],
                        false) : null
                });

            } else {
                args.sendOKEmbed({
                    contents: replace(args.strings.equip.failEquipped,
                        [args.message.author.username])
                });
            }
        })
        .catch((err) => {
            console.log('[EQUIP COMMAND]:', err);
        })
};

export const action = equip;
