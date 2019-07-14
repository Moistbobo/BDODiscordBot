import Weapons from '../../resources/rpg/itemData/items/weapons';
import Materials from '../../resources/rpg/itemData/items/materials';
import Item from "../../models/rpg/Item";
import DatabaseTools from "../DatabaseTools";
import Recipes from "../../resources/rpg/itemData/recipes/recipes";
import RPGRecipe from "../../models/rpg/RPGRecipes";
import RPGDropTable from "../../models/rpg/RPGDropTable";
import DropTableData from "../../resources/rpg/dropTables/DropTableData";

let itemCount = 0;
let count = 0;
const savedCallback = (err, res) => {
    if (err) console.log(err);
    // console.log(res);
    // console.log('');
    if (++count === itemCount) {
        console.log(`Saved Item: ${count}/${itemCount}`);
        console.log('Item database updated');
        process.exit(0);
    } else {
        console.log(`Saved Item: ${count}/${itemCount}`);
    }
};

const recipeSavedCallback = (err, res) => {
    console.log('Saving recipe/drop table...');
    if (err) console.log(err);
    console.log('Saved', res);

};

const buildItemDatabase = () => {
    DatabaseTools.connectToMongoDBPromise()
        .then(()=>{
            let Items = [];

            Weapons.forEach((x) => Items.push(x));
            Materials.forEach((x) => Items.push(x));

            itemCount = Items.length;


            Recipes.forEach((recipe) => {
                const options =
                    {
                        upsert: true,
                        setDefaultsOnInsert: true,
                    };

                RPGRecipe.update({recipeID: recipe.recipeID}, recipe, options, recipeSavedCallback);
            });

            Object.keys(DropTableData).forEach((dropTableID) => {
                const dt = DropTableData[dropTableID];
                const newDT = {
                    dropTableID,
                    table: dt
                };

                const options =
                    {
                        upsert: true,
                        setDefaultsOnInsert: true,
                    };

                console.log(dropTableID);
                RPGDropTable.update({dropTableID:dropTableID}, newDT, options, recipeSavedCallback);
            });

            Items.forEach((item: any) => {

                const options =
                    {
                        upsert: true,
                        setDefaultsOnInsert: true,
                    };
                Item.update({itemID: item.itemID}, item, options, savedCallback);
            });
        })
};

buildItemDatabase();
