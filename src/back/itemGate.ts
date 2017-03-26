import * as common from "./common";
import * as core from "./core";

export function update(itemGate: core.ItemGate) {
    if (core.items.length < core.users.length) {
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
        core.items.push(item);
        item.x = (itemGate.x + .5) * common.tileWidth;
        item.y = (itemGate.y + .5) * common.tileHeight;
    }
}

export function getData(data: core.ItemGate): common.ItemGate {
    return {
        x: data.x,
        y: data.y,
    };
}
