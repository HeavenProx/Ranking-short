import { loadSpec } from "./load-spec";
import { drawImage } from "../renderer/draw-overlay";

const path = process.argv[2] ?? "examples/demo.json";

const retour = await loadSpec(path);
console.log("Title : " + retour.title);
console.log("Item's number : ", retour.listItems.length);
await drawImage(retour);