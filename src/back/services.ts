import { User } from "./user";
import { Game, createGame, getGameData, games } from "./game";
import { Packs } from "./JPack";
import { playerAI } from "./ai";
import { Grenade } from "./entity/grenade";
import { Map } from "./map";
import { Item } from "./item";
import { map as map1 } from "./maps/lesson1";
import { map as map2 } from "./maps/lesson2";
import { Door } from "./struct/door";
import { Sign } from "./struct/sign";
import { ItemGate } from "./struct/itemGate";
import * as common from "./common";

import * as libs from "./libs";

export { User, Game, Packs, playerAI, Grenade, Map, Item, map1, map2, Door, Sign, ItemGate, createGame, getGameData, games };

export type Struct = Door | Sign | ItemGate;

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

export function getClientData(client: Client) {
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
        const c = protocol.name + "$" + JSON.stringify(protocol.data);
        ws.send(c);
    } catch (e) {
        console.log(e);
    }
}
