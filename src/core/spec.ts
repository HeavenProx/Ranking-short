export interface SourceFichier {
    type: "file",
    path: string
}

export type Source = SourceFichier;

export type Rank = 1 | 2 | 3 | 4 | 5;

export interface Item {
    rank: Rank,
    text: string,
    source: Source
}

export interface Spec {
    title: string,
    readonly height: number,
    readonly width: number,
    readonly framerate: number,
    readonly listItems: ReadonlyArray<Item>
}

export function consommeSource(source: Source): string {
    switch (source.type) {
        case "file":
            return "Une source de type fichier";
        default: {
            const _exhaustif: never = source.type;
            return _exhaustif;
        }
    }
}
