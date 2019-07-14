import Weapons from '../../resources/items/weapons';
import Materials from '../../resources/items/materials';
import Item from "../../models/rpg/Item";
import DatabaseTools from "../DatabaseTools";
import Recipes from "../../resources/recipes/recipes";
import RPGRecipe from "../../models/rpg/RPGRecipes";

let itemCount = 0;
let count = 0;
const savedCallback = (err, res) => {
    if (err) console.log(err);
    console.log(res);
    console.log('');
    if (++count === itemCount) {
        console.log(`Saved Item: ${count}/${itemCount}`);
        console.log('Item database updated');
        process.exit(0);
    } else {
        console.log(`Saved Item: ${count}/${itemCount}`);
    }
};

const recipeSavedCallback = (err, res) => {
    if (err) console.log(err);
    console.log(res);

};

const buildItemDatabase = () => {
    DatabaseTools.connectToMongoDB();

    let Items = [];

    Weapons.forEach((x)=> Items.push(x));
    Materials.forEach((x)=>Items.push(x));

    itemCount = Items.length;

    Recipes.forEach((recipe)=>{
        const options =
            {
                upsert: true,
                setDefaultsOnInsert: true,
            };

        RPGRecipe.update({recipeID: recipe.recipeID}, recipe, options, recipeSavedCallback);
    });


    Items.forEach((item: any) => {

        const options =
            {
                upsert: true,
                setDefaultsOnInsert: true,
            };
        console.log(item.itemID);
        Item.update({itemID: item.itemID}, item, options, savedCallback);
    });
};

buildItemDatabase();
