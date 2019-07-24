import CommandArgs from "../../classes/CommandArgs";
import fetch from 'node-fetch';

const rssFeedUrl = "https://community.blackdesertonline.com/index.php?forums/patch-notes.5/index.rss";
const updatesUrl = "https://www.blackdesertonline.com/news/list/update";
const linkElement = "list_news";


const getPatchNotesNew = (args) => {
    fetch(updatesUrl)
        .then((result) => {
            return result.text();
        })
        .then((xml) => {

            const cheerio = require('cheerio');
            const $ = cheerio.load(xml);
            const listNews = $('a[class=link_news]').toArray();
            const newsStrings = $('strong[class=subject_news]').toArray();
            // console.log(listNews);


            // for(let i = 0; i < listNews.length; i++){
            //     const newsString = newsStrings[i].children[0].data;
            //     const link = listNews[i].attribs.href;
            //     const newsLink = `https://www.blackdesertonline.com${link}`;
            //
            //     console.log(newsString, newsLink);
            // }
            //
            const pnString = newsStrings[0].children[0].data;
            const link = listNews[0].attribs.href;
            const newsLink = `https://www.blackdesertonline.com${link}`;


            args.sendOKEmbed({
                contents: `${pnString}\n${newsLink}`
            });
        })
        .catch((err) => {
            console.log(err);
            console.log('err');
            args.sendErrorEmbed({
                contents: 'A network error occurred while retrieving patchnotes'
            });
        })
};

const getPatchNotesLegacy = (args) => {
    const history = Math.min((parseFloat(args.message.content) || 1), 10);

    const parser = require('fast-xml-parser');
    fetch(rssFeedUrl)
        .then((result) => {
            return result.text();
        })
        .then((xml) => {

            const tobj = parser.getTraversalObj(xml);
            const json = parser.convertToJson(tobj);

            const pn = json.rss.channel.item;

            let pnString = '';

            for (let i = 0; i < history; i++) {
                pnString += `${pn[i].title}\n${pn[i].link} \n\n`
            }

            let embedArgs = {
                title: 'Patch Notes',
                contents: pnString
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

const patchnotes = (args: CommandArgs) => {

    const history = Math.min((parseFloat(args.message.content) || 1), 10);

    if (history === 1) {
        getPatchNotesNew(args);
    } else if (history > 1) {
        getPatchNotesLegacy(args);
    }
};

export const action = patchnotes;
