import CommandArgs from "../../classes/CommandArgs";
import fetch from 'node-fetch';

const rssFeedUrl = "https://community.blackdesertonline.com/index.php?forums/patch-notes.5/index.rss";
const rssToJSONUrl = "https://feed2json.org/convert?url=";

const patchnotes = (args: CommandArgs) =>{
    const requestUrl = `${rssToJSONUrl}${encodeURI(rssFeedUrl)}`;
    const limit = 1;

    fetch(requestUrl)
        .then((result)=>{
            if(result.ok){
                result.json()
                    .then((json)=>{
                        const patchnotes = json.items;
                        args.message.channel.send(`${patchnotes[0].title}\n${patchnotes[0].url} `)
                    })
                    .catch(err=>{
                        console.log(`[PATCHNOTES COMMAND]:\n${err}`);

                    })
            }else{
                console.log('err');
                args.message.channel.send(`An error occurred retrieving patchnotes`);
                console.log(result);
            }
        })
        .catch((err)=>{
            console.log('err');
            args.message.channel.send(`There was an error retrieving patchnoes`)
        })
};

export const action = patchnotes;