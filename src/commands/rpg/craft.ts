import CommandArgs from "../../classes/CommandArgs";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGRecipe, {IRPGRecipe} from "../../models/rpg/RPGRecipes";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IItem} from "../../models/rpg/Item";
import ItemFactory from "../../models/rpg/Factories/ItemFactory";
import RPGTools from "../../tools/rpg/RPGTools";

const doesPlayerHaveReqMats = (inventory: [IItem], recipe: IRPGRecipe) => {
    // First check player has the required items
    let requiredItems = {};
    for (let i = 0; i < recipe.materialsID.length; i++) {
        requiredItems[recipe.materialsID[i]] = recipe.qty[i];
    }

    for (let matID of recipe.materialsID) {
        const matInInventory = inventory.find((item) => item.itemID === matID);
        if (!matInInventory) {
            return false;
        }

        if (matInInventory.qty < requiredItems[matID]) {
            return false;
        }
    }

    return true;
};

const adjustPlayerMaterials = (inventory: [IItem], recipe: IRPGRecipe) => {
    const matReqCount = recipe.qty;
    const matReqID = recipe.materialsID;
    let counter = 0;

    for (let matID of matReqID) {
        const reqMatCount = matReqCount[counter++];
        const itemIndexPlayer = inventory.findIndex((item) => item.itemID === matID);
        // Remove item from player inventory if they have the right amount
        // Otherwise decrease the item count by the recipe's required amount
        if (inventory[itemIndexPlayer].qty === reqMatCount) {
            inventory.splice(itemIndexPlayer, 1);
        } else {
            inventory[itemIndexPlayer].qty -= reqMatCount
        }
    }

    return inventory;
};

const craft = (args: CommandArgs) => {
    const userID = args.message.author.id;
    const recipeIndex = parseInt(args.message.content);

    if (isNaN(recipeIndex) || recipeIndex < 0) return args.sendErrorEmbed({
        contents: replace(args.strings.craft.invalidIndex,
            [
                args.message.author.username,
                recipeIndex])
    });

    let rpgCharacter = null;
    let charInventory = null;
    let recipes = null;

    IsChannelRPGEnabled(args)
        .then(() => Promise.all([RPGRecipe.find(), FindOrCreateNewRPGCharacter(userID)]))
        .then((res: any) => {
            recipes = res[0];
            rpgCharacter = res[1];
            charInventory = rpgCharacter.inventory;

            const craftedItemID = recipes[recipeIndex].resultItemID;

            if (recipeIndex > recipes.length - 1) {
                args.sendErrorEmbed({
                    contents: replace(args.strings.craft.invalidIndex,
                        [
                            args.message.author.username,
                            recipeIndex])
                });

                throw new Error('Specified index exceeds recipe array length');
            }

            const matCheck = doesPlayerHaveReqMats(charInventory, recipes[recipeIndex]);
            if (!matCheck) {
                const contents = replace(args.strings.craft.invalidMaterials,
                    [args.message.author.username,
                        RPGTools.GetItemName(craftedItemID)
                    ]);
                args.sendErrorEmbed({contents});
                throw new Error('User does not have required materials')
            }

            // Player has passed all checks, reduce amount of items in their inventory and
            // give them the crafted weapon
            rpgCharacter.inventory = adjustPlayerMaterials(charInventory, recipes[recipeIndex]);
            return rpgCharacter.save();

        })
        .then(() => {
            // console.log('Inventory before:', charInventory);
            return RPGTools.AddItemToUserInventory(args.message.author.id, recipes[recipeIndex].resultItemID);
        })
        .then(() => {
            const contents = replace(args.strings.craft.craftSuccess,
                [args.message.author.username,
                    RPGTools.GetItemName(recipes[recipeIndex].resultItemID)]);
            args.sendOKEmbed({contents});
        })
        .catch((err) => {
            console.log('[CRAFT COMMAND]:', err);
        })
};

export const action = craft;
