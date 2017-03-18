import * as libs from "./libs";
import * as common from "./common";
import * as services from "./services";

export let map: services.map.Map;
export let mapData: common.MapData;
export const items: services.item.Item[] = [];
export const users: services.user.User[] = [];
export const grenades: services.grenade.Grenade[] = [];
export const mines: Mine[] = [];
export let tick = 0;
export let debug = false;

export function init(debugMode: boolean) {
    debug = debugMode;
    setInterval(() => {
        tick++;
        services.map.update();
        for (const item of items) {
            services.item.update(item);
        }
        for (const grenade of grenades) {
            services.grenade.update(grenade);
        }
        // 碰撞检测
        for (let i = 0; i < users.length; i++) {
            for (let j = i + 1; j < users.length; j++) {
                services.user.collide(users[i], users[j]);
            }
            for (const item of items) {
                services.item.eat(users[i], item);
            }
        }
        // user更新
        for (const user of users) {
            services.user.update(user);
        }
        const itemdata = items.map(item => services.item.getData(item));
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
                    kind: "tick",
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
        itemGates: map.itemGates.map(itemGate => services.itemGate.getData(itemGate)),
    };
}

export function emit(ws: libs.WebSocket, protocol: common.Protocol) {
    try {
        ws.send(services.format.encode(protocol, debug), { binary: !debug });
        ws.send(JSON.stringify(protocol));
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

export type NPC = {
    x: number;
    y: number;
    name: string;
    carry?: number;
    carryCount?: number;
    AI?: "walking";
};

export type ItemGate = {
    x: number;
    y: number;
    itemType?: number;
    targetItem?: services.item.Item;
};

export type MapData = {
    w: number; // width of floor
    h: number; // height of floor
    floor: number[][];
    ladders: common.Ladder[];
    borns: Position[]; // user is born in one of these positions
    npcs: NPC[]; // position, name, status of npcs
    doors: common.Door[]; // show a door and create npc here
    itemGates: ItemGate[]; // show a gate and create item here
};

export type KillReason = "power" | "drug" | "gun" | "mine" | "bomb" | "fall";
