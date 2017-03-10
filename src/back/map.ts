import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

export interface Map {
    w: number;
    h: number;
    floor: number[][];
    ladders: common.Ladder[];
    borns: core.Position[];
    onKilled?: core.OnKilled;
    doors: common.Door[];
    itemGates: core.ItemGate[];
    signs: common.Sign[];
};

export function create(): Map {
    const w = core.game.props.tw;
    const h = core.game.props.th;
    const floor: number[][] = [];
    const ladders: common.Ladder[] = [];

    for (let i = 0; i < h; i++) {
        floor[i] = [];
        let on = Math.random() > .5 ? 1 : 0;
        if (i % 2 === 1 && i < h - 2) {
            for (let j = 0; j < w; j++) {
                if (i < 2 || i === h - 1 || j === 0 || j === w - 1) {
                    floor[i][j] = 0;
                } else {
                    floor[i][j] = on;
                    if (Math.random() > .8) {
                        on = 1 - on;
                    }
                }
            }
        }
    }

    ladders.push({
        x: 4.5,
        y1: 1,
        y2: h - 1,
    });

    ladders.push({
        x: w - 3.5,
        y1: 1,
        y2: h - 1,
    });

    for (let j = 6; j < w - 6; j++) {
        let start = 0;
        let end = 0;
        for (let i = 0; i < 4; i++) {
            if (floor[i][j]) {
                start = i;
                break;
            }
        }
        if (start) {
            for (let i = start + 1; i < h; i++) {
                if (floor[i][j]) {
                    end = i;
                }
            }
            if (end) {
                ladders.push({
                    x: j + .5,
                    y1: start,
                    y2: end + 1,
                });
            }
            j += 3;
        }
    }

    floor[1][3] = 1;
    floor[1][4] = 1;
    floor[1][5] = 1;

    floor[1][w - 3] = 1;
    floor[1][w - 4] = 1;
    floor[1][w - 5] = 1;

    floor[3][2] = 1;
    floor[3][3] = 1;
    floor[3][4] = 1;
    floor[3][5] = 1;

    floor[3][w - 2] = 1;
    floor[3][w - 3] = 1;
    floor[3][w - 4] = 1;
    floor[3][w - 5] = 1;

    floor[h - 2][3] = 1;
    floor[h - 2][4] = 1;
    floor[h - 2][5] = 1;

    floor[h - 2][w - 3] = 1;
    floor[h - 2][w - 4] = 1;
    floor[h - 2][w - 5] = 1;

    const borns: core.Position[] = [];
    for (let i = 0; i < 20; i++) {
        const x = Math.floor(Math.random() * (core.game.props.tw - 2)) + 1;
        const y = Math.floor(Math.random() * (core.game.props.th - 2)) + 1;
        if (floor[y][x]) {
            borns.push({ x, y });
        }
    }
    for (const f of floor) {
        for (let i = 0; i < core.game.props.tw; i++) {
            if (f[i] !== 0 && f[i] !== 1) {
                f[i] = 0;
            }
        }
    }

    const itemGates: core.ItemGate[] = [];
    itemGates.push({ x: 0, y: core.game.props.th / 2 });
    itemGates.push({ x: core.game.props.tw - 1, y: core.game.props.th / 2 });
    itemGates.push({ x: core.game.props.tw / 2, y: core.game.props.th - 1 });

    return {
        w: core.game.props.tw,
        h: core.game.props.th,
        floor,
        ladders,
        borns,
        doors: [],
        itemGates,
        signs: [],
    };
}
export function born() {
    const i = Math.floor(Math.random() * core.map.borns.length);
    const x = core.map.borns[i].x;
    const y = core.map.borns[i].y;
    return { x: (x + .5) * common.constant.tileWidth, y: y * common.constant.tileHeight };
}
export function onFloor(x: number, y: number) {
    x = Math.floor(x / common.constant.tileWidth);
    if (y % common.constant.tileHeight !== 0) { return false; }
    y = y / common.constant.tileHeight;
    if (x < 0 || y < 0 || x >= core.map.w || y >= core.map.h || !core.map.floor[y]) { return false; }
    return core.map.floor[y][x];
}
export function nearLadder(u: services.user.User) {
    if (onFloor(u.x, u.y) === false) { return false; }
    if (Math.abs(u.vx) > 1 || Math.abs(u.vy) > 1 || u.dieing) { return false; }
    const x = u.x;
    const y = u.y;
    for (const ladder of core.map.ladders) {
        if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
            return ladder;
        }
    }
    return false;
}
export function onLadder(x: number, y: number) {
    for (const ladder of core.map.ladders) {
        if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
            return true;
        }
    }
    return false;
}
export function update() {
    for (const door of core.map.doors) {
        services.door.update(door);
    }
    for (const itemGate of core.map.itemGates) {
        services.itemGate.update(itemGate);
    }
}
