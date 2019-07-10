import CommandArgs from "../../classes/CommandArgs";
import fetch from 'node-fetch';

const rssFeedUrl = "https://community.blackdesertonline.com/index.php?forums/patch-notes.5/index.rss";

const patchnotes = (args: CommandArgs) => {

    const parser = require('fast-xml-parser');
    fetch(rssFeedUrl)
        .then((result) => {
            return result.text();
        })
        .then((xml) => {

            const tobj = parser.getTraversalObj(xml);
            const json = parser.convertToJson(tobj);

            const pn = json.rss.channel.item[0];

            let embedArgs = {
                title: 'Patch Notes',
                contents: `${pn.title}\n${pn.link} `
            };
            args.sendOKEmbed(embedArgs);
        })
        .catch((err) => {
            console.log(err);
            console.log('err');
            args.sendErrorEmbed({
                contents: 'A network error occurred while retrieving patchnotes'
            });
        })
};

export const action = patchnotes;
