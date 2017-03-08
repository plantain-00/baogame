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
    game: services.game.Game;
};

export function create(game: services.game.Game): Map {
    const w = game.props.tw;
    const h = game.props.th;
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
        const x = Math.floor(Math.random() * (game.props.tw - 2)) + 1;
        const y = Math.floor(Math.random() * (game.props.th - 2)) + 1;
        if (floor[y][x]) {
            borns.push({ x, y });
        }
    }
    for (const f of floor) {
        for (let i = 0; i < game.props.tw; i++) {
            if (f[i] !== 0 && f[i] !== 1) {
                f[i] = 0;
            }
        }
    }

    const itemGates: services.ItemGate[] = [];
    itemGates.push({ x: 0, y: game.props.th / 2 });
    itemGates.push({ x: game.props.tw - 1, y: game.props.th / 2 });
    itemGates.push({ x: game.props.tw / 2, y: game.props.th - 1 });

    return {
        w: game.props.tw,
        h: game.props.th,
        floor,
        ladders,
        borns,
        doors: [],
        itemGates,
        signs: [],
        game,
    };
}
export function born(map: Map) {
    const i = Math.floor(Math.random() * map.borns.length);
    const x = map.borns[i].x;
    const y = map.borns[i].y;
    return { x: (x + .5) * common.constant.tileWidth, y: y * common.constant.tileHeight };
}
export function onFloor(map: Map, x: number, y: number) {
    x = Math.floor(x / common.constant.tileWidth);
    if (y % common.constant.tileHeight !== 0) { return false; }
    y = y / common.constant.tileHeight;
    if (x < 0 || y < 0 || x >= map.w || y >= map.h || !map.floor[y]) { return false; }
    return map.floor[y][x];
}
export function nearLadder(map: Map, u: services.user.User) {
    if (onFloor(map, u.x, u.y) === false) { return false; }
    if (Math.abs(u.vx) > 1 || Math.abs(u.vy) > 1 || u.dieing) { return false; }
    const x = u.x;
    const y = u.y;
    for (const ladder of map.ladders) {
        if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
            return ladder;
        }
    }
    return false;
}
export function onLadder(map: Map, x: number, y: number) {
    for (const ladder of map.ladders) {
        if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
            return true;
        }
    }
    return false;
}
export function update(map: Map) {
    for (const door of map.doors) {
        services.doorService.update(map.game, door);
    }
    for (const itemGate of map.itemGates) {
        services.itemGateService.update(map.game, itemGate);
    }
}
export function getData(map: Map): common.MapData {
    const itemGates = map.itemGates.map(itemGate => services.itemGateService.getData(itemGate));
    return {
        w: map.w,
        h: map.h,
        floor: map.floor.reduce((acc, f) => acc.concat(f), []),
        ladders: map.ladders,
        signs: map.signs,
        doors: map.doors,
        itemGates,
    };
}
