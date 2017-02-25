export const constant = {
    tileWidth: 40,
    tileHeight: 40,
    itemSize: 15,
};

export const items = {
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
};

export type ControlProtocol = {
    leftDown: number;
    rightDown: number;
    upDown: number;
    downDown: number;
    itemDown: number;
    leftPress: boolean;
    rightPress: boolean;
    upPress: boolean;
    downPress: boolean;
    itemPress: boolean;
};

export type ItemProtocol = {
    x: number;
    y: number;
    id: number;
    dead: boolean;
};

export type MineProtocol = {
    x: number;
    y: number;
    dead: boolean;
};

export type EntityProtocol = {
    x: number;
    y: number;
    r: number;
};

export type UserProtocol = {
    carry: string;
    carryCount: number;
    nearPilla: boolean;
    faceing: number;
    fireing: number;
    grenadeing: number;
    danger: boolean,
    status: string;
    name: string;
    id: number;
    x: number;
    y: number;
    vy: number;
    score: number;
    dead: boolean,
    npc: boolean,
    doubleJumping: boolean,
    flying: number;
};

export type ClientProtocol = {
    p1: number | null;
    id: number;
    admin: boolean;
    name: string;
    banned: boolean;
    joinTime: number;
    ip: string;
    kill: number;
    death: number;
    highestKill: number;
};

export type SignProtocol = {
    x: number;
    y: number;
    message: string;
};

export type DoorProtocol = {
    x: number;
    y: number;
};

export type ItemGateProtocol = {
    x: number;
    y: number;
};

export type TickProtocol = {
    users: UserProtocol[];
    items: ItemProtocol[];
    mines: MineProtocol[];
    entitys: EntityProtocol[];
    p1: number | null | undefined;
};

export type InProtocol =
    {
        kind: "init";
        userName: string;
    }
    |
    {
        kind: "adminInit";
        code: string;
    }
    |
    {
        kind: "join";
        p1: boolean;
        userName: string;
    }
    |
    {
        kind: "control";
        data: ControlProtocol;
    }
    |
    {
        kind: "createItem";
        data: number;
    }
    |
    {
        kind: "ban";
        data: number;
    }
    |
    {
        kind: "unban";
        data: number;
    };

export type OutProtocol =
    {
        kind: "init";
        data: {
            props: {
                userHeight: number;
                userWidth: number;
                itemSize: number;
                tw: number;
                th: number;
                maxUser: number;
                w: number;
                h: number;
            };
            map: {
                floor: number[][];
                pilla: Pilla[];
                signs: SignProtocol[],
                doors: DoorProtocol[],
                itemGates: ItemGateProtocol[],
            }
            bodies: UserProtocol[];
        }
    }
    |
    {
        kind: "adminInitFail";
    }
    |
    {
        kind: "joinFail";
        data: string;
    }
    |
    {
        kind: "joinSuccess";
    }
    |
    {
        kind: "tick";
        data: TickProtocol;
    }
    |
    {
        kind: "adminTick";
        data: {
            users: UserProtocol[];
            items: ItemProtocol[];
            mines: MineProtocol[];
            clients: ClientProtocol[];
        };
    }
    |
    {
        kind: "explode";
        data: {
            x: number;
            y: number;
            power: number;
        };
    }
    |
    {
        kind: "win";
        data: number;
    }
    |
    {
        kind: "userDead";
        data: {
            user: UserProtocol;
            killer: UserProtocol | undefined;
            message: string;
        };
    };

export type userStatus = "dieing" | "climbing" | "rolling2" | "standing" | "rolling" | "mining" | "crawling" | "falling";

export type Pilla = {
    x: number;
    y1: number;
    y2: number;
};
