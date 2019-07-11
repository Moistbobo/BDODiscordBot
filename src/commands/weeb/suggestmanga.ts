import CommandArgs from "../../classes/CommandArgs";
import GenreMappings from "../../resources/weeb-genre-mappings";
import fetch from 'node-fetch';

const regex = /(?=\b\d+)/;

const containsNumber = (string: string): boolean => {
    return regex.test(string);
};

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * Math.floor(max));
};

const getRandomGenre = (): string => {
    const genreList = Object.keys(GenreMappings.manga);
    return genreList[getRandomInt(genreList.length - 1)].toString();
};

const suggestmanga = (args: CommandArgs) => {
    // .suggestManga [genre] [genre2?] [page]
    args.message.channel.startTyping();
    let queryString = args.message.content;

    if (queryString.split(' ').length > 4) {
        return args.sendErrorEmbed({contents: 'Invalid number of arguments given.'})
    }

    if (queryString.length < 1) {
        queryString = getRandomGenre();
    }

    // Append 1 if no page is given
    if (!containsNumber(queryString)) {
        queryString = `${queryString} 1`;
    }

    // Split the arguments by the position of the page number
    let apiArgs = queryString.split(regex);
    // Trim white spaces from strings as we are not using space as the delimiter
    apiArgs = apiArgs.map((value) => value.trim());

    const apiURL = `https://api.jikan.moe/v3/genre/manga/${GenreMappings.manga[apiArgs[0]]}/${apiArgs[1]}`

    fetch(apiURL)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.statusStrings === 429) {
                args.sendErrorEmbed({contents: 'Request was rate limited. Please try again later'});
            } else if (response.statusStrings > 400){
                args.sendErrorEmbed({contents: 'Error retrieving manga list'});
            }
        })
        .then((json) => {
            const mangalist = json.manga;
            const suggestedManga = mangalist[getRandomInt(mangalist.length - 1)];
            console.log(suggestedManga);
            args.sendOKEmbed({
                title: suggestedManga.title,
                contents: `\n\n**Synopsis**: ${suggestedManga.synopsis}\n\n**Volumes**: ${suggestedManga.volumes}`,
                url: suggestedManga.url,
                footer: `Rating: ${suggestedManga.score ? suggestedManga.score : ' No rating data available'}`,
                image: suggestedManga.image_url
            });
        })
        .catch((err) => {
            console.log(err);
        });
    args.message.channel.stopTyping();
};

export const action = suggestmanga;
