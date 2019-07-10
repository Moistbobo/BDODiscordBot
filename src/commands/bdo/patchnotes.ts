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

            const patchNotesLink = json.rss.channel.link;
            const pn = json.rss.channel;


            let embedArgs = {
                title: 'Patch Notes',
                contents: `${pn.title} - ${pn.pubDate}\n${patchNotesLink} `
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
