interface ExtraField{
    name?:string,
    value?:string,
    inline?:boolean
}

interface EmbedArgs {
    contents?: string;
    title?: string;
    footer?: string;
    author?: string;
    url?: string;
    image?: string;
    thumbnail?: string;
    extraFields?: Array<ExtraField>
}

export default EmbedArgs;
