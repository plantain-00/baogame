export class Brust {
    x: number;
    y: number;
    size: number;
    life = 100;
    drops: { x: number; y: number }[];
    vy = 2;
    constructor(u: any, count: any, w: any, public height: number, dx?: any, dy?: any, size?: any) {
        this.x = u.x;
        this.y = u.y;
        this.size = size || 6;
        this.drops = [];
        dx = dx || 0;
        dy = dy || 0;
        for (let i = 0; i < count; i++) {
            this.drops.push({
                x: Math.random() * w - w / 2 + dx,
                y: Math.random() * 10 - 5 + dy,
            });
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = this.life / 100;
        this.vy *= .95;
        for (const drop of this.drops) {
            drop.y -= this.vy;
            ctx.beginPath();
            ctx.arc(drop.x + this.x, this.height - drop.y - this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}
