export class ShotLine {
    life = 20;
    constructor(public x: number, public y: number, public dir: any, public height: number, public width: number) { }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(255,255,0," + (this.life) / 20 + ")";
        ctx.beginPath();
        if (this.dir === 1) {
            ctx.moveTo(this.x + 40, this.height - this.y);
            ctx.lineTo(this.width, this.height - this.y);
        } else {
            ctx.moveTo(this.x - 40, this.height - this.y);
            ctx.lineTo(0, this.height - this.y);
        }
        ctx.stroke();
    }
}
