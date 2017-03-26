import * as common from "./common";

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

export function getData(item: Item): common.Item {
    return {
        x: Math.round(item.x),
        y: Math.round(item.y),
        type: item.type,
        dead: item.dead,
    };
}
