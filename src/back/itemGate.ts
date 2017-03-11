import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

export function update(data: core.ItemGate) {
    if (data.itemType !== undefined) {
        if ((core.tick + 120) % 150 === 0 && (!data.targetItem || data.targetItem.dead)) {
            const item = services.item.create(data.itemType);
            core.items.push(item);
            item.x = (data.x + .5) * common.tileWidth;
            item.y = (data.y + .5) * common.tileHeight;
            item.vx = 0;
            item.vy = 0;
            data.targetItem = item;
        }
    } else {
        // 生成物品（如果需要）
        if (core.items.length < core.users.length && Math.random() * 100 < core.users.length) {
            const item = services.item.create();
            core.items.push(item);
            item.x = (data.x + .5) * common.tileWidth;
            item.y = (data.y + .5) * common.tileHeight;
        }
    }
}

export function getData(data: core.ItemGate): common.ItemGate {
    return {
        x: data.x,
        y: data.y,
    };
}
