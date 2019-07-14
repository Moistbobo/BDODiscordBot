import CommandArgs from "../../classes/CommandArgs";
import RPGRecipe from "../../models/rpg/RPGRecipes";
import replace from "../../tools/replace";
import {IsChannelRPGEnabled} from "../../models/rpg/RPGServerStats";

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
                const recipeString = args.strings[x.recipeID];
                const craftedItemString = args.strings[x.resultItemID];
                let tempString = replace(args.strings.craftrecipes.recipeString, [recipeString.name,
                        `${recipeString.description}`,
                        craftedItemString.name,
                        counter++
                    ],
                    false);

                outputString += tempString;
            });

            outputString+= args.strings.craftrecipes.reminder;
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
