import CommandArgs from "../../classes/CommandArgs";
import fetch from 'node-fetch';
import EmbedArgs from "../../../src/classes/EmbedArgs";

const rssFeedUrl = "https://community.blackdesertonline.com/index.php?forums/patch-notes.5/index.rss";
const rssToJSONUrl = "https://feed2json.org/convert?url=";

const patchnotes = (args: CommandArgs) => {
    const requestUrl = `${rssToJSONUrl}${encodeURI(rssFeedUrl)}`;
    const limit = 1;

    fetch(requestUrl)
        .then((result) => {
            return result.json();
        })
        .then((json) => {
            const patchnotes = json.items;
            let embedArgs = {
                title: 'Patch Notes',
                contents: `${patchnotes[0].title}\n${patchnotes[0].url} `
            };
            args.sendOKEmbed(embedArgs);
        })
        .catch((err) => {
            console.log('err');
            args.sendErrorEmbed({
                contents: 'A network error occurred while retrieving patchnotes'
            });
        })
};

export const action = patchnotes;