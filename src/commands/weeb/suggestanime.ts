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
    const genreList = Object.keys(GenreMappings.anime);
    return genreList[getRandomInt(genreList.length - 1)].toString();
};

const suggestAnime = (args: CommandArgs) => {
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

    const apiURL = `https://api.jikan.moe/v3/genre/anime/${GenreMappings.anime[apiArgs[0]]}/${apiArgs[1]}`;

    fetch(apiURL)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 429) {
                args.sendErrorEmbed({contents: 'Request was rate limited. Please try again later'});
            } else if (response.status > 400){
                args.sendErrorEmbed({contents: 'Error retrieving Anime list'});
            }
        })
        .then((json) => {
            const animelist = json.anime;
            const suggestedAnime = animelist[getRandomInt(animelist.length - 1)];
            args.sendOKEmbed({
                title: suggestedAnime.title,
                contents: `\n\n**Synopsis**: ${suggestedAnime.synopsis}\n\n**Episodes**: ${suggestedAnime.episodes}`,
                url: suggestedAnime.url,
                footer: `Rating: ${suggestedAnime.score ? suggestedAnime.score : ' No rating data available'}`,
                image: suggestedAnime.image_url
            });
        })
        .catch((err) => {
            console.log(err);
        });
    args.message.channel.stopTyping();
};

export const action = suggestAnime;