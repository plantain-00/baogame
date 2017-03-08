import { Smoke } from "./smoke";

export interface Flare {
    txt: string;
    life: number;
    smokes: Smoke[];
    x: number;
    y: number;
    height: number;
}

export function create(x: number, y: number, power: number, height: number, large?: boolean): Flare {
    const flare: Flare = {
        txt: " 嘭！",
        life: 70,
        smokes: [],
        x,
        y,
        height,
    };
    if (large) {
        for (let j = 0; j < 15; j++) {
            const r = j / 3 - .8 + Math.random() * .5 - .25;
            const len = Math.random() * 30 + 15;
            for (let i = 0; i < len; i++) {
                flare.smokes.push(new Smoke(
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
                flare.smokes.push(new Smoke(
                    i * 5 * Math.sin(r),
                    -i * 5 * Math.cos(r) + i * i / 10,
                    3 * Math.pow((len - i) / len, .8) * (Math.random() + 2),
                    -i + Math.random() * len,
                ));
            }
        }
    }
    return flare;
}
export function draw(ctx: CanvasRenderingContext2D, flare: Flare) {
    ctx.save();
    ctx.translate(flare.x, flare.height - flare.y);
    ctx.fillStyle = "#fff";
    ctx.font = "34px 宋体";
    ctx.fillText(flare.txt, 0, flare.life - 80);
    ctx.font = "14px 宋体";
    for (const smoke of flare.smokes) {
        smoke.life++;
        if (smoke.life > 0 && smoke.life < smoke.totalLife) {
            smoke.draw(ctx, 70 - flare.life);
        }
    }
    ctx.restore();
}
