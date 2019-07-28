import CommandArgs from "../../classes/CommandArgs";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGRecipe, {IRPGRecipe} from "../../models/rpg/RPGRecipes";
import {FindOrCreateNewRPGCharacter} from "../../models/rpg/RPGCharacter";
import replace from "../../tools/replace";
import {IItem} from "../../models/rpg/Item";
import RPGTools from "../../tools/rpg/RPGTools";

const confirmEmoji = '✅';

const doesPlayerHaveReqMats = (inventory: [IItem], recipe: IRPGRecipe, qty: number) => {
    // First check player has the required items
    let requiredItems = {};
    for (let i = 0; i < recipe.materialsID.length; i++) {
        requiredItems[recipe.materialsID[i]] = recipe.qty[i] * qty;
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

const adjustPlayerMaterials = (inventory: [IItem], recipe: IRPGRecipe, craftQty = 1) => {
    const matReqCount = recipe.qty;
    const matReqID = recipe.materialsID;
    let counter = 0;

    for (let matID of matReqID) {
        const reqMatCount = matReqCount[counter++] * craftQty;
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
    const qty = parseInt(args.message.content.split(' ')[1]) || 1;

    let warningMessage = null;

    if (isNaN(recipeIndex) || recipeIndex < 0) return args.sendErrorEmbed({
        contents: replace(args.strings.craft.invalidIndex,
            [
                args.message.author.username,
                recipeIndex])
    });

    let rpgCharacter = null;
    let charInventory = null;
    let recipes = null;
    const reactionFilter = (reaction, user) => {
        return reaction.emoji.name === confirmEmoji && user.id === args.message.author.id
    };

    IsChannelRPGEnabled(args)
        .then(() => Promise.all([RPGRecipe.find(), FindOrCreateNewRPGCharacter(userID)]))
        .then((res: any) => {
            [recipes, rpgCharacter] = res;
            charInventory = rpgCharacter.inventory;

            if (recipeIndex > recipes.length - 1) {
                args.sendErrorEmbed({
                    contents: replace(args.strings.craft.invalidIndex,
                        [
                            args.message.author.username,
                            recipeIndex])
                });

                throw new Error('Specified index exceeds recipe array length');
            }

            const craftedItemID = recipes[recipeIndex].resultItemID;

            const matCheck = doesPlayerHaveReqMats(charInventory, recipes[recipeIndex], qty);
            if (!matCheck) {
                const contents = replace(args.strings.craft.invalidMaterials,
                    [args.message.author.username,
                        RPGTools.GetItemName(craftedItemID),
                        qty
                    ]);
                args.sendErrorEmbed({contents});
                throw new Error('User does not have required materials')
            }


            // Checks passed, send confirm message

            const contents = replace(args.strings.craft.craftConfirm,
                [
                    args.message.author.username,
                    qty,
                    RPGTools.GetItemName(recipes[recipeIndex].resultItemID)
                ]);

            return args.sendOKEmbed({contents, footer: args.strings.craft.craftConfirmFooter});
        })
        .then((msg) => {
            warningMessage = msg;
            warningMessage.react(confirmEmoji);
            return warningMessage.awaitReactions(reactionFilter,
                {max: 1, time: 15000})
        })
        .then((collected) => {
            if (!collected.get(confirmEmoji).users) {
                warningMessage.delete();
                throw new Error('User did not react in time');
            }
            rpgCharacter.inventory = adjustPlayerMaterials(charInventory, recipes[recipeIndex], qty);
            return rpgCharacter.save();
        })
        .then(() => {
            return RPGTools.AddItemToUserInventory(args.message.author.id, recipes[recipeIndex].resultItemID, qty);
        })
        .then(() => {
            const contents = replace(args.strings.craft.craftSuccess,
                [args.message.author.username,
                    RPGTools.GetItemName(recipes[recipeIndex].resultItemID),
                    qty]);
            return warningMessage.edit(args.bot.createOKEmbed({contents}));
            // args.sendOKEmbed({contents});
        })
        .catch((err) => {
            warningMessage.delete();
            console.log('[CRAFT COMMAND]:', err);
        })
};

export const action = craft;
