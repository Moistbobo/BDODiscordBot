import {ItemTypes} from "../../../../models/rpg/Item";

const Consumables = [
    {
        note: 'Rainbow Potion',
        itemID: 'CONS0001',
        itemType: ItemTypes[1],
        rarity: 2,
        effects: ['EFF0001'],
    },
    {
        note: 'Choroids',
        itemID: 'CONS0002',
        itemType: ItemTypes[1],
        rarity: 5,
        effects: ['EFF0002']
    },
    {
        note: 'Concentrated Rainbow Potion',
        itemID: 'CONS0003',
        itemType: ItemTypes[1],
        rarity: 4,
        effects: ['EFF0004']
    }
];

export default Consumables;
