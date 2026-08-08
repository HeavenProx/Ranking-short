import { executer } from "../encoder/executer"
import type { Spec } from "../core/spec"

export async function composer(spec: Spec, entree: string, frames: string, sortie: string): Promise<void> {
    await executer("ffmpeg",
        ["-i", entree, 
            "-framerate", `${spec.framerate}`, 
            "-i", frames, 
            "-filter_complex", `[0:v]scale=${spec.width}:${spec.height}[bg];[bg][1:v]overlay=0:0[v]`,  
            "-map", "[v]", 
            "-map", "0:a:0", 
            "-y", sortie
        ]
    );

}