export const tileWidth = 40;
export const tileHeight = 40;
export const itemSize = 15;
export const userWidth = 40;
export const userHeight = 40;
export const tw = 28;
export const th = 15;
export const w = tw * tileWidth;
export const h = th * tileHeight;

export enum ItemType {
    power = 0,
    gun = 1,
    mine = 2,
    drug = 3,
    hide = 4,
    bomb = 5,
    doublejump = 6,
    flypack = 7,
    grenade = 8,
};

export const itemCounts = [1000, 3, 2, 4, 1000, 550, 0, 250, 3];

export type Item = {
    x: number;
    y: number;
    type: ItemType;
    dead: boolean;
};

export type Mine = {
    x: number;
    y: number;
    dead: boolean;
};

export type Grenade = {
    x: number;
    y: number;
    r: number;
};

export type User = {
    itemType?: ItemType;
    itemCount: number;
    nearLadder?: Ladder;
    faceing: number;
    fireing?: number;
    grenadeing: number;
    danger: boolean,
    status: userStatus;
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

export type Door = {
    x: number;
    y: number;
};

export type ItemGate = {
    x: number;
    y: number;
};

export enum ProtocolKind {
    tick = 0,
    initSuccess = 1,
    join = 2,
    joinSuccess = 3,
    control = 4,
    explode = 5,
    userDead = 6,
}

export type TickProtocol = {
    kind: ProtocolKind.tick;
    tick: {
        users: User[];
        items: Item[];
        mines: Mine[];
        grenades: Grenade[];
    };
};

export type MapData = {
    w: number;
    h: number;
    floors: number[];
    ladders: Ladder[];
    doors: Door[],
    itemGates: ItemGate[],
};

export type InitSuccessProtocol = {
    kind: ProtocolKind.initSuccess;
    initSuccess: {
        map: MapData;
    }
};

export type JoinProtocol = {
    kind: ProtocolKind.join;
    join: {
        userName: string;
    };
};

export type JoinSuccessProtocol = {
    kind: ProtocolKind.joinSuccess;
    joinSuccess: {
        userId: number;
    };
};

export type Control = {
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

export type ControlProtocol = {
    kind: ProtocolKind.control;
    control: Control;
};

export type ExplodeProtocol = {
    kind: ProtocolKind.explode;
    explode: {
        x: number;
        y: number;
        power: number;
    };
};

export type UserDeadProtocol = {
    kind: ProtocolKind.userDead;
    userDead: {
        user: User;
        killer?: User;
    };
};

export type Protocol = InitSuccessProtocol | JoinProtocol | JoinSuccessProtocol | ControlProtocol | TickProtocol | ExplodeProtocol | UserDeadProtocol;

export enum userStatus {
    dieing = 0,
    climbing = 1,
    rolling2 = 2,
    standing = 3,
    rolling = 4,
    mining = 5,
    crawling = 6,
    falling = 7,
}

export type Ladder = { // (x,y1) until (x,y2)
    x: number;
    y1: number;
    y2: number;
};
