export class Toast {
    x: any;
    y: any;
    dy = -60;
    size: number;
    txt: string;
    life = 40;
    t = 0;
    constructor(user: any, public height: number) {
        this.x = user.x;
        this.y = user.y;
        this.size = user.size;
        this.txt = user.txt;
    }
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
