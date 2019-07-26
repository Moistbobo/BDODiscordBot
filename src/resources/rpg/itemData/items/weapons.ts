import Item, {ItemTypes} from "../../../../models/rpg/Item";

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
    },
    {
        itemID: 'WPN3002',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 3,
        baseDamage: 18,
        requirements: {
            str: 4.00
        }
    },
    {
        itemID: 'WPN4000',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 4,
        baseDamage: 30,
        requirements: {
            str: 8
        },
        weaponStats: {
            balBonus: 0.1,
            critBonus: 0.05
        }
    },
    {
        itemID: 'WPN4001',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 4,
        baseDamage: 35,
        requirements: {
            str: 9
        },
        weaponStats: {
            balBonus: 0.1,
            critBonus: 0.05
        }
    },
    {
        itemID: 'WPN5000',
        itemType: ItemTypes[0],
        effects: [],
        rarity: 5,
        baseDamage: 60,
        requirements: {
            str: 12
        },
        weaponStats: {
            balBonus: 0.1,
            critBonus: 0.10,
            critDamageBonus: 0.1
        }
    }
];

export default Weapons;
