import {FindOrCreateRPGServerStats} from "../../models/rpg/RPGServerStats";
import ItemFactory from "../../models/rpg/Factories/ItemFactory";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import {ItemTypes} from "../../models/rpg/Item";

const DamageCalculation = (str: number, bal: number, equipment = 20, otherBonuses = 1.0) => {
    const maxDamage = CalcMaxDamage(str, equipment, otherBonuses);
    const balanceMod = getRandomArbitrary(bal, 1.0);

    return Math.floor((maxDamage * balanceMod));
};

const HealCalculation = (int: number, bal: number, equipment = 10, otherBonuses = 1.0) => {
    const maxHeal = CalcMaxHeal(int, equipment, otherBonuses);
    const balanceMod = getRandomArbitrary(bal, 1.5);

    return Math.floor((maxHeal * balanceMod));
};

const getRandomArbitrary = (min, max) => {
    return parseFloat((Math.random() * (max - min) + min).toPrecision(2));
};

const GetRandomIntegerFrom = (max: number): number => {
    return Math.floor(Math.random() * max);
};

const CalcMaxDamage = (str: number, equip: number, otherBonuses: number) => {
    const baseConstant = 5;
    const baseLog = 1.5;

    return baseConstant * (Math.log(equip * str) / Math.log(baseLog));
};

const CalcMaxHeal = (int: number, equip: number, otherBonuses: number) => {
    const baseConstant = 5;
    const baseLog = 2;

    return baseConstant * (Math.log(equip * int) / Math.log(baseLog));
};

const AddItemToUserInventory = (userID: string, itemID: string, qty=1) => {
    return new Promise((resolve, reject) => {
        Promise.all([FindOrCreateNewRPGCharacter(userID), ItemFactory.CreateNewItem(itemID, qty)])
            .then((res) => {
                let rpgCharacter = res[0];
                let newItem = res[1];

                let itemIndex = rpgCharacter.inventory.findIndex((x) => x.itemID === newItem.itemID);
                if (newItem.itemType !== ItemTypes[0] && itemIndex !== -1) {
                    console.log('Item is stackable, adding it to the players inventory');
                    rpgCharacter.inventory[itemIndex].qty += newItem.qty;
                } else {
                    console.log('Adding item to player inventory');
                    rpgCharacter.inventory.push(newItem);
                }

                return rpgCharacter.save();
            })
            .then(() => resolve(true))
            .catch((err) => {
                console.log(err);
                reject(new Error('Error adding item to user inventory'));
            })
    })
};

const RPGTools = {
    CalcMaxDamage,
    DamageCalculation,
    CalcMaxHeal,
    HealCalculation,
    GetRandomIntegerFrom,
    AddItemToUserInventory,
    GetRandomFloatRange: getRandomArbitrary
};

export default RPGTools;
