import { loadSpec } from "./load-spec";

const path = process.argv[2] ?? "examples/demo.json";

const retour = await loadSpec(path);
console.log("Title : " + retour.title);
console.log("Item's number : ", retour.listItems.length);
