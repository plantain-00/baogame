import * as services from "./services";

export class Grenade {
    x = 0;
    y = 0;
    vx = 0;
    vy = 0;
    life = 100;
    r = 0;
    dead = false;
    constructor(public creater: services.User) { }

    update() {
        this.x += this.vx;
        this.r += this.vx / 5;
        if (this.x < 0 || this.x > this.creater.game.props.w) {
            this.vx *= -1;
        }

        this.vy -= .2;
        this.vy = Math.max(this.vy, -6);

        if (this.vy > 0) {
            this.y += Math.floor(this.vy);
        } else {
            for (let i = 0; i < -this.vy; i++) {
                if (this.creater.game.map.onFloor(this.x, this.y)) {
                    if (this.creater.game.map.onLadder(this.x, this.y)) {
                        this.vx *= .7;
                    } else {
                        this.vy *= -.85;
                        break;
                    }
                }
                this.y--;
            }
        }
        if (this.y < 0) {
            this.dead = true;
        }
        this.life--;
        if (this.life < 0) {
            this.dead = true;
            this.creater.game.explode(this.x, this.y, this.creater, 100);
        }
    }
}
