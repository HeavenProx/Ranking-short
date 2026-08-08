import { mkdir } from "node:fs/promises";
import { itemsVisibles } from "../core/timeline.js";
import { drawImage } from "./draw-overlay.js";
import type { Spec } from "../core/spec.js";
import path from "node:path";

const INTERVALLE = 2;
const DUREE = 10;

export async function genererSequence(spec: Spec, dossier: string): Promise<void> {

    // creer le dossier
    await mkdir(dossier, { recursive: true })

    // calculer le nombre total de frame
    const totalFrame = spec.framerate*DUREE;

    // boucle 
    for (let index = 0; index < totalFrame; index++) {
        const nbItemVisible = itemsVisibles(index, spec.framerate, spec.listItems.length, INTERVALLE)
        const image = drawImage(spec, nbItemVisible);
        const nameFrame = "frame-" + String(index).padStart(4, "0");
        const completeName = path.join(dossier, nameFrame + ".png");
        await image.toFile(completeName);
    }

    console.log("Nombre de frame crée : ", totalFrame);
}