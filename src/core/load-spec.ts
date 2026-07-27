import { readFileSync } from "node:fs"
import { specSchema, type Spec } from "./spec.js"
import { z } from "zod";

export function loadSpec(filePath: string): Spec {
    let datas: unknown;
    try {
        const jsonResultat = readFileSync(filePath, "utf8")
        datas = JSON.parse(jsonResultat);
    } catch(err: unknown) {
        if (err instanceof Error) {
            console.error("Erreur standard :", err.message);
        } else {
            console.error("Valeur inattendue capturée :", err);
        }
        process.exit(1)
    }

    const result = specSchema.safeParse(datas)
    if(!result.success){
        console.error(z.prettifyError(result.error))
        process.exit(1);
    }
    return result.data;
}
