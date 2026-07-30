import { specSchema, type Spec } from "./spec.js"
import { z } from "zod";

type objectDatas = { ok: true, data: Spec } |  { ok: false, message: string };

// Valide la Spec récupéré, passé par loadSpec()
export function validerSpec(datas: unknown): objectDatas {

    // Vérifie le schéma de la Spec
    const result = specSchema.safeParse(datas);

    // Si schéma n'approuve pas = pas bon
    if(!result.success){
        const falseResult: objectDatas = {
            ok: false,
            message: z.prettifyError(result.error)
        }
        return falseResult;
    }

    // Si schéma approuve = ok
    const goodResult: objectDatas = {
        ok: true,
        data: result.data
    }
    return goodResult;
}
