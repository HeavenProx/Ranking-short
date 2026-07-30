import { spawn } from "node:child_process";

export function executer(cmd: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);
    let erreurs = "";
    proc.stderr.on("data", (d) => (erreurs += d.toString()));
    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} a échoué (code ${code}) : ${erreurs.slice(0, 200)}`));
    });
    proc.on("error", reject);  
  });
}