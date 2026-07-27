import { loadSpec } from "../core/load-spec";

const path = process.argv[2] ?? "examples/demo.json";

const retour = loadSpec(path);
console.log("Titre " + retour.title + " & Nombre d'item : " + retour.listItems.length);