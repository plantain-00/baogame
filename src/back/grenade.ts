import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

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

export function update(grenade: Grenade) {
    grenade.x += grenade.vx;
    grenade.r += grenade.vx / 5;
    if (grenade.x < 0 || grenade.x > common.w) {
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
        explode(grenade.x, grenade.y, grenade.creater, 100);
    }
}

export function throwGrenade(user: services.user.User) {
    const grenade = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 100,
        r: 0,
        dead: false,
        creater: user,
    };
    const vx = user.faceing * (15 + user.grenadeing) / 5;
    let vy = user.grenadeing / 3;

    if (user.crawl) {
        vy = 0;
    }

    grenade.x = user.x - user.faceing * 20;
    grenade.y = user.y + common.userHeight;
    grenade.vx = user.vx + vx;
    grenade.vy = user.vy + vy;

    core.grenades.push(grenade);
}

export function explode(x: number, y: number, byUser: services.user.User, power: number) {
    for (const user of core.users) {
        const ux = user.x;
        const uy = user.y + common.userHeight;
        const distance = (ux - x) ** 2 + (uy - y) ** 2;
        if (distance < power * power) {
            services.user.killed(user, "bomb", byUser);
        } else if (distance < 2.25 * power * power) {
            const r = Math.atan2(uy - y, ux - x);
            const force = 450 * power / (distance + 2500);
            user.vx += force * Math.cos(r);
            user.vy += force * Math.sin(r);
            user.danger = true;
        }
    }
    core.announce({ kind: common.ProtocolKind.explode, explode: { x, y, power } });
}
