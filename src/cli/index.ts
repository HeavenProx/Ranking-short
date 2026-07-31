import { loadSpec } from "./load-spec";
import { drawImage } from "../renderer/draw-overlay";
import { createVideo } from "../encoder/ffmpeg"

const path = process.argv[2] ?? "examples/demo.json";

const retour = await loadSpec(path);
console.log("Title : " + retour.title);
console.log("Item's number : ", retour.listItems.length);
await drawImage(retour);
try {
    await createVideo("out/overlay.png", "out/test.mp4", "10", retour.framerate);
} catch (error) {
    if (error instanceof Error) {
        console.error("Error while create the video :", error.message);
    } else {
        console.error("Other error while created the video :", error);
    }
    process.exit(1)
}

