export type ShotLine = {
    life: number;
    x: number;
    y: number;
    dir: number;
    height: number;
    width: number;
};

export function create(x: number, y: number, dir: number, height: number, width: number) {
    return {
        life: 20,
        x,
        y,
        dir,
        height,
        width,
    };
}

export function draw(ctx: CanvasRenderingContext2D, shotLint: ShotLine) {
    ctx.strokeStyle = `rgba(255,255,0,${(shotLint.life) / 20})`;
    ctx.beginPath();
    if (shotLint.dir === 1) {
        ctx.moveTo(shotLint.x + 40, shotLint.height - shotLint.y);
        ctx.lineTo(shotLint.width, shotLint.height - shotLint.y);
    } else {
        ctx.moveTo(shotLint.x - 40, shotLint.height - shotLint.y);
        ctx.lineTo(0, shotLint.height - shotLint.y);
    }
    ctx.stroke();
}
