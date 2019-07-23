interface EmbedArgs {
    contents?: string;
    title?: string;
    footer?: string;
    author?: string;
    url?: string;
    image?: string;
    thumbnail?: string;
    extraFields?: [{
        name?: string,
        value?: string,
        inline?: boolean
    }
        ]
}

export default EmbedArgs;
