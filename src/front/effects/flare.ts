import { Smoke } from "./smoke";

export class Flare {
    txt = " 嘭！";
    life = 70;
    smokes: Smoke[] = [];
    constructor(public x: number, public y: number, power: number, public height: number, large?: boolean) {
        if (large) {
            for (let j = 0; j < 15; j++) {
                const r = j / 3 - .8 + Math.random() * .5 - .25;
                const len = Math.random() * 30 + 15;
                for (let i = 0; i < len; i++) {
                    this.smokes.push(new Smoke(
                        i * .04 * power * Math.sin(r),
                        -i * .04 * power * Math.cos(r) + i * i * power / 3000,
                        5 * Math.pow((len - i) / len, .6) * (Math.random() + 2),
                        -i + Math.random() * len,
                    ));
                }
            }
        } else {
            for (let j = 0; j < 5; j++) {
                const r = j / 3 - .8 + Math.random() * .5 - .25;
                const len = Math.random() * 20 + 10;
                for (let i = 0; i < len; i++) {
                    this.smokes.push(new Smoke(
                        i * 5 * Math.sin(r),
                        -i * 5 * Math.cos(r) + i * i / 10,
                        3 * Math.pow((len - i) / len, .8) * (Math.random() + 2),
                        -i + Math.random() * len,
                    ));
                }
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.height - this.y);
        ctx.fillStyle = "#fff";
        ctx.font = "34px 宋体";
        ctx.fillText(this.txt, 0, this.life - 80);
        ctx.font = "14px 宋体";
        for (const smoke of this.smokes) {
            smoke.life++;
            if (smoke.life > 0 && smoke.life < smoke.totalLife) {
                smoke.draw(ctx, 70 - this.life);
            }
        }
        ctx.restore();
    }
}
