import { type Spec } from "../core/spec"
import { Canvas } from "skia-canvas";

export function randomRgbColor(): string {
  const min = 125;
  const max = 225;
  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  const g = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return `rgb(${r}, ${g}, ${b})`;
}

export async function drawImage(spec: Spec): Promise<void> {
    const canvas = new Canvas(spec.width, spec.height);
    const ctx = canvas.getContext("2d");

    // Title
    ctx.fillStyle = "White";
    ctx.font = "bold 60px sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(spec.title, spec.width / 2, 120);

    spec.listItems.forEach((item, i) => {
        // Rank Number
        ctx.fillStyle = "Red";
        ctx.font = "bold 50px sans";
        const yRankText = 700 + i * 120;
        const number = `${item.rank}.`;
        ctx.fillText(number, 70, yRankText);

        // Rank Text
        ctx.font = "bold 40px sans";
        ctx.fillStyle = randomRgbColor();
        const largeur = ctx.measureText(number).width;
        ctx.fillText(item.text, 125 + largeur, yRankText);
    })

    await canvas.toFile(`out/overlay.png`);
}