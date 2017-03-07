import * as services from "./services";
import * as common from "./common";

export class Map {
    w: number;
    h: number;
    floor: number[][];
    ladders: common.Ladder[];
    borns: services.Position[];
    onKilled: services.OnKilled;
    doors: common.Door[] = [];
    itemGates: services.ItemGate[] = [];
    signs: common.Sign[] = [];
    constructor(public game: services.Game) {
        this.w = game.props.tw;
        this.h = game.props.th;
        const w = this.w;
        const h = this.h;
        this.floor = [];
        this.ladders = [];

        for (let i = 0; i < h; i++) {
            this.floor[i] = [];
            let on = Math.random() > .5 ? 1 : 0;
            if (i % 2 === 1 && i < h - 2) {
                for (let j = 0; j < w; j++) {
                    if (i < 2 || i === h - 1 || j === 0 || j === w - 1) {
                        this.floor[i][j] = 0;
                    } else {
                        this.floor[i][j] = on;
                        if (Math.random() > .8) {
                            on = 1 - on;
                        }
                    }
                }
            }
        }

        this.ladders.push({
            x: 4.5,
            y1: 1,
            y2: h - 1,
        });

        this.ladders.push({
            x: w - 3.5,
            y1: 1,
            y2: h - 1,
        });

        for (let j = 6; j < w - 6; j++) {
            let start = 0;
            let end = 0;
            for (let i = 0; i < 4; i++) {
                if (this.floor[i][j]) {
                    start = i;
                    break;
                }
            }
            if (start) {
                for (let i = start + 1; i < h; i++) {
                    if (this.floor[i][j]) {
                        end = i;
                    }
                }
                if (end) {
                    this.ladders.push({
                        x: j + .5,
                        y1: start,
                        y2: end + 1,
                    });
                }
                j += 3;
            }
        }

        this.floor[1][3] = 1;
        this.floor[1][4] = 1;
        this.floor[1][5] = 1;

        this.floor[1][w - 3] = 1;
        this.floor[1][w - 4] = 1;
        this.floor[1][w - 5] = 1;

        this.floor[3][2] = 1;
        this.floor[3][3] = 1;
        this.floor[3][4] = 1;
        this.floor[3][5] = 1;

        this.floor[3][w - 2] = 1;
        this.floor[3][w - 3] = 1;
        this.floor[3][w - 4] = 1;
        this.floor[3][w - 5] = 1;

        this.floor[h - 2][3] = 1;
        this.floor[h - 2][4] = 1;
        this.floor[h - 2][5] = 1;

        this.floor[h - 2][w - 3] = 1;
        this.floor[h - 2][w - 4] = 1;
        this.floor[h - 2][w - 5] = 1;

        this.borns = [];
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * (this.w - 2)) + 1;
            const y = Math.floor(Math.random() * (this.h - 2)) + 1;
            if (this.floor[y][x]) {
                this.borns.push({ x, y });
            }
        }
        for (const f of this.floor) {
            for (let i = 0; i < this.w; i++) {
                if (f[i] !== 0 && f[i] !== 1) {
                    f[i] = 0;
                }
            }
        }

        this.itemGates.push({ x: 0, y: this.h / 2 });
        this.itemGates.push({ x: this.w - 1, y: this.h / 2 });
        this.itemGates.push({ x: this.w / 2, y: this.h - 1 });
    }
    born() {
        const i = Math.floor(Math.random() * this.borns.length);
        const x = this.borns[i].x;
        const y = this.borns[i].y;
        return { x: (x + .5) * common.constant.tileWidth, y: y * common.constant.tileHeight };
    }
    onFloor(x: number, y: number) {
        x = Math.floor(x / common.constant.tileWidth);
        if (y % common.constant.tileHeight !== 0) { return false; }
        y = y / common.constant.tileHeight;
        if (x < 0 || y < 0 || x >= this.w || y >= this.h || !this.floor[y]) { return false; }
        return this.floor[y][x];
    }
    nearLadder(u: services.User) {
        if (this.onFloor(u.x, u.y) === false) { return false; }
        if (Math.abs(u.vx) > 1 || Math.abs(u.vy) > 1 || u.dieing) { return false; }
        const x = u.x;
        const y = u.y;
        for (const ladder of this.ladders) {
            if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
                return ladder;
            }
        }
        return false;
    }
    onLadder(x: number, y: number) {
        for (const ladder of this.ladders) {
            if (Math.abs(x - ladder.x * common.constant.tileWidth) < 8 && y >= ladder.y1 * common.constant.tileHeight && y <= ladder.y2 * common.constant.tileHeight) {
                return true;
            }
        }
        return false;
    }
    update() {
        for (const door of this.doors) {
            services.doorService.update(this.game, door);
        }
        for (const itemGate of this.itemGates) {
            services.itemGateService.update(this.game, itemGate);
        }
    }
    getData(): common.MapData {
        const itemGates = this.itemGates.map(itemGate => services.itemGateService.getData(itemGate));
        return {
            w: this.w,
            h: this.h,
            floor: this.floor.reduce((acc, f) => acc.concat(f), []),
            ladders: this.ladders,
            signs: this.signs,
            doors: this.doors,
            itemGates,
        };
    }
};
