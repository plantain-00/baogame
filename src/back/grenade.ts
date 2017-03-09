import * as services from "./services";

export interface Grenade {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    r: number;
    dead: boolean;
    creater: services.user.User;
}

export function create(creater: services.user.User) {
    return {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 100,
        r: 0,
        dead: false,
        creater,
    };
}

export function update(grenade: Grenade) {
    grenade.x += grenade.vx;
    grenade.r += grenade.vx / 5;
    if (grenade.x < 0 || grenade.x > grenade.creater.game.props.w) {
        grenade.vx *= -1;
    }

    grenade.vy -= .2;
    grenade.vy = Math.max(grenade.vy, -6);

    if (grenade.vy > 0) {
        grenade.y += Math.floor(grenade.vy);
    } else {
        for (let i = 0; i < -grenade.vy; i++) {
            if (services.map.onFloor(grenade.x, grenade.y)) {
                if (services.map.onLadder(grenade.x, grenade.y)) {
                    grenade.vx *= .7;
                } else {
                    grenade.vy *= -.85;
                    break;
                }
            }
            grenade.y--;
        }
    }
    if (grenade.y < 0) {
        grenade.dead = true;
    }
    grenade.life--;
    if (grenade.life < 0) {
        grenade.dead = true;
        services.game.explode(grenade.creater.game, grenade.x, grenade.y, grenade.creater, 100);
    }
}
