import { loadSpec } from "./load-spec";
import { genererSequence } from "../renderer/sequence"
import { composer } from "../encoder/composer"

const path = process.argv[2] ?? "examples/demo.json";

const retour = await loadSpec(path);
console.log("Title : " + retour.title);
console.log("Item's number : ", retour.listItems.length);
await genererSequence(retour, "out/frames/");
try {
    await composer(retour, "assets/test.mp4", "out/frames/frame-%04d.png", "out/final.mp4");
} catch (error) {
    if (error instanceof Error) {
        console.error("Error while create the video :", error.message);
    } else {
        console.error("Other error while created the video :", error);
    }
    process.exit(1)
}