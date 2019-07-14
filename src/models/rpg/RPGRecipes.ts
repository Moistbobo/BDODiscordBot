import {Document, Schema, model} from 'mongoose';

export interface IRPGRecipe extends Document{
    recipeID: string,
    materialsID: [string],
    qty: [number],
    resultItemID: [string]
}

export const RPGRecipeSchema = new Schema({
    recipeID: {
        type: String,
        required: true,
        unique: true
    },
    materialsID: [String],
    qty: [Number],
    resultItemID: [String]
});

const RPGRecipe = model<IRPGRecipe>('RPGRecipe', RPGRecipeSchema);
export default RPGRecipe;
