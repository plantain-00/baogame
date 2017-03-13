import * as services from "./services";
import * as common from "./common";
import * as core from "./core";
import * as libs from "./libs";

export function createNPC(name: string) {
    const u = services.user.create(name);
    u.npc = true;
    return u;
}
export function createUser(name: string, ws?: libs.WebSocket) {
    const u = services.user.create(name, ws);
    const { x, y } = services.map.born();
    u.x = x;
    u.y = y + common.tileHeight / 2;
    return u;
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
    announce({ kind: "explode", explode: { x, y, power } });
}
export function checkShot(u: services.user.User) {
    const x = u.x;
    const y = u.y + common.userHeight * 2 / 3;
    const f = u.faceing;

    for (const user of core.users) {
        let uh = common.userHeight;
        if (user.crawl) {
            uh /= 2;
        }
        if (f < 0 && x > user.x && user.y <= y && user.y + uh >= y) {
            services.user.killed(user, "gun", u);
            user.vx = 6 * f;
        }

        if (f > 0 && x < user.x && user.y <= y && user.y + uh >= y) {
            services.user.killed(user, "gun", u);
            user.vx = 6 * f;
        }
    }
}
export function addMine(user: services.user.User) {
    const x = user.x + user.faceing * 40;
    if (services.map.onFloor(x, user.y)) {
        core.mines.push({
            x,
            y: user.y,
            creater: user,
        });
        return true;
    }
    return false;
}
export function checkMine(user: services.user.User) {
    for (let i = core.mines.length - 1; i >= 0; i--) {
        const mine = core.mines[i];
        if (Math.abs(user.x - mine.x) < 10 && Math.abs(user.y - mine.y) < 5) {
            services.user.killed(user, "mine", mine.creater);
            mine.dead = true;
            return true;
        }
    }
    return false;
}
export function announce(protocol: common.Protocol) {
    for (const user of core.users) {
        if (user.ws) {
            core.emit(user.ws, protocol);
        }
    }
}
export function update() {
    core.updateTick();
    services.map.update();
    for (const item of core.items) {
        services.item.update(item);
    }
    for (const grenade of core.grenades) {
        services.grenade.update(grenade);
    }
    // 碰撞检测
    for (let i = 0; i < core.users.length; i++) {
        for (let j = i + 1; j < core.users.length; j++) {
            services.user.collide(core.users[i], core.users[j]);
        }
        for (const item of core.items) {
            services.item.eat(core.users[i], item);
        }
    }
    // user更新
    for (const user of core.users) {
        services.user.update(user);
    }
    // 分发状态
    sendTick();
    // 清理死亡的人物/物品
    clean();
}
export function clean() {
    for (let i = core.items.length - 1; i >= 0; i--) {
        const item = core.items[i];
        if (item.dead) {
            core.items.splice(i, 1);
        }
    }
    for (let i = core.mines.length - 1; i >= 0; i--) {
        const mine = core.mines[i];
        if (mine.dead) {
            core.mines.splice(i, 1);
        }
    }
    for (let i = core.grenades.length - 1; i >= 0; i--) {
        const grenade = core.grenades[i];
        if (grenade.dead) {
            core.grenades.splice(i, 1);
        }
    }
    for (let i = core.users.length - 1; i >= 0; i--) {
        const user = core.users[i];
        if (user.dead) {
            core.users.splice(i, 1);
        }
    }
}
export function sendTick() {
    const itemdata = core.items.map(item => services.item.getData(item));
    const userdata = core.users.map(user => services.user.getData(user));
    const entitydata = core.grenades.map(e => ({
        x: e.x,
        y: e.y,
        r: e.r,
    }));
    for (const user of core.users) {
        if (user.ws) {
            const minedata: common.Mine[] = core.mines.filter(mine => mine.creater.id === user.id || mine.dead).map(mine => ({
                x: mine.x,
                y: mine.y,
                dead: mine.dead!,
            }));
            core.emit(user.ws, {
                kind: "tick",
                tick: {
                    users: userdata,
                    items: itemdata,
                    mines: minedata,
                    entitys: entitydata,
                    p1: user.id,
                },
            });
        }
    }
}
