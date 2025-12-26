interface ContentJSON {
    blocks: any[];
    time: number;
    version: string;
}

export interface Doc {
    id: number,
    name: string,
    content: ContentJSON
}