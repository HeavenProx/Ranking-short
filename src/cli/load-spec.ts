import { readFile } from "node:fs/promises";
import { validerSpec } from "../core/validate-spec.js";
import type { Spec } from "../core/spec.js";

export async function loadSpec(filePath: string): Promise<Spec> {
    // 1. Va chercher la Spec
    let datas: unknown;
    try {
        const jsonResultat = await readFile(filePath, "utf-8");
        datas = JSON.parse(jsonResultat);
    } catch(err: unknown) {
        if (err instanceof Error) {
            console.error("Impossible to read the file :", err.message);
        } else {
            console.error("Wrong value captured :", err);
        }
        process.exit(1)
    }

    // 2. Vérifie données de la Spec
    const resultat = validerSpec(datas);

    if(!resultat.ok){
        console.error("Invalid Spec : ", resultat.message);
        process.exit(1);
    }

    // 3. Renvoie la Spec chargé + validé (par le schéma)
    return resultat.data;
}
