import * as services from "./services";
import * as common from "./common";

export interface Game {
    users: services.user.User[];
    clients: services.Client[];
    items: services.item.Item[];
    bodies: services.user.User[];
    mines: services.Mine[];
    entitys: services.grenade.Grenade[];
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
    runningTimer?: NodeJS.Timer;
    name?: string;
}

export function create(name: string): Game {
    const result: Game = {
        users: [],
        clients: [],
        items: [],
        bodies: [],
        mines: [],
        entitys: [],
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
export function createNPC(data: any) {
    const u = services.user.create(data);
    u.npc = true;
    services.currentGame.users.push(u);
    return u;
}
export function createUser(client: services.Client) {
    const u = services.user.create(client);
    const place = services.map.born();
    u.x = place.x;
    u.y = place.y + common.constant.tileHeight / 2;
    services.currentGame.users.push(u);
    return u;
}
export function getUser(uid: number) {
    for (const user of services.currentGame.users) {
        if (user.id === uid) {
            return user;
        }
    }
    for (const user of services.currentGame.bodies) {
        if (user.id === uid) {
            return user;
        }
    }
    return undefined;
}
export function getClient(cid: number) {
    for (const client of services.currentGame.clients) {
        if (client.id === cid) {
            return client;
        }
    }
    return undefined;
}
export function createItem(type?: number) {
    const item = services.item.create(type!);
    services.currentGame.items.push(item);
    return item;
}
export function explode(x: number, y: number, byUser: services.user.User, power: number) {
    for (const user of services.currentGame.users) {
        const ux = user.x;
        const uy = user.y + services.currentGame.props.userHeight;
        const dist = (ux - x) * (ux - x) + (uy - y) * (uy - y);
        if (dist < power * power) {
            services.user.killed(user, "bomb", byUser);
        }
        if (dist < 2.25 * power * power) {
            const r = Math.atan2(uy - y, ux - x);
            const force = 450 * power / (dist + 2500);
            user.vx += force * Math.cos(r);
            user.vy += force * Math.sin(r);
            user.danger = true;
        }
    }
    announce({ kind: "explode", explode: { x, y, power } });
}
export function checkShot(u: services.user.User) {
    const x = u.x;
    const y = u.y + services.currentGame.props.userHeight * 2 / 3;
    const f = u.faceing;

    for (const user of services.currentGame.users) {
        let uh = services.currentGame.props.userHeight;
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
        services.currentGame.mines.push({
            x,
            y: user.y,
            creater: user,
        });
        return true;
    }
    return false;
}
export function checkMine(user: services.user.User) {
    for (let i = services.currentGame.mines.length - 1; i >= 0; i--) {
        const mine = services.currentGame.mines[i];
        if (Math.abs(user.x - mine.x) < 10 && Math.abs(user.y - mine.y) < 5) {
            services.user.killed(user, "mine", mine.creater);
            mine.dead = true;
            return true;
        }
    }
    return false;
}
export function removeClient(id: number) {
    for (let i = 0; i < services.currentGame.clients.length; i++) {
        if (services.currentGame.clients[i].id === id) {
            const client = services.currentGame.clients[i];
            client.leaveTime = new Date().getTime();
            console.log("User <" + client.name + "> "
                + " [" + client.joinTime + ":" + client.leaveTime + ":" + Math.floor((client.joinTime - client.leaveTime) / 60) + "]"
                + " [" + client.kill + "," + client.death + "," + client.highestKill + "]");
            services.currentGame.clients.splice(i, 1);
            return;
        }
    }
}
export function announce(protocol: common.Protocol) {
    for (const client of services.currentGame.clients) {
        services.emit(client.ws, protocol);
    }
}
export function update() {
    services.currentGame.tick++;
    services.map.update();
    // 物品更新
    for (const item of services.currentGame.items) {
        services.item.update(item);
    }
    // 实体更新
    for (const entity of services.currentGame.entitys) {
        services.grenade.update(entity);
    }
    // 碰撞检测
    for (let i = 0; i < services.currentGame.users.length; i++) {
        for (let j = i + 1; j < services.currentGame.users.length; j++) {
            userCollide(services.currentGame.users[i], services.currentGame.users[j]);
        }
        for (const item of services.currentGame.items) {
            eatItem(services.currentGame.users[i], item);
        }
    }
    // user更新
    for (const user of services.currentGame.users) {
        services.user.update(user);
    }
    // 分发状态
    sendTick();
    // 清理死亡的人物/物品
    clean();
}
export function clean() {
    for (let i = services.currentGame.items.length - 1; i >= 0; i--) {
        const item = services.currentGame.items[i];
        if (item.dead) {
            services.currentGame.items.splice(i, 1);
        }
    }
    for (let i = services.currentGame.mines.length - 1; i >= 0; i--) {
        const mine = services.currentGame.mines[i];
        if (mine.dead) {
            services.currentGame.mines.splice(i, 1);
        }
    }
    for (let i = services.currentGame.entitys.length - 1; i >= 0; i--) {
        const entity = services.currentGame.entitys[i];
        if (entity.dead) {
            services.currentGame.entitys.splice(i, 1);
        }
    }
    for (let i = services.currentGame.users.length - 1; i >= 0; i--) {
        const user = services.currentGame.users[i];
        if (user.dead) {
            services.currentGame.users.splice(i, 1);
            services.currentGame.bodies.push(user);
            if (services.currentGame.bodies.length > 100) {
                services.currentGame.bodies = services.currentGame.bodies.slice(0, 50);
            }
        }
    }
}
export function sendTick() {
    const itemdata = services.currentGame.items.map(item => services.item.getData(item));
    const userdata = services.currentGame.users.map(user => services.user.getData(user));
    const entitydata = services.currentGame.entitys.map(e => ({
        x: e.x,
        y: e.y,
        r: e.r,
    }));
    for (const client of services.currentGame.clients) {
        const p1 = client.p1 && client.p1.id;
        const minedata: common.Mine[] = services.currentGame.mines.filter(mine => mine.creater.id === p1 || mine.dead).map(mine => ({
            x: mine.x,
            y: mine.y,
            dead: mine.dead!,
        }));
        services.emit(client.ws, {
            kind: "tick",
            tick: {
                users: userdata,
                items: itemdata,
                mines: minedata,
                entitys: entitydata,
                p1,
            },
        });
    }
}
export function userCollide(a: services.user.User, b: services.user.User) {
    // 不碰撞情况
    if (a.dead || b.dead) {
        return;
    }
    if ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) > services.currentGame.props.userWidth * services.currentGame.props.userWidth) {
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
    if ((a.x - b.x) * (a.x - b.x) + (a.y + services.currentGame.props.userHeight / 2 - b.y) * (a.y + services.currentGame.props.userHeight / 2 - b.y) >
        (services.currentGame.props.userWidth + common.constant.itemSize) * (services.currentGame.props.userWidth + common.constant.itemSize) / 4) {
        return;
    }
    services.item.touchUser(b, a);
}
