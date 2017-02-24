import * as services from "./services";
import * as common from "./common";

let startGameId = 1;

export const games: Game[] = [];

setInterval(() => {
    for (let i = 1; i < games.length; i++) {
        if (games[i].clients.length === 0) {
            if (games[i].dead > 10) {
                games.splice(i, 1);
            } else if (games[i].dead > 0) {
                games[i].dead++;
            } else {
                games[i].dead = 1;
            }
        }
    }
}, 1000);

const maxUser = 6;

export function createGame(type: string, adminCode: string) {
    const game = new services.Game(type, adminCode, startGameId++);
    games.push(game);
    return game;
}
function removeGame(game: services.Game) {
    for (let i = 0; i < games.length; i++) {
        if (games[i] === game) {
            games.splice(i, 1);
            break;
        }
    }
}
export function getGameData() {
    return games.map(r => ({
        id: r.id,
        maxUser: r.props.maxUser,
        users: r.users.filter(u => !u.npc).length,
        name: r.name,
    }));
}

export class Game {
    dead?: number;
    users: services.User[];
    clients: services.Client[];
    items: services.Item[];
    bodies: services.User[];
    mines: services.Mine[];
    entitys: services.Entity[];
    tick: number;
    props = {
        userHeight: 40,
        userWidth: 40,
        itemSize: 15,
        tw: 28,
        th: 15,
        maxUser,
        w: 0,
        h: 0,
    };
    map: services.Map;
    runningTimer: NodeJS.Timer;
    constructor(public name: string, public adminCode: string, public id: number) {
        this.users = [];
        this.clients = [];
        this.items = [];
        this.bodies = [];
        this.mines = [];
        this.entitys = [];
        this.tick = 0;
        if (name === "lesson1") {
            this.props.th = services.map1.h;
            this.props.tw = services.map1.w;
        } else if (name === "lesson2") {
            this.props.th = services.map2.h;
            this.props.tw = services.map2.w;
        }
        this.props.w = this.props.tw * common.constant.tileWidth;
        this.props.h = this.props.th * common.constant.tileHeight;

        if (name === "lesson1") {
            this.map = new services.Map(this, services.map1);
        } else if (name === "lesson2") {
            this.map = new services.Map(this, services.map2);
        } else {
            this.map = new services.Map(this);
        }
        this.runningTimer = setInterval(() => {
            this.update();
        }, 17);
    }
    createNPC(data: any) {
        const u = new services.User(this, data);
        u.npc = true;
        this.users.push(u);
        return u;
    }
    createUser(client: services.Client) {
        const u = new services.User(this, client);
        const place = this.map.born();
        u.x = place.x;
        u.y = place.y + common.constant.tileHeight / 2;
        this.users.push(u);
        return u;
    }
    getUser(uid: number) {
        for (const user of this.users) {
            if (user.id === uid) {
                return user;
            }
        }
        for (const user of this.bodies) {
            if (user.id === uid) {
                return user;
            }
        }
        return undefined;
    }
    getClient(cid: number) {
        for (const client of this.clients) {
            if (client.id === cid) {
                return client;
            }
        }
        return undefined;
    }
    createItem(type?: number) {
        const item = new services.Item(this, type!);
        this.items.push(item);
        return item;
    }
    explode(x: number, y: number, byUser: services.User, power: number) {
        for (const user of this.users) {
            const ux = user.x;
            const uy = user.y + this.props.userHeight;
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
        this.announce({ kind: "explode", data: { x, y, power } });
    }
    checkShot(u: services.User) {
        const x = u.x;
        const y = u.y + this.props.userHeight * 2 / 3;
        const f = u.faceing;

        for (const user of this.users) {
            let uh = this.props.userHeight;
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
    addMine(user: services.User) {
        const x = user.x + user.faceing * 40;
        if (this.map.onFloor(x, user.y)) {
            this.mines.push({
                x,
                y: user.y,
                creater: user,
            });
            return true;
        }
        return false;
    }
    checkMine(user: services.User) {
        for (let i = this.mines.length - 1; i >= 0; i--) {
            const mine = this.mines[i];
            if (Math.abs(user.x - mine.x) < 10 && Math.abs(user.y - mine.y) < 5) {
                user.killed("mine", mine.creater);
                mine.dead = true;
                return true;
            }
        }
        return false;
    }
    removeClient(id: number) {
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id === id) {
                const client = this.clients[i];
                client.leaveTime = new Date().getTime();
                console.log("User <" + client.name + "> "
                    + " [" + client.joinTime + ":" + client.leaveTime + ":" + Math.floor((client.joinTime - client.leaveTime) / 60) + "]"
                    + " [" + client.kill + "," + client.death + "," + client.highestKill + "]");
                this.clients.splice(i, 1);
                return;
            }
        }
    }
    announce(protocol: common.OutProtocol) {
        for (const client of this.clients) {
            services.emit(client.ws, protocol);
        }
    }
    win(user: { id: number }) {
        this.announce({ kind: "win", data: user.id });
        setTimeout(() => {
            clearInterval(this.runningTimer);
            removeGame(this);
        }, 1000);
    }
    update() {
        this.tick++;
        this.map.update();
        // 物品更新
        for (const item of this.items) {
            item.update();
        }
        // 实体更新
        for (const entity of this.entitys) {
            entity.update();
        }
        // 碰撞检测
        for (let i = 0; i < this.users.length; i++) {
            for (let j = i + 1; j < this.users.length; j++) {
                this.userCollide(this.users[i], this.users[j]);
            }
            for (const item of this.items) {
                this.eatItem(this.users[i], item);
            }
        }
        // user更新
        for (const user of this.users) {
            user.update();
        }
        // 分发状态
        this.sendTick();
        // 清理死亡的人物/物品
        this.clean();
    }
    clean() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            if (item.dead) {
                this.items.splice(i, 1);
            }
        }
        for (let i = this.mines.length - 1; i >= 0; i--) {
            const mine = this.mines[i];
            if (mine.dead) {
                this.mines.splice(i, 1);
            }
        }
        for (let i = this.entitys.length - 1; i >= 0; i--) {
            const entity = this.entitys[i];
            if (entity.dead) {
                this.entitys.splice(i, 1);
            }
        }
        for (let i = this.users.length - 1; i >= 0; i--) {
            const user = this.users[i];
            if (user.dead) {
                this.users.splice(i, 1);
                this.bodies.push(user);
                if (this.bodies.length > 100) {
                    this.bodies = this.bodies.slice(0, 50);
                }
            }
        }
    }
    sendTick() {
        const itemdata = this.items.map(item => item.getData());
        const userdata = this.users.map(user => user.getData());
        const clientsdata = this.clients.map(client => services.getClientData(client));
        const entitydata = this.entitys.map(e => ({
            x: e.x,
            y: e.y,
            r: e.r,
        }));
        for (const client of this.clients) {
            const p1 = client.p1 && client.p1.id;
            const minedata: common.MineProtocol[] = this.mines.filter(mine => mine.creater.id === p1 || mine.dead).map(mine => ({
                x: mine.x,
                y: mine.y,
                dead: mine.dead!,
            }));
            if (client.admin) {
                if (this.tick % 60 === 0) {
                    services.emit(client.ws, {
                        kind: "adminTick",
                        data: {
                            users: userdata,
                            items: itemdata,
                            mines: minedata,
                            clients: clientsdata,
                        },
                    });
                }
            } else {
                services.emit(client.ws, {
                    kind: "tick",
                    data: {
                        users: userdata,
                        items: itemdata,
                        mines: minedata,
                        entitys: entitydata,
                        p1,
                    },
                });
            }
        }
    }
    userCollide(a: services.User, b: services.User) {
        // 不碰撞情况
        if (a.dead || b.dead) { return; }
        if ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) > this.props.userWidth * this.props.userWidth) { return; }

        // 带电情况
        if (a.carry === common.items.power.id && b.carry !== common.items.power.id) {
            b.killed("power", a);
            b.vx = (b.x - a.x) / 2;
            if (b.carry === common.items.bomb.id) {
                a.carry = b.carry;
                a.carryCount = b.carryCount;
                b.carry = "";
            }
            return;
        } else if (a.carry !== common.items.power.id && b.carry === common.items.power.id) {
            a.killed("power", b);
            a.vx = (a.x - b.x) / 2;
            if (a.carry === common.items.bomb.id) {
                b.carry = a.carry;
                b.carryCount = a.carryCount;
                a.carry = "";
            }
            return;
        } else if (a.carry === common.items.power.id && b.carry === common.items.power.id) {
            a.carry = "";
            b.carry = "";
        }
        // 排除刚刚碰撞
        if (a.ignore[b.id] > 0 || b.ignore[a.id] > 0) { return; }

        if (b.carry === common.items.bomb.id && a.carry !== common.items.bomb.id) {
            a.carry = b.carry;
            a.carryCount = b.carryCount;
            b.carry = "";
        } else if (a.carry === common.items.bomb.id && b.carry !== common.items.bomb.id) {
            b.carry = a.carry;
            b.carryCount = a.carryCount;
            a.carry = "";
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
        a.onPilla = false;
        b.onPilla = false;
        a.lastTouch = b.id;
        b.lastTouch = a.id;
    }
    eatItem(a: services.User, b: services.Item) {
        if (a.dead || b.dead) { return; }
        if (a.carry === common.items.bomb.id) { return; }
        if ((a.x - b.x) * (a.x - b.x) + (a.y + this.props.userHeight / 2 - b.y) * (a.y + this.props.userHeight / 2 - b.y) >
            (this.props.userWidth + common.constant.itemSize) * (this.props.userWidth + common.constant.itemSize) / 4) {
            return;
        }
        b.touchUser(a);
    }
}
