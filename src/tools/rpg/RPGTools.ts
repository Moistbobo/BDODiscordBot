import ItemFactory from "../../models/rpg/Factories/ItemFactory";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import {ItemTypes} from "../../models/rpg/Item";
import {IRPGTimer} from "../../models/rpg/RPGTimer";
import Timers from "../../resources/Timers";

let strings = null;

const SetString = (_strings: any) => {
    strings = _strings;
};

const GetItemName = (itemID: string) => {
    return strings.items[itemID].name;
};

const GetItemDesc = (itemID: string) => {
    return strings.items[itemID].description;
};

const GetRecipeName = (recipeID: string) => {
    return strings.recipes[recipeID].name;
};

const GetRecipeDesc = (recipeID: string) => {
    return strings.recipes[recipeID].description;
};

const GetMonsterStrings = (monsterID: string) => {
    return strings.monsters[monsterID];
};

const DamageCalculation = (str: number, bal: number, equipment = 20, otherBonuses = 1.0) => {
    const maxDamage = CalcMaxDamage(str, equipment, otherBonuses);
    const balanceMod = getRandomArbitrary(bal, 1.0);

    return Math.floor((maxDamage * balanceMod));
};

const GetRandomStringFromArr = (str: [string]) => {
    return str[GetRandomIntegerFrom(str.length)];
};

const HealCalculation = (int: number, bal: number, equipment = 10, otherBonuses = 1.0) => {
    const maxHeal = CalcMaxHeal(int, equipment, otherBonuses);
    const balanceMod = getRandomArbitrary(0.6, 1.5);

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

const GetMonsterIDFromTable = (spawnTable: any) => {
    let totalChance = 0;

    const table = JSON.parse(JSON.stringify(spawnTable));

    table.forEach((mon) => {
        totalChance += mon.chance;
        mon.chance = totalChance;
    });

    table.sort((a, b) => a.chance - b.chance);
    const roll = GetRandomIntegerFrom(100);

    console.log('Spawn roll:', roll);
    console.log(table);
    let counter = 0;
    let monsterID = null;
    while (counter < table.length) {
        if (roll < table[counter].chance) {
            monsterID = table[counter].monsterID;
            counter = table.length;
        }
        counter++;
    }

    return monsterID;

};

const GetItemIDFromTable = (dropTable: any) => {
    let totalChance = 0;

    dropTable = JSON.parse(JSON.stringify(dropTable));

    dropTable.forEach((drop: any) => {
        totalChance += drop.chance;
        drop.chance = totalChance;
    });
    dropTable.sort((a, b) => a.chance - b.chance);

    const itemDropRoll = RPGTools.GetRandomIntegerFrom(100);
    let counter = 0;
    let itemIDToDrop = null;
    while (counter < dropTable.length) {
        if (itemDropRoll < dropTable[counter].chance) {
            itemIDToDrop = dropTable[counter].itemID;
            counter = dropTable.length;
        }
        counter++;
    }
    return itemIDToDrop;
};

const AddItemToUserInventory = (userID: string, itemID: string, qty = 1) => {
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

const CheckIfDungeonOnCooldown = (rpgTimer: IRPGTimer) => {
    const now = Date.now() / 1000;
    const timeLeft = Timers.rpg.dungeonTimer - (now - rpgTimer.lastDungeon);

    return {timeLeft: Math.floor(timeLeft), onCooldown: (now - rpgTimer.lastDungeon) < Timers.rpg.dungeonTimer}
};

const RPGTools = {
    CalcMaxDamage,
    DamageCalculation,
    CalcMaxHeal,
    HealCalculation,
    GetRandomIntegerFrom,
    AddItemToUserInventory,
    GetRandomFloatRange: getRandomArbitrary,
    SetString,
    GetItemName,
    GetItemDesc,
    GetRecipeName,
    GetRecipeDesc,
    GetMonsterStrings,
    GetRandomStringFromArr,
    GetMonsterIDFromTable,
    GetItemIDFromTable,
    CheckIfDungeonOnCooldown
};

export default RPGTools;
