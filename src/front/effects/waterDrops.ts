export class WaterDrops {
    life = 100;
    drops: { x: number; y: number; vx: number; vy: number }[] = [];
    constructor(public x: number, public y: number, vy: number, public height: number) {
        for (let i = 0; i < 1 - vy * 2; i++) {
            this.drops.push({
                x: 0, y: 0, vx: Math.random() * 4 - 2, vy: -Math.random() * vy / 1.5 + 1,
            });
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = "#95a";
        for (const drop of this.drops) {
            if (drop.y >= 0) {
                drop.y += drop.vy;
                drop.vy -= .2;
                drop.x += drop.vx;
                ctx.beginPath();
                ctx.arc(drop.x + this.x, this.height - drop.y - this.y, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
    }
}
