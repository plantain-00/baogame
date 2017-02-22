import { User } from "./user";
import { Game, createGame, getGameData, games } from "./game";
import { playerAI } from "./ai";
import { Grenade } from "./grenade";
import { Map } from "./map";
import { Item } from "./item";
import { map as map1 } from "./maps/lesson1";
import { map as map2 } from "./maps/lesson2";
import { Door } from "./door";
import { Sign } from "./sign";
import { ItemGate } from "./itemGate";
import * as common from "./common";

import * as libs from "./libs";

export { User, Game, playerAI, Grenade, Map, Item, map1, map2, Door, Sign, ItemGate, createGame, getGameData, games };

export type Entity = Grenade;

export interface Client {
    id: number;
    p1: User | null;
    p2: User | null;
    admin: boolean;
    name: string;
    joinTime: number;
    ip: string;
    kill: number;
    death: number;
    highestKill: number;
    banned: boolean;
    leaveTime: number | undefined;
    ws: libs.WebSocket;
}

export function getClientData(client: Client): common.ClientProtocol {
    return {
        p1: client.p1 && client.p1.id,
        p2: client.p2 && client.p2.id,
        id: client.id,
        admin: client.admin,
        name: client.name,
        banned: client.banned,
        joinTime: client.joinTime,
        ip: client.ip,
        kill: client.kill,
        death: client.death,
        highestKill: client.highestKill,
    };
}

export function emit(ws: libs.WebSocket, protocol: common.OutProtocol) {
    try {
        ws.send(JSON.stringify(protocol));
    } catch (e) {
        console.log(e);
    }
}

export interface Mine {
    x: number;
    y: number;
    creater: User;
    dead?: boolean;
}

export interface Pillar {
    x: number;
    y1: number;
    y2: number;
}

export interface Born {
    x: number;
    y: number;
}

export type Pilla = {
    x: number;
    y1: number;
    y2: number;
};

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

export type MapData = {
    w: number;
    h: number;
    floor: number[][];
    pilla: Pilla[];
    borns: Position[];
    npcs: NPC[];
    signs: common.SignProtocol[];
    doors: common.DoorProtocol[];
    itemGates: common.ItemGateProtocol[];
    hooks: {
        onKilled: (game: Game, u: User) => void,
    };
};
