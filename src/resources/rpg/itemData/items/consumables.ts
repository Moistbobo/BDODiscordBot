import {ItemTypes} from "../../../../models/rpg/Item";

const Consumables = [
    {
        itemID: 'CONS0001',
        itemType: ItemTypes[1],
        rarity: 2,
        effects: ['EFF0001'],
        note: 'Rainbow Potion'
    },
    {
        note: 'Choroids',
        itemID: 'CONS0002',
        itemType: ItemTypes[1],
        rarity: 5,
        effects: ['EFF0002']
    }

];

export default Consumables;
