import CommandArgs from "../../classes/CommandArgs";
import fetch from 'node-fetch';

const getMangaInformation = (mangaTitle: string) => {
    const apiURL = `https://api.jikan.moe/v3/search/manga/?q=${encodeURI(mangaTitle)}&page=1`;

    return new Promise((resolve, reject) => {
        fetch(apiURL)
            .then((response) => {
                return response.json();
            })
            .then((json)=>{
                resolve(json.results);
            })
            .catch((err) => {
                console.log(err);
                reject(new Error('Error retrieving manga'));
            })
    })
};

const manga = (args: CommandArgs) => {
    if (args.message.content.length === 0) {
        return args.sendErrorEmbed({contents: 'Please specify the title of the manga'});
    }

    const mangaTitle = args.message.content;

    args.message.channel.startTyping();

    getMangaInformation(mangaTitle)
        .then((mangaResults) => {
            console.log(mangaResults);
            const manga = mangaResults[0];
            args.sendOKEmbed({
                title: manga.title,
                contents: `\n\n**Synopsis**: ${manga.synopsis}\n\n**Volumes**: ${manga.volumes}`,
                url: manga.url,
                footer: `Rating: ${manga.score ? manga.score : ' No rating data available'}`,
                image: manga.image_url
            });

            return args.message.channel.stopTyping()
        })
        .catch((err) => {
            console.log(err);
            args.sendErrorEmbed({contents: 'Error retrieving manga'});
        })
};

export const action = manga;
