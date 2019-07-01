import CommandArgs from "../../classes/CommandArgs";
import GenreMappings from "../../resources/weeb-genre-mappings";

const getGenreList = (args: CommandArgs) => {
    const mangaList = Object.keys(GenreMappings.manga);
    let mangaGenreListString = '';
    mangaList.map((genre) => {
        mangaGenreListString = mangaGenreListString + `${genre}, `
    });

    const animeList = Object.keys(GenreMappings.anime);
    let animeGenreListString = '';
    animeList.map((genre)=>{
        animeGenreListString = animeGenreListString + `${genre}, `;
    });

    args.sendOKEmbed({contents: `Manga genres:\n${mangaGenreListString}\n\nAnime genres:\n${animeGenreListString}`});
};

export const action = getGenreList;