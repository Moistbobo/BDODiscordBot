import CommandArgs from "../../classes/CommandArgs";
import RPGRecipe from "../../models/rpg/RPGRecipes";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";
import RPGTools from "../../tools/rpg/RPGTools";

/**
 * Output entire list of craftable items
 * @param args
 */
const craftRecipes = (args: CommandArgs) => {

    IsChannelRPGEnabled(args)
        .then(() => {
            return RPGRecipe.find();
        })
        .then((recipes) => {
            let outputString = '';

            let counter = 0;
            recipes.forEach((x: any) => {
                let tempString = replace(args.strings.craftrecipes.recipeString, [
                        RPGTools.GetRecipeName(x.recipeID),
                        RPGTools.GetRecipeDesc(x.recipeID),
                        RPGTools.GetItemName(x.resultItemID),
                        counter++
                    ],
                    false);

                outputString += tempString + '\n\n';
            });

            outputString += args.strings.craftrecipes.reminder;
            return args.message.author.send(outputString);
        })
        .then(() => {
            args.message.react('📧');
        })
        .catch((err) => {
            console.log('[CRAFT RECIPES COMMAND]: ', err);
        })
};

export const action = craftRecipes;
