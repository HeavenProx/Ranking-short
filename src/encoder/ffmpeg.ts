import { executer } from "./executer.js"

export async function createVideo(enter: string, out: string, time: string, fps: number): Promise<void>{
  const optionFps = "fps=" + fps;
  
  await executer("ffmpeg", [
    "-loop", "1",                 // loop active 
    "-i", enter,                  // fichier d'entrée
    "-t", time,                   // garder X secondes
    "-filter:v", optionFps,       // fps         
    "-y",                         // supprime sortie si existant
    "-pix_fmt", "yuv420p",        // pixel format 
    out,                          // fichier de sortie
  ]);
}
