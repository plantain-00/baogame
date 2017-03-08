import * as user from "./user";
import * as game from "./game";
import { playerAI } from "./ai";
import * as grenade from "./grenade";
import * as map from "./map";
import * as item from "./item";
import * as doorService from "./door";
import * as itemGateService from "./itemGate";
import * as common from "./common";
import * as format from "./format";

import * as libs from "./libs";

export { user, playerAI, grenade, map, item, doorService, itemGateService, format, game };

export const currentGame = game.create("大乱斗");

export interface Client {
    id: number;
    p1: user.User | null;
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
    creater: user.User;
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
    targetItem?: item.Item;
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

export type OnKilled = (game: game.Game, u: user.User) => void;
