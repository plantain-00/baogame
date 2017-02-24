import * as services from "./services";
import * as common from "./common";

export class Map {
    w: number;
    h: number;
    floor: number[][];
    pilla: services.Pillar[];
    borns: services.Born[];
    hooks: any;
    doors: common.DoorProtocol[] = [];
    itemGates: services.ItemGate[] = [];
    signs: common.SignProtocol[] = [];
    constructor(public game: services.Game, data?: services.MapData) {
        if (data) {
            this.w = game.props.w;
            this.h = game.props.h;
            this.floor = data.floor;
            this.pilla = data.pilla;
            this.borns = data.borns;
            this.hooks = data.hooks || {};
            this.doors = data.doors;
            this.itemGates = data.itemGates;
            this.signs = data.signs;
            if (data.npcs) {
                for (const npcData of data.npcs) {
                    const npc = this.game.createNPC({ name: npcData.name || "npc" });
                    npc.x = (npcData.x + .5) * common.constant.tileWidth;
                    npc.y = (npcData.y + .5) * common.constant.tileHeight;
                    npc.carryCount = npcData.carryCount!;
                    npc.carry = npcData.carry;
                    npc.AI = npcData.AI;
                }
            }
        } else {
            // random map
            this.w = game.props.tw;
            this.h = game.props.th;
            const w = this.w;
            const h = this.h;
            this.floor = [];
            this.pilla = [];
            this.hooks = {};

            for (let i = 0; i < h; i++) {
                this.floor[i] = [];
                let on = Math.random() > .5 ? 1 : 0;
                if (i % 2 === 1 && i < h - 2) {
                    for (let j = 0; j < w; j++) {
                        if (i < 2 || i === h - 1 || j === 0 || j === w - 1) {
                            this.floor[i][j] = 0;
                        } else {
                            this.floor[i][j] = on;
                            if (Math.random() > .8) { on = 1 - on; }
                        }
                    }
                }
            }

            this.pilla.push({
                x: 4.5,
                y1: 1,
                y2: h - 1,
            });

            this.pilla.push({
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
                        this.pilla.push({
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

            this.itemGates.push({ x: 0, y: this.h / 2 });
            this.itemGates.push({ x: this.w - 1, y: this.h / 2 });
            this.itemGates.push({ x: this.w / 2, y: this.h - 1 });
        }
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
    nearPilla(u: services.User) {
        if (this.onFloor(u.x, u.y) === false) { return false; }
        if (Math.abs(u.vx) > 1 || Math.abs(u.vy) > 1 || u.dieing) { return false; }
        const x = u.x;
        const y = u.y;
        for (const pilla of this.pilla) {
            if (Math.abs(x - pilla.x * common.constant.tileWidth) < 8 && y >= pilla.y1 * common.constant.tileHeight && y <= pilla.y2 * common.constant.tileHeight) {
                return pilla;
            }
        }
        return false;
    }
    onPilla(x: number, y: number) {
        for (const pilla of this.pilla) {
            if (Math.abs(x - pilla.x * common.constant.tileWidth) < 8 && y >= pilla.y1 * common.constant.tileHeight && y <= pilla.y2 * common.constant.tileHeight) {
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
    getData() {
        const itemGates = this.itemGates.map(itemGate => services.itemGateService.getData(itemGate));
        return {
            floor: this.floor,
            pilla: this.pilla,
            signs: this.signs,
            doors: this.doors,
            itemGates,
        };
    }
};
