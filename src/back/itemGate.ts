import * as services from "./services";
import * as common from "./common";

export function update(game: services.Game, data: services.ItemGate) {
    if (data.itemType !== undefined) {
        if ((game.tick + 120) % 150 === 0 && (!data.targetItem || data.targetItem.dead)) {
            const item = game.createItem(data.itemType);
            item.x = (data.x + .5) * common.constant.tileWidth;
            item.y = (data.y + .5) * common.constant.tileHeight;
            item.vx = 0;
            item.vy = 0;
            data.targetItem = item;
        }
    } else {
        // 生成物品（如果需要）
        if (game.items.length < game.users.length && Math.random() * 100 < game.users.length) {
            const item = game.createItem();
            item.x = (data.x + .5) * common.constant.tileWidth;
            item.y = (data.y + .5) * common.constant.tileHeight;
        }
    }
}

export function getData(data: services.ItemGate): common.ItemGate {
    return {
        x: data.x,
        y: data.y,
    };
}
