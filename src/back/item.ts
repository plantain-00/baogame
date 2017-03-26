import * as common from "./common";
import * as services from "./services";

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

export function eat(user: services.user.User, item: services.item.Item) {
    if (user.dead || item.dead) {
        return;
    }
    if (user.itemType === common.ItemType.bomb) {
        return;
    }
    if ((user.x - item.x) * (user.x - item.x) + (user.y + common.userHeight / 2 - item.y) * (user.y + common.userHeight / 2 - item.y) >
        (common.userWidth + common.itemSize) * (common.userWidth + common.itemSize) / 4) {
        return;
    }
    item.dead = true;
    if (item.type === common.ItemType.drug) {
        services.user.killed(user, "drug");
    } else {
        user.itemType = item.type;
        user.itemCount = item.count;
    }
}
