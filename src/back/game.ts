import * as services from "./services";
import * as common from "./common";
import * as core from "./core";
import * as libs from "./libs";

export interface Game {
    tick: number;
    props: {
        userHeight: number;
        userWidth: number;
        itemSize: number;
        tw: number;
        th: number;
        w: number;
        h: number;
    };
    name?: string;
}

export function create(name: string): Game {
    const result: Game = {
        tick: 0,
        props: {
            userHeight: 40,
            userWidth: 40,
            itemSize: 15,
            tw: 28,
            th: 15,
            w: 0,
            h: 0,
        },
    };
    result.props.w = result.props.tw * common.constant.tileWidth;
    result.props.h = result.props.th * common.constant.tileHeight;
    return result;
}
export function createNPC(name: string) {
    const u = services.user.create(name);
    u.npc = true;
    return u;
}
export function createUser(name: string, ws?: libs.WebSocket) {
    const u = services.user.create(name, ws);
    const { x, y } = services.map.born();
    u.x = x;
    u.y = y + common.constant.tileHeight / 2;
    return u;
}
export function explode(x: number, y: number, byUser: services.user.User, power: number) {
    for (const user of core.users) {
        const ux = user.x;
        const uy = user.y + core.game.props.userHeight;
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
    const y = u.y + core.game.props.userHeight * 2 / 3;
    const f = u.faceing;

    for (const user of core.users) {
        let uh = core.game.props.userHeight;
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
    core.game.tick++;
    services.map.update();
    // 物品更新
    for (const item of core.items) {
        services.item.update(item);
    }
    // 实体更新
    for (const grenade of core.grenades) {
        services.grenade.update(grenade);
    }
    // 碰撞检测
    for (let i = 0; i < core.users.length; i++) {
        for (let j = i + 1; j < core.users.length; j++) {
            userCollide(core.users[i], core.users[j]);
        }
        for (const item of core.items) {
            eatItem(core.users[i], item);
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
export function userCollide(a: services.user.User, b: services.user.User) {
    // 不碰撞情况
    if (a.dead || b.dead) {
        return;
    }
    if ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) > core.game.props.userWidth * core.game.props.userWidth) {
        return;
    }

    // 带电情况
    if (a.carry === common.items.power.id && b.carry !== common.items.power.id) {
        services.user.killed(b, "power", a);
        b.vx = (b.x - a.x) / 2;
        if (b.carry === common.items.bomb.id) {
            a.carry = b.carry;
            a.carryCount = b.carryCount;
            b.carry = 0;
        }
        return;
    } else if (a.carry !== common.items.power.id && b.carry === common.items.power.id) {
        services.user.killed(a, "power", b);
        a.vx = (a.x - b.x) / 2;
        if (a.carry === common.items.bomb.id) {
            b.carry = a.carry;
            b.carryCount = a.carryCount;
            a.carry = 0;
        }
        return;
    } else if (a.carry === common.items.power.id && b.carry === common.items.power.id) {
        a.carry = 0;
        b.carry = 0;
    }
    // 排除刚刚碰撞
    if (a.ignore[b.id] > 0 || b.ignore[a.id] > 0) { return; }

    if (b.carry === common.items.bomb.id && a.carry !== common.items.bomb.id) {
        a.carry = b.carry;
        a.carryCount = b.carryCount;
        b.carry = 0;
    } else if (a.carry === common.items.bomb.id && b.carry !== common.items.bomb.id) {
        b.carry = a.carry;
        b.carryCount = a.carryCount;
        a.carry = 0;
    }
    // 正常情况
    if (a.onFloor && b.onFloor) {
        if (a.crawl && !b.crawl) {
            b.vy = 5;
            b.danger = true;
        } else if (!a.crawl && b.crawl) {
            a.vy = 5;
            a.danger = true;
        } else {
            if (a.crawl && b.crawl) {
                a.crawl = false;
                b.crawl = false;
            }
            const tmp = a.vx;
            a.vx = b.vx;
            b.vx = tmp;

            a.vy = 2.5;
            b.vy = 2.5;
        }
    } else if (a.onFloor && !b.onFloor) {
        if (a.crawl) {
            a.vx = b.vx / 2;
            b.vx = -b.vx / 2;
            a.vy = 2.5;
            b.vy = 2.5;
        } else {
            a.vx = b.vx;
            b.vx /= 2;
            a.vy = 2.5;
            a.danger = true;
        }
    } else if (!a.onFloor && b.onFloor) {
        if (b.crawl) {
            b.vx = a.vx / 2;
            a.vx = -a.vx / 2;
            b.vy = 2.5;
            a.vy = 2.5;
        } else {
            b.vx = a.vx;
            a.vx /= 2;
            b.vy = 2.5;
            b.danger = true;
        }
    } else {
        const tmp = a.vx;
        a.vx = b.vx;
        b.vx = tmp;
        a.danger = true;
        b.danger = true;
    }
    // 自然抗拒
    if (a.x < b.x) {
        if (!a.crawl) {
            a.vx -= 1;
        }
        if (!b.crawl) {
            b.vx += 1;
        }
    } else {
        if (!a.crawl) {
            a.vx += 1;
        }
        if (!b.crawl) {
            b.vx -= 1;
        }
    }
    // 阻止近期碰撞
    a.ignore[b.id] = 40;
    b.ignore[a.id] = 40;
    a.fireing = false;
    b.fireing = false;
    a.mining = false;
    b.mining = false;
    a.onLadder = false;
    b.onLadder = false;
    a.lastTouch = b.id;
    b.lastTouch = a.id;
}
export function eatItem(a: services.user.User, b: services.item.Item) {
    if (a.dead || b.dead) { return; }
    if (a.carry === common.items.bomb.id) { return; }
    if ((a.x - b.x) * (a.x - b.x) + (a.y + core.game.props.userHeight / 2 - b.y) * (a.y + core.game.props.userHeight / 2 - b.y) >
        (core.game.props.userWidth + common.constant.itemSize) * (core.game.props.userWidth + common.constant.itemSize) / 4) {
        return;
    }
    services.item.touchUser(b, a);
}
