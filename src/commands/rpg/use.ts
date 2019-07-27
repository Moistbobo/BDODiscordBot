import CommandArgs from "../../classes/CommandArgs";
import {FindOrCreateRPGServerStats, IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import {FindOrCreateNewRPGCharacter, IRPGCharacter} from "../../models/rpg/RPGCharacter";
import {FindOrCreateRPGTimer, IRPGTimer} from "../../models/rpg/RPGTimer";
import {ItemTypes} from "../../models/rpg/Item";
import replace from "../../tools/replace";
import RPGTools from "../../tools/rpg/RPGTools";
import Effects, {effectActions, healType} from "../../resources/rpg/Effects";
import {on} from "cluster";

const isItemUsable = (userInventory: any, itemIndex: number) => {
    return userInventory[itemIndex].itemType === ItemTypes[1];
};

const processItemEffects = (rpgChar: any, effectID: string) => {
    const e = Effects.find((x) => x.effectID === effectID);
    let value = 0;

    if (e.effect.action === effectActions[0]) {
        if (e.effect.effectType === healType[0]) {
            value = Math.floor(rpgChar.hitpoints.max * e.effect.value);
            rpgChar.hitpoints.current = Math.min(rpgChar.hitpoints.max,
                (rpgChar.hitpoints.current += value));

        } else if (e.effect.effectType === healType[1]) {
            value = e.effect.value;
            rpgChar.hitpoints.current = Math.min(rpgChar.hitpoints.max, rpgChar.hitpoints.current + value);
        }
    }

    return {rpgChar, effect: e.effect, value};
};

const useItem = (rpgChar: any, rpgTimer: IRPGTimer, itemIndex: number, args: CommandArgs) => {
    console.log('yes');
    const effectsArray = rpgChar.inventory[itemIndex].effects;

    effectsArray.forEach((effect) => {
        console.log(effect);
        const effectResult = processItemEffects(rpgChar, effect);
        rpgChar = effectResult.rpgChar;
        const appliedEffect = effectResult.effect;
        if (appliedEffect.action === effectActions[0]) {
            if (appliedEffect.effectType === healType[0] ||
                appliedEffect.effectType === healType[1]) {

                console.log('Use item');

                console.log(rpgChar.inventory[itemIndex].itemID);

                args.sendOKEmbed({
                    contents: replace(
                        args.strings.use.useItemHealed,
                        [args.message.author.username,
                            RPGTools.GetItemName(rpgChar.inventory[itemIndex].itemID),
                            effectResult.value,
                            rpgChar.hitpoints.current,
                            rpgChar.hitpoints.max]
                    )
                })
            }
        }

    });

    rpgChar.inventory[itemIndex].qty--;
    rpgTimer.lastHealItem = args.timeNow;

    if (rpgChar.inventory[itemIndex].qty === 0) {
        rpgChar.inventory.splice(itemIndex, 1);
    }

    return Promise.all([rpgChar.save(), rpgTimer.save()]);
};

const use = (args: CommandArgs) => {
    const userID = args.message.author.id;
    const itemIndex = parseInt(args.message.content);

    IsChannelRPGEnabled(args)
        .then(() => {
            return Promise.all([FindOrCreateNewRPGCharacter(userID), FindOrCreateRPGTimer(userID)])
        })
        .then((res) => {
            let [rpgChar, rpgTimer] = res;
            let item = null;

            if (isNaN(itemIndex)) {
                args.sendErrorEmbed({
                    contents: replace(args.strings.use.useInvalidItemIndex,
                        [args.message.author.username,
                            itemIndex])
                });
                throw new Error('Invalid index');
            }

            if (!isItemUsable(rpgChar.inventory, itemIndex)) {
                const itemName = RPGTools.GetItemName(rpgChar.inventory[itemIndex].itemID);
                args.sendErrorEmbed({
                    contents: replace(args.strings.use.useItemNotUsable,
                        [args.message.author.username,
                            itemName])
                });
                throw new Error(`${itemName} is not usable`);
            }

            const itemType = rpgChar.inventory[itemIndex].itemType;
            // Check if the specified item type is on cooldown
            switch (itemType) {
                // Healing
                case ItemTypes[1]:
                    const {timeLeft, onCooldown} = RPGTools.CheckIfHealingItemOnCooldown(rpgTimer);
                    if (onCooldown) {
                        args.sendErrorEmbed({
                            contents:
                                replace(args.strings.use.useItemHealingCooldown,
                                    [
                                        args.message.author.username,
                                        timeLeft])
                        });
                        throw new Error('Healing item on cooldown');
                    }
                // Buff
                case ItemTypes[3]:
                    break;
            }


            if (rpgChar.hitpoints.current <= 0) {
                args.sendErrorEmbed({
                    contents: replace(
                        args.strings.use.useErrorDead,
                        [args.message.author.username]
                    )
                })
                throw new Error(`${args.message.author.username} is dead`);
            }

            return useItem(rpgChar, rpgTimer, itemIndex, args);
        })
        .catch((err) => {
            console.log('[USE COMMAND]: ', err.toString());
        })
};


export const action = use;

