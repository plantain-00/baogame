import * as services from "./services";
import * as common from "./common";

export function update(data: services.ItemGate) {
    if (data.itemType !== undefined) {
        if ((services.currentGame.tick + 120) % 150 === 0 && (!data.targetItem || data.targetItem.dead)) {
            const item = services.game.createItem(data.itemType);
            item.x = (data.x + .5) * common.constant.tileWidth;
            item.y = (data.y + .5) * common.constant.tileHeight;
            item.vx = 0;
            item.vy = 0;
            data.targetItem = item;
        }
    } else {
        // 生成物品（如果需要）
        if (services.currentGame.items.length < services.currentGame.users.length && Math.random() * 100 < services.currentGame.users.length) {
            const item = services.game.createItem();
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
