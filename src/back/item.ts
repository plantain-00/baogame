import * as common from "./common";
import * as services from "./services";

const Items: Item[] = [];
for (const key in common.items) {
    Items.push((common.items as any)[key]);
}

export interface Item {
    id: number;
    count: number;
    lifetime: number;
    slowdown: number;
    vx: number;
    vy: number;
    dead: boolean;
    x: number;
    y: number;
}

export function create(type?: number): Item {
    if (type === undefined) {
        type = Math.floor(Math.random() * Items.length);
    }
    return {
        id: Items[type].id,
        count: Items[type].count || 0,
        lifetime: 3000,
        slowdown: 0,
        vx: Math.random() + .5,
        vy: Math.random() + .5,
        dead: false,
        x: 0,
        y: 0,
    };
}

export function update(item: Item) {
    item.slowdown++;
    if (item.x >= common.w - common.itemSize || item.x <= common.itemSize) {
        item.vx *= -1;
    }

    if (item.y >= common.h - common.itemSize || item.y <= common.itemSize) {
        item.vy *= -1;
    }
    item.lifetime--;
    if (item.lifetime < 0) {
        item.dead = true;
    }
    if (item.slowdown < 100) {
        item.x += item.vx * item.slowdown / 100;
        item.y += item.vy * item.slowdown / 100;
    } else {
        item.x += item.vx;
        item.y += item.vy;
    }
}
export function getData(item: Item): common.Item {
    return {
        x: item.x,
        y: item.y,
        id: item.id,
        dead: item.dead,
    };
}

export function eat(user: services.user.User, item: services.item.Item) {
    if (user.dead || item.dead) {
        return;
    }
    if (user.carry === common.items.bomb.id) {
        return;
    }
    if ((user.x - item.x) * (user.x - item.x) + (user.y + common.userHeight / 2 - item.y) * (user.y + common.userHeight / 2 - item.y) >
        (common.userWidth + common.itemSize) * (common.userWidth + common.itemSize) / 4) {
        return;
    }
    item.dead = true;
    if (item.id === common.items.drug.id) {
        services.user.killed(user, "drug");
    } else {
        user.carry = item.id;
        user.carryCount = item.count;
    }
}
