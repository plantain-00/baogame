export class Toast {
    dy = -60;
    life = 40;
    t = 0;
    constructor(public x: number, public y: number, public size: number, public txt: string, public height: number) { }
    draw(ctx: CanvasRenderingContext2D) {
        this.t++;
        ctx.save();
        if (this.life < 10) {
            this.dy -= (10 - this.life) / 4;
            ctx.globalAlpha = this.life / 10;
        }
        ctx.translate(this.x, this.height - this.y);
        ctx.scale(Math.min(this.t / 5, 1), Math.min(this.t / 5, 1));
        ctx.fillStyle = "#fff";
        ctx.font = this.size + "px 宋体";
        ctx.fillText(this.txt, 0, this.dy);
        ctx.font = "14px 宋体";
        ctx.restore();
    }
}
