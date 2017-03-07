import * as services from "./services";
import * as common from "./common";

export interface Game {
    users: services.User[];
    clients: services.Client[];
    items: services.item.Item[];
    bodies: services.User[];
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
    map?: services.map.Map;
    runningTimer?: NodeJS.Timer;
    name?: string;
}

export function create(name: string) {
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

    result.map = services.map.create(result);
    result.runningTimer = setInterval(() => {
        update(result);
    }, 17);
    return result;
}
export function createNPC(game: Game, data: any) {
    const u = new services.User(game, data);
    u.npc = true;
    game.users.push(u);
    return u;
}
export function createUser(game: Game, client: services.Client) {
    const u = new services.User(game, client);
    const place = services.map.born(game.map!);
    u.x = place.x;
    u.y = place.y + common.constant.tileHeight / 2;
    game.users.push(u);
    return u;
}
export function getUser(game: Game, uid: number) {
    for (const user of game.users) {
        if (user.id === uid) {
            return user;
        }
    }
    for (const user of game.bodies) {
        if (user.id === uid) {
            return user;
        }
    }
    return undefined;
}
export function getClient(game: Game, cid: number) {
    for (const client of game.clients) {
        if (client.id === cid) {
            return client;
        }
    }
    return undefined;
}
export function createItem(game: Game, type?: number) {
    const item = services.item.create(type!, game);
    game.items.push(item);
    return item;
}
export function explode(game: Game, x: number, y: number, byUser: services.User, power: number) {
    for (const user of game.users) {
        const ux = user.x;
        const uy = user.y + game.props.userHeight;
        const dist = (ux - x) * (ux - x) + (uy - y) * (uy - y);
        if (dist < power * power) {
            user.killed("bomb", byUser);
        }
        if (dist < 2.25 * power * power) {
            const r = Math.atan2(uy - y, ux - x);
            const force = 450 * power / (dist + 2500);
            user.vx += force * Math.cos(r);
            user.vy += force * Math.sin(r);
            user.danger = true;
        }
    }
    announce(game, { kind: "explode", explode: { x, y, power } });
}
export function checkShot(game: Game, u: services.User) {
    const x = u.x;
    const y = u.y + game.props.userHeight * 2 / 3;
    const f = u.faceing;

    for (const user of game.users) {
        let uh = game.props.userHeight;
        if (user.crawl) {
            uh /= 2;
        }
        if (f < 0 && x > user.x && user.y <= y && user.y + uh >= y) {
            user.killed("gun", u);
            user.vx = 6 * f;
        }

        if (f > 0 && x < user.x && user.y <= y && user.y + uh >= y) {
            user.killed("gun", u);
            user.vx = 6 * f;
        }
    }
}
export function addMine(game: Game, user: services.User) {
    const x = user.x + user.faceing * 40;
    if (services.map.onFloor(game.map!, x, user.y)) {
        game.mines.push({
            x,
            y: user.y,
            creater: user,
        });
        return true;
    }
    return false;
}
export function checkMine(game: Game, user: services.User) {
    for (let i = game.mines.length - 1; i >= 0; i--) {
        const mine = game.mines[i];
        if (Math.abs(user.x - mine.x) < 10 && Math.abs(user.y - mine.y) < 5) {
            user.killed("mine", mine.creater);
            mine.dead = true;
            return true;
        }
    }
    return false;
}
export function removeClient(game: Game, id: number) {
    for (let i = 0; i < game.clients.length; i++) {
        if (game.clients[i].id === id) {
            const client = game.clients[i];
            client.leaveTime = new Date().getTime();
            console.log("User <" + client.name + "> "
                + " [" + client.joinTime + ":" + client.leaveTime + ":" + Math.floor((client.joinTime - client.leaveTime) / 60) + "]"
                + " [" + client.kill + "," + client.death + "," + client.highestKill + "]");
            game.clients.splice(i, 1);
            return;
        }
    }
}
export function announce(game: Game, protocol: common.Protocol) {
    for (const client of game.clients) {
        services.emit(client.ws, protocol);
    }
}
export function update(game: Game) {
    game.tick++;
    services.map.update(game.map!);
    // 物品更新
    for (const item of game.items) {
        services.item.update(item);
    }
    // 实体更新
    for (const entity of game.entitys) {
        services.grenade.update(entity);
    }
    // 碰撞检测
    for (let i = 0; i < game.users.length; i++) {
        for (let j = i + 1; j < game.users.length; j++) {
            userCollide(game, game.users[i], game.users[j]);
        }
        for (const item of game.items) {
            eatItem(game, game.users[i], item);
        }
    }
    // user更新
    for (const user of game.users) {
        user.update();
    }
    // 分发状态
    sendTick(game);
    // 清理死亡的人物/物品
    clean(game);
}
export function clean(game: Game) {
    for (let i = game.items.length - 1; i >= 0; i--) {
        const item = game.items[i];
        if (item.dead) {
            game.items.splice(i, 1);
        }
    }
    for (let i = game.mines.length - 1; i >= 0; i--) {
        const mine = game.mines[i];
        if (mine.dead) {
            game.mines.splice(i, 1);
        }
    }
    for (let i = game.entitys.length - 1; i >= 0; i--) {
        const entity = game.entitys[i];
        if (entity.dead) {
            game.entitys.splice(i, 1);
        }
    }
    for (let i = game.users.length - 1; i >= 0; i--) {
        const user = game.users[i];
        if (user.dead) {
            game.users.splice(i, 1);
            game.bodies.push(user);
            if (game.bodies.length > 100) {
                game.bodies = game.bodies.slice(0, 50);
            }
        }
    }
}
export function sendTick(game: Game) {
    const itemdata = game.items.map(item => services.item.getData(item));
    const userdata = game.users.map(user => user.getData());
    const entitydata = game.entitys.map(e => ({
        x: e.x,
        y: e.y,
        r: e.r,
    }));
    for (const client of game.clients) {
        const p1 = client.p1 && client.p1.id;
        const minedata: common.Mine[] = game.mines.filter(mine => mine.creater.id === p1 || mine.dead).map(mine => ({
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
export function userCollide(game: Game, a: services.User, b: services.User) {
    // 不碰撞情况
    if (a.dead || b.dead) {
        return;
    }
    if ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) > game.props.userWidth * game.props.userWidth) {
        return;
    }

    // 带电情况
    if (a.carry === common.items.power.id && b.carry !== common.items.power.id) {
        b.killed("power", a);
        b.vx = (b.x - a.x) / 2;
        if (b.carry === common.items.bomb.id) {
            a.carry = b.carry;
            a.carryCount = b.carryCount;
            b.carry = 0;
        }
        return;
    } else if (a.carry !== common.items.power.id && b.carry === common.items.power.id) {
        a.killed("power", b);
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
export function eatItem(game: Game, a: services.User, b: services.item.Item) {
    if (a.dead || b.dead) { return; }
    if (a.carry === common.items.bomb.id) { return; }
    if ((a.x - b.x) * (a.x - b.x) + (a.y + game.props.userHeight / 2 - b.y) * (a.y + game.props.userHeight / 2 - b.y) >
        (game.props.userWidth + common.constant.itemSize) * (game.props.userWidth + common.constant.itemSize) / 4) {
        return;
    }
    services.item.touchUser(b, a);
}
