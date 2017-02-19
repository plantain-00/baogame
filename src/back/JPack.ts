const enumCache: any = {};
const enumCacheList: any[] = [];
class JPack {
    bits: any;
    constructor(public schema: any) {
        this.bits = [];
        for (const key in schema) {
            this.bits.push({
                name: key,
                type: schema[key],
            });
        }
    }
    encode(data: any) {
        const res = [];
        for (const b of this.bits) {
            const v = data[b.name];
            if (b.type === Boolean) {
                res.push(v ? 1 : 0);
            } else if (b.type === "ENUM") {
                if (enumCache[v]) {
                    res.push(enumCache[v]);
                } else {
                    res.push(v);
                    enumCache[v] = enumCacheList.length;
                    enumCacheList.push(v);
                }
            } else if (b.type === "INT") {
                res.push(Math.floor(v));
            } else {
                res.push(v);
            }
        }
        return res;
    }
    decode(arr: any[]) {
        const data: any = {};
        for (let i = 0; i < this.bits.length; i++) {
            const n = this.bits[i].name;
            const t = this.bits[i].type;
            const v = arr[i];
            if (t === "ENUM") {
                if (typeof (v) === "string") {
                    data[n] = v;
                    enumCacheList.push(v);
                } else {
                    data[n] = enumCacheList[v];
                }
            } else {
                data[n] = v;
            }
        }
        return data;
    }
}

export const Packs = {
    items: {
        power: {
            id: 1,
            name: "无敌",
            count: 1000,
        },
        gun: {
            id: 2,
            name: "枪",
            count: 3,
        },
        mine: {
            id: 3,
            name: "地雷",
            count: 2,
        },
        drug: {
            id: 4,
            name: "毒药",
        },
        hide: {
            id: 5,
            name: "隐身",
            count: 1000,
        },
        bomb: {
            id: 6,
            name: "惊喜！",
            count: 550,
        },
        doublejump: {
            id: 7,
            name: "二段跳",
        },
        flypack: {
            id: 8,
            name: "喷气背包",
            count: 250,
        },
        grenade: {
            id: 9,
            name: "手雷",
            count: 3,
        },
    },
    userPack: new JPack({
        carry: "Str",
        carryCount: "INT",
        nearPilla: Boolean,
        faceing: "INT",
        fireing: "INT",
        grenadeing: "INT",
        danger: Boolean,
        status: "Str",
        name: "Str",
        id: "INT",
        x: "INT",
        y: "INT",
        vy: "INT",
        score: "INT",
        dead: Boolean,
        npc: Boolean,
        doubleJumping: Boolean,
        flying: "INT",
    }),
    controlPack: new JPack({
        leftDown: "INT",
        rightDown: "INT",
        upDown: "INT",
        downDown: "INT",
        itemDown: Boolean,

        leftPress: Boolean,
        rightPress: Boolean,
        upPress: Boolean,
        downPress: Boolean,
        itemPress: Boolean,
    }),
    itemPack: new JPack({
        x: "INT",
        y: "INT",
        id: "INT",
        dead: Boolean,
    }),
    minePack: new JPack({
        x: "INT",
        y: "INT",
        dead: Boolean,
    }),
    entityPack: new JPack({
        x: "INT",
        y: "INT",
        r: "INT",
    }),
};
