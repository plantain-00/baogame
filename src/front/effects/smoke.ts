export class Smoke {
    life: number;
    totalLife: number;
    chaos: number;
    constructor(public x: number, public y: number, public size: number, life: number) {
        this.life = Math.floor(life);
        this.totalLife = Math.random() * 60 + 30;
        this.chaos = Math.random() * 4 - 2;
    }
    draw(ctx: CanvasRenderingContext2D, t: number) {
        t += this.chaos;
        const g = t < 5 ? 255 - Math.floor(t * 50) : Math.min(255, Math.floor(t * 20));
        const b = t < 5 ? 0 : Math.min(255, Math.floor(t * 20));
        const a = (this.totalLife - this.life) / this.totalLife;
        ctx.fillStyle = "rgba(255, " + g + ", " + b + ", " + a + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
