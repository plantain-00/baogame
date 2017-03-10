import * as libs from "./libs";
import * as common from "./common";
import * as services from "./services";

export const currentGame = services.game.create("大乱斗");
currentGame.runningTimer = setInterval(() => {
    services.game.update();
}, 17);
export const currentMap = services.map.create();
export const currentMapData: common.MapData = {
    w: currentMap.w,
    h: currentMap.h,
    floor: currentMap.floor.reduce((acc, f) => acc.concat(f), []),
    ladders: currentMap.ladders,
    signs: currentMap.signs,
    doors: currentMap.doors,
    itemGates: currentMap.itemGates.map(itemGate => services.itemGate.getData(itemGate)),
};

export interface Client {
    id: number;
    p1: services.user.User | null;
    name: string;
    joinTime: number;
    ip: string;
    kill: number;
    death: number;
    highestKill: number;
    leaveTime: number | undefined;
    ws: libs.WebSocket;
}

export function getClientData(client: Client): common.Client {
    return {
        p1: client.p1 && client.p1.id,
        id: client.id,
        name: client.name,
        joinTime: client.joinTime,
        ip: client.ip,
        kill: client.kill,
        death: client.death,
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
    onKilled: OnKilled; // callback
};

export type KillReason = "power" | "drug" | "gun" | "mine" | "bomb" | "fall";

export type OnKilled = (u: services.user.User) => void;
