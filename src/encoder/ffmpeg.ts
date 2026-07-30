import { executer } from "./executer.js"

try {
  await executer("ffmpeg", [
    "-i", "../../out/overlay.mp4",     // fichier d'entrée
    "-t", "3",                   // garder 3 secondes
    "-y",                        // écraser la sortie si elle existe
    "../../out/test.mp4",           // fichier de sortie
  ]);
} catch (err){
  console.log("Error : ", err);
}