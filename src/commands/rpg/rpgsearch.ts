import CommandArgs from "../../classes/CommandArgs";
import replace from "../../tools/replace";
import levenshtein from 'js-levenshtein';

// Simple caching for search values
let searchDB = null;


const putIDIntoValueArray = (stringJSON: any): [] => {
    const keys: any = Object.keys(stringJSON);
    const values: any = Object.values(stringJSON);

    for (let i = 0; i < values.length; i++) {
        const id = keys[i];
        values[i].id = id;
    }
    return values;
};

// NTS extend this to call DB and retrieve item data
const rpgSearch = (args: CommandArgs) => {
    if (!searchDB) {
        console.log('Search DB does not exist... building');
        const itemsArray = putIDIntoValueArray(args.strings.items);
        const recipesArray = putIDIntoValueArray(args.strings.recipes);
        const monstersArray = putIDIntoValueArray(args.strings.monsters);

        const finalArray = itemsArray.concat(recipesArray, monstersArray);
        searchDB = finalArray;
    }

    const searchTerm = args.message.content.toLowerCase();
    // const foundEntity = searchDB.find((e) => e.id.toLowerCase() === searchTerm || e.name.toLowerCase() === searchTerm);
    let foundList = searchDB.filter((e) => e.id.toLowerCase() === searchTerm || e.name.toLowerCase() === searchTerm);

    if (foundList.length === 0) {
        foundList = searchDB.filter((e) => levenshtein(e.name.toLowerCase(), searchTerm) < 8);
    }

    if (foundList.length > 1) {
        const outputString = foundList.map((value) =>`${value.name}`).join('\n');
        args.sendOKEmbed({
            contents: replace(args.strings.rpgsearch.didYouMean, [outputString])
        });
    } else if (foundList.length === 1) {
        const foundEntity = foundList[0];
        args.sendOKEmbed({
            title: foundEntity.name,
            contents: foundEntity.description,
            footer: replace(args.strings.rpgsearch.footerString, [foundEntity.id], false)
        })
    } else {
        args.sendErrorEmbed({
            contents: replace(args.strings.rpgsearch.noResult, [searchTerm])
        })
    }
};

export const action = rpgSearch;
