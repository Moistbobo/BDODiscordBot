import {Document, Schema, model} from 'mongoose';

export interface IItem extends Document {
    itemID: string,
    itemType: string,
    effects: [string],
    rarity: number,
    baseDamage: number,
    enchantLevel: number
    qty: number,
    stackable: boolean,
    requirements:{
        str: number,
        int: number
    }
}

export const ItemTypes = ['weapon', 'item-healing', 'material', 'item-buff'];

export const ItemSchema = new Schema({
    itemID: {
        type: String,
        required: true,
        unique: true
    },
    itemType: {
        type: String,
        enum: ItemTypes
    },
    effects: {
        type: [String]
    },
    qty: Number,
    rarity: Number,
    baseDamage: Number,
    enchantLevel: {
        type: Number,
        min: 0,
        max: 15
    },
    stackable: Boolean,
    requirements:{
        str:{
            type: Number,
            required:true,
            default: 0
        },
        int:{
            type:Number,
            required:true,
            default: 0
        }
    }
});

const Item = model<IItem>('Item', ItemSchema);
export default Item;
