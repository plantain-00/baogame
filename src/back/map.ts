import * as services from "./services";
import * as common from "./common";

export interface Map {
    w: number;
    h: number;
    floor: number[][];
    ladders: common.Ladder[];
    borns: services.Position[];
    onKilled?: services.OnKilled;
    doors: common.Door[];
    itemGates: services.ItemGate[];
    signs: common.Sign[];
};

export function create(): Map {
    const w = services.currentGame.props.tw;
    const h = services.currentGame.props.th;
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

    const borns: services.Position[] = [];
    for (let i = 0; i < 20; i++) {
        const x = Math.floor(Math.random() * (services.currentGame.props.tw - 2)) + 1;
        const y = Math.floor(Math.random() * (services.currentGame.props.th - 2)) + 1;
        if (floor[y][x]) {
            borns.push({ x, y });
        }
    }
    for (const f of floor) {
        for (let i = 0; i < services.currentGame.props.tw; i++) {
            if (f[i] !== 0 && f[i] !== 1) {
                f[i] = 0;
            }
        }
    }

    const itemGates: services.ItemGate[] = [];
    itemGates.push({ x: 0, y: services.currentGame.props.th / 2 });
    itemGates.push({ x: services.currentGame.props.tw - 1, y: services.currentGame.props.th / 2 });
    itemGates.push({ x: services.currentGame.props.tw / 2, y: services.currentGame.props.th - 1 });

    return {
        w: services.currentGame.props.tw,
        h: services.currentGame.props.th,
        floor,
        ladders,
        borns,
        doors: [],
        itemGates,
        signs: [],
    };
}
export function born() {
    const i = Math.floor(Math.random() * services.currentMap.borns.length);
    const x = services.currentMap.borns[i].x;
    const y = services.currentMap.borns[i].y;
    return { x: (x + .5) * common.constant.tileWidth, y: y * common.constant.tileHeight };
}
export function onFloor(x: number, y: number) {
    x = Math.floor(x / common.constant.tileWidth);
    if (y % common.constant.tileHeight !== 0) { return false; }
    y = y / common.constant.tileHeight;
    if (x < 0 || y < 0 || x >= services.currentMap.w || y >= services.currentMap.h || !services.currentMap.floor[y]) { return false; }
    return services.currentMap.floor[y][x];
}
export function nearLadder(u: services.user.User) {
    if (onFloor(u.x, u.y) === false) { return false; }
    if (Math.abs(u.vx) > 1 || Math.abs(u.vy) > 1 || u.dieing) { return false; }
    const x = u.x;
    const y = u.y;
    for (const ladder of services.currentMap.ladders) {
        if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
            return ladder;
        }
    }
    return false;
}
export function onLadder(x: number, y: number) {
    for (const ladder of services.currentMap.ladders) {
        if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
            return true;
        }
    }
    return false;
}
export function update() {
    for (const door of services.currentMap.doors) {
        services.doorService.update(door);
    }
    for (const itemGate of services.currentMap.itemGates) {
        services.itemGateService.update(itemGate);
    }
}
