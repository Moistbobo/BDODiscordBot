import {ItemTypes} from "../../models/rpg/Item";

const Weapons = [
    {
        "itemID": "WPN1001",
        "itemType": "weapon",
        "effects": [],
        "rarity": 1,
        "baseDamage": 5
    },
    {
        "itemID": "WPN1002",
        itemType: ItemTypes[0],
        effects: [],
        rarity: 1,
        baseDamage: 7
    },
    {
        itemID: 'WPN1003',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 1,
        baseDamage: 9
    },
    {
        itemID: 'WPN1004',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 1,
        baseDamage: 10
    },
    {
        itemID: 'WPN1005',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 1,
        baseDamage: 12
    },
    {
        itemID: 'WPN3001',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 3,
        baseDamage: 25,
        requirements: {
            str: 6.00
        }
    }
];

export default Weapons;
