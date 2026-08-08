import { type Spec } from "../core/spec"
import { Canvas } from "skia-canvas";

export function randomRgbColor(rank: number): string {
    const h = Math.floor((rank*70) % 365);
    // Saturation : 40% à 100% pour éviter les couleurs ternes
    const s = Math.floor((rank*48) % 365)
    // Luminosité : 30% à 70% pour éviter trop sombre ou trop clair
    const l = Math.floor((rank*17) % 365)
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// Adapte ta fonction de la session 2 : au lieu de dessiner tous les 
// items, elle dessine seulement ceux visibles à une frame donnée. 
// Deux options de signature, à toi de choisir :
// - elle reçoit le numéro de frame et interroge la timeline, OU
// - elle reçoit directement le nombre d'items à afficher (plus pur)

// 💡 La 2e est plus propre : le renderer ne calcule rien, il reçoit l'état.
// Le calcul reste dans core. Préfère celle-là.

export function drawImage(spec: Spec, nbVisible: number): Canvas {
    const canvas = new Canvas(spec.width, spec.height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "Black";        
    ctx.fillRect(0, 0, 1080, 240);

    // Title
    ctx.fillStyle = "White";
    ctx.font = "bold 80px sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(spec.title, spec.width / 2, 120);

    const aAfficher = spec.listItems.slice(0, nbVisible);

    aAfficher.forEach((item, i) => {
        // Rank Number
        ctx.fillStyle = "Red";
        ctx.font = "bold 70px sans";
        const yRankText = 700 + i * 120;
        const number = `${item.rank}.`;
        ctx.fillText(number, 70, yRankText);

        // Rank Text
        ctx.font = "bold 60px sans";
        ctx.fillStyle = randomRgbColor(item.rank);
        const largeur = ctx.measureText(number).width;
        ctx.fillText(item.text, 140 + largeur, yRankText);
    })

    return canvas
}