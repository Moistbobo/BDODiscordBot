import CommandArgs from "../../classes/CommandArgs";
import GenreMappings from "../../resources/weeb-genre-mappings";

const getGenreList = (args: CommandArgs) => {

    const mangaList = Object.keys(GenreMappings.manga);
    let mangaGenreListString = '';
    mangaList.map((genre) => {
        mangaGenreListString = mangaGenreListString + `${genre} \n`
    });

    args.sendOKEmbed({contents: `Manga genres:\n${mangaGenreListString}\n\n`});

};

export const action = getGenreList;