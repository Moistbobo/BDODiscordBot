import CommandArgs from "../../classes/CommandArgs";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";

const unequipWeapon = (args: CommandArgs) => {
    const userID = args.message.author.id;
    let equippedWeapon = null;

    IsChannelRPGEnabled(args)
        .then(() => {
            return FindOrCreateNewRPGCharacter(userID);
        })
        .then((rpgCharacter) => {
            equippedWeapon = rpgCharacter.equippedWeapon;
            if (!equippedWeapon) {
                args.sendErrorEmbed({contents: replace(args.strings.unequipweapon.noWeapon, [args.message.author.id])})
            }

            rpgCharacter.inventory.push(equippedWeapon);
            rpgCharacter.equippedWeapon = null;

            return rpgCharacter.save();
        })
        .then(() => {
            args.sendOKEmbed({
                contents: replace(args.strings.unequipweapon.unequipSuccess, [args.message.author.username,
                    args.strings[equippedWeapon.itemID].name])
            });
        })
        .catch((err) => {
            console.log('[UNEQUIP WEAPON COMMAND]:', err);
        })
};

export const action = unequipWeapon;
