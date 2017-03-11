import * as libs from "./libs";
import * as common from "./common";
import * as services from "./services";

export let game: services.game.Game;
export let map: services.map.Map;
export let mapData: common.MapData;
export const items: services.item.Item[] = [];
export const users: services.user.User[] = [];

export function init() {
    game = services.game.create("大乱斗");
    game.runningTimer = setInterval(() => {
        services.game.update();
    }, 17);
    map = services.map.create();
    mapData = {
        w: map.w,
        h: map.h,
        floor: map.floor.reduce((acc, f) => acc.concat(f), []),
        ladders: map.ladders,
        signs: map.signs,
        doors: map.doors,
        itemGates: map.itemGates.map(itemGate => services.itemGate.getData(itemGate)),
    };
}

export interface Client {
    id: number;
    p1: services.user.User | null;
    name: string;
    kill: number;
    highestKill: number;
    ws: libs.WebSocket;
}

export function getClientData(client: Client): common.Client {
    return {
        p1: client.p1 && client.p1.id,
        id: client.id,
        name: client.name,
        kill: client.kill,
        highestKill: client.highestKill,
    };
}

export function emit(ws: libs.WebSocket, protocol: common.Protocol) {
    try {
        // ws.send(format.encode(protocol), { binary: true });
        ws.send(JSON.stringify(protocol));
    } catch (e) {
        console.log(e);
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
    signs: common.Sign[]; // user move to here, then a message appears
    doors: common.Door[]; // show a door and create npc here
    itemGates: ItemGate[]; // show a gate and create item here
};

export type KillReason = "power" | "drug" | "gun" | "mine" | "bomb" | "fall";
