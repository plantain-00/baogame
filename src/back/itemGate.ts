import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

export function update(data: core.ItemGate) {
    if (data.itemType !== undefined) {
        if ((core.game.tick + 120) % 150 === 0 && (!data.targetItem || data.targetItem.dead)) {
            const item = services.game.createItem(data.itemType);
            item.x = (data.x + .5) * common.constant.tileWidth;
            item.y = (data.y + .5) * common.constant.tileHeight;
            item.vx = 0;
            item.vy = 0;
            data.targetItem = item;
        }
    } else {
        // 生成物品（如果需要）
        if (core.game.items.length < core.game.users.length && Math.random() * 100 < core.game.users.length) {
            const item = services.game.createItem();
            item.x = (data.x + .5) * common.constant.tileWidth;
            item.y = (data.y + .5) * common.constant.tileHeight;
        }
    }
}

export function getData(data: core.ItemGate): common.ItemGate {
    return {
        x: data.x,
        y: data.y,
    };
}
