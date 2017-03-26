import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

export function update(itemGate: core.ItemGate) {
    if (core.items.length < core.users.length && Math.random() * 100 < core.users.length) {
        const item = services.item.create();
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
