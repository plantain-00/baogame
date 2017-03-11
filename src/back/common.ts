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

export type Item = {
    x: number;
    y: number;
    id: number;
    dead: boolean;
};

export type Mine = {
    x: number;
    y: number;
    dead: boolean;
};

export type Entity = {
    x: number;
    y: number;
    r: number;
};

export type User = {
    carry: number;
    carryCount: number;
    nearLadder: boolean;
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

export type Client = {
    p1: number | null;
    kill: number;
    highestKill: number;
};

export type Sign = {
    x: number;
    y: number;
    message: string;
};

export type Door = {
    x: number;
    y: number;
};

export type ItemGate = {
    x: number;
    y: number;
};

export type TickProtocol = {
    kind: "tick";
    tick: {
        users: User[];
        items: Item[];
        mines: Mine[];
        entitys: Entity[];
        p1: number | null | undefined;
    };
};

export type Props = {
    userHeight: number;
    userWidth: number;
    itemSize: number;
    tw: number;
    th: number;
    w: number;
    h: number;
};

export type MapData = {
    w: number;
    h: number;
    floor: number[];
    ladders: Ladder[];
    signs: Sign[],
    doors: Door[],
    itemGates: ItemGate[],
};

export type InitSuccessProtocol = {
    kind: "initSuccess";
    initSuccess: {
        props: Props;
        map: MapData;
    }
};

export type JoinProtocol = {
    kind: "join";
    join: {
        p1: boolean;
        userName: string;
    };
};

export type JoinSuccessProtocol = {
    kind: "joinSuccess";
};

export type ControlProtocol = {
    kind: "control";
    control: {
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
};

export type ExplodeProtocol = {
    kind: "explode";
    explode: {
        x: number;
        y: number;
        power: number;
    };
};

export type UserDeadProtocol = {
    kind: "userDead";
    userDead: {
        user: User;
        killer: User | undefined;
        message: string;
    };
};

export type Protocol = InitSuccessProtocol | JoinProtocol | JoinSuccessProtocol | ControlProtocol | TickProtocol | ExplodeProtocol | UserDeadProtocol;

export type userStatus = "dieing" | "climbing" | "rolling2" | "standing" | "rolling" | "mining" | "crawling" | "falling";

export type Ladder = { // (x,y1) until (x,y2)
    x: number;
    y1: number;
    y2: number;
};
