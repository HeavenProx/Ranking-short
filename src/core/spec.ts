import { z } from "zod";

export const sourceSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("file"), path: z.string() })
]);
export type Source = z.infer<typeof sourceSchema>

export const rankSchema = z.literal([1, 2, 3, 4, 5]);
export type Rank = z.infer<typeof rankSchema>;

export const itemSchema = z.object({
    rank: rankSchema,
    text: z.string().min(5),
    source: sourceSchema
})
export type Item = z.infer<typeof itemSchema>

export const specSchema = z.object({
    title: z.string(),
    height: z.number().min(1079).int(),
    width: z.number().min(719).int(),
    framerate: z.number().min(23).int(),
    listItems: z.array(itemSchema).nonempty()
})
export type Spec = z.infer<typeof specSchema>

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