export class ItemDead {
    life = 40;
    constructor(public x: number, public y: number, public name: string, public height: number, public itemSize: number) { }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "rgba(255,255,255," + (this.life) / 40 + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.height - this.y, this.itemSize + (40 - this.life) / 2, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.font = (1600 - this.life * this.life) / 160 + 12 + "px 宋体";
        ctx.fillStyle = "#fff";
        ctx.fillText(this.name, this.x, this.height - this.y);
        ctx.font = "14px 宋体";
    }
}
