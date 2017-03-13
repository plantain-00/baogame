import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

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
