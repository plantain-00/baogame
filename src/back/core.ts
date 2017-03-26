import * as libs from "./libs";
import * as common from "./common";
import * as services from "./services";

export let map: services.map.Map;
export let mapData: common.MapData;
export const items: Item[] = [];
export const users: services.user.User[] = [];
export const grenades: services.grenade.Grenade[] = [];
export const mines: Mine[] = [];
export let debug = false;

export function init(debugMode: boolean) {
    debug = debugMode;
    setInterval(() => {
        for (const itemGate of map.itemGates) {
            if (items.length < users.length) {
                const type = Math.floor(Math.random() * common.itemCounts.length);
                const item = {
                    type,
                    count: common.itemCounts[type],
                    lifetime: 3000,
                    slowdown: 0,
                    vx: Math.random() + .5,
                    vy: Math.random() + .5,
                    dead: false,
                    x: 0,
                    y: 0,
                };
                items.push(item);
                item.x = (itemGate.x + .5) * common.tileWidth;
                item.y = (itemGate.y + .5) * common.tileHeight;
            }
        }

        for (const item of items) {
            item.slowdown++;
            if (item.x >= common.w - common.itemSize || item.x <= common.itemSize) {
                item.vx *= -1;
            }

            if (item.y >= common.h - common.itemSize || item.y <= common.itemSize) {
                item.vy *= -1;
            }
            item.lifetime--;
            if (item.lifetime < 0) {
                item.dead = true;
            }
            if (item.slowdown < 100) {
                item.x += item.vx * item.slowdown / 100;
                item.y += item.vy * item.slowdown / 100;
            } else {
                item.x += item.vx;
                item.y += item.vy;
            }
        }

        for (const grenade of grenades) {
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
                services.grenade.explode(grenade.x, grenade.y, grenade.creater, 100);
            }
        }

        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                services.user.collide(users[i], users[j]);
            }
            for (const item of items) {
                if (users[i].dead || item.dead) {
                    continue;
                }
                if (users[i].itemType === common.ItemType.bomb) {
                    continue;
                }
                if ((users[i].x - item.x) * (users[i].x - item.x) + (users[i].y + common.userHeight / 2 - item.y) * (users[i].y + common.userHeight / 2 - item.y) >
                    (common.userWidth + common.itemSize) * (common.userWidth + common.itemSize) / 4) {
                    continue;
                }
                item.dead = true;
                if (item.type === common.ItemType.drug) {
                    services.user.killed(users[i], "drug");
                } else {
                    users[i].itemType = item.type;
                    users[i].itemCount = item.count;
                }
            }
        }

        for (const user of users) {
            services.user.update(user);
        }
        const itemdata = items.map(item => ({
            x: Math.round(item.x),
            y: Math.round(item.y),
            type: item.type,
            dead: item.dead,
        }));
        const userdata = users.map(user => services.user.getData(user));
        const grenadedata = grenades.map(e => ({
            x: e.x,
            y: e.y,
            r: e.r,
        }));
        for (const user of users) {
            if (user.ws) {
                const minedata: common.Mine[] = mines.filter(mine => mine.creater.id === user.id || mine.dead).map(mine => ({
                    x: mine.x,
                    y: mine.y,
                    dead: mine.dead!,
                }));
                emit(user.ws, {
                    kind: common.ProtocolKind.tick,
                    tick: {
                        users: userdata,
                        items: itemdata,
                        mines: minedata,
                        grenades: grenadedata,
                    },
                });
            }
        }
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (item.dead) {
                items.splice(i, 1);
            }
        }
        for (let i = mines.length - 1; i >= 0; i--) {
            const mine = mines[i];
            if (mine.dead) {
                mines.splice(i, 1);
            }
        }
        for (let i = grenades.length - 1; i >= 0; i--) {
            const grenade = grenades[i];
            if (grenade.dead) {
                grenades.splice(i, 1);
            }
        }
        for (let i = users.length - 1; i >= 0; i--) {
            const user = users[i];
            if (user.dead) {
                users.splice(i, 1);
            }
        }
    }, 17);
    map = services.map.create();
    mapData = {
        w: map.w,
        h: map.h,
        floors: map.floor.reduce((acc, f) => acc.concat(f), []),
        ladders: map.ladders,
        doors: map.doors,
        itemGates: map.itemGates.map(itemGate => ({
            x: itemGate.x,
            y: itemGate.y,
        })),
    };
}

export function emit(ws: libs.WebSocket, protocol: common.Protocol) {
    try {
        ws.send(services.format.encode(protocol, debug), { binary: !debug });
    } catch (e) {
        console.log(e);
    }
}

export function announce(protocol: common.Protocol) {
    for (const user of users) {
        if (user.ws) {
            emit(user.ws, protocol);
        }
    }
}

export interface Mine {
    x: number;
    y: number;
    creater: services.user.User;
    dead?: boolean;
}

export type Position = {
    x: number;
    y: number;
};

export type ItemGate = {
    x: number;
    y: number;
    targetItem?: Item;
};

export interface Item {
    type: common.ItemType;
    count: number;
    lifetime: number;
    slowdown: number;
    vx: number;
    vy: number;
    dead: boolean;
    x: number;
    y: number;
}

export type MapData = {
    w: number; // width of floor
    h: number; // height of floor
    floor: number[][];
    ladders: common.Ladder[];
    borns: Position[]; // user is born in one of these positions
    doors: common.Door[]; // show a door and create npc here
    itemGates: ItemGate[]; // show a gate and create item here
};

export type KillReason = "power" | "drug" | "gun" | "mine" | "bomb" | "fall";
