import { z } from "zod";

export interface SourceFichier {
    type: "file",
    path: string
}

export type Source = SourceFichier;

const sourceSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("file"), path: z.string() })
]);


export type Rank = 1 | 2 | 3 | 4 | 5;

export interface Item {
    rank: Rank,
    text: string,
    source: Source
}

const itemSchema = z.object({
    rank: z.literal([1, 2, 3, 4, 5]),
    text: z.string().min(5),
    source: sourceSchema
})

export interface Spec {
    title: string,
    readonly height: number,
    readonly width: number,
    readonly framerate: number,
    readonly listItems: ReadonlyArray<Item>
}

export const specSchema = z.object({
    title: z.string(),
    height: z.number().min(1079).int(),
    width: z.number().min(719).int(),
    framerate: z.number().min(23).int(),
    listItems: z.array(itemSchema).nonempty()
})

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