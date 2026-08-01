export function tempsFrame(frame: number, fps:number): number {
    return frame / fps;
}

export function itemsVisibles(frame: number, fps:number, total: number, intervalle: number): number {
    const temps = tempsFrame(frame, fps);
    const apparus = Math.min(Math.floor(temps / intervalle) + 1, total);
    return apparus;
}