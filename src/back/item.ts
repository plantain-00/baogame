import * as services from "./services";
import * as common from "./common";

const Items: services.Item[] = [];
for (const key in common.items) {
    Items.push((common.items as any)[key]);
}

export class Item {
    id: number;
    count: number;
    lifetime: number;
    slowdown: number;
    vx: number;
    vy: number;
    dead: boolean;
    x: number;
    y: number;
    constructor(public game: services.Game, type: number) {
        if (type === undefined) {
            type = Math.floor(Math.random() * Items.length);
        }
        this.id = Items[type].id;
        this.count = Items[type].count || 0;
        this.lifetime = 3000;
        this.slowdown = 0;
        this.vx = Math.random() + .5;
        this.vy = Math.random() + .5;
        this.dead = false;
    }
    update() {
        this.slowdown++;
        if (this.x >= this.game.props.w - this.game.props.itemSize || this.x <= this.game.props.itemSize) {
            this.vx *= -1;
        }

        if (this.y >= this.game.props.h - this.game.props.itemSize || this.y <= this.game.props.itemSize) {
            this.vy *= -1;
        }
        this.lifetime--;
        if (this.lifetime < 0) {
            this.dead = true;
        }
        if (this.slowdown < 100) {
            this.x += this.vx * this.slowdown / 100;
            this.y += this.vy * this.slowdown / 100;
        } else {
            this.x += this.vx;
            this.y += this.vy;
        }
    }
    touchUser(u: services.User) {
        if (this.id === common.items.drug.id) {
            this.dead = true;
            u.killed("drug");
        } else {
            this.dead = true;
            u.carry = this.id;
            u.carryCount = this.count;
        }
    }
    getData(): common.Item {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            dead: this.dead,
        };
    }
}
