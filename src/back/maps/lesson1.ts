import * as services from "../services";

export const map = {
    w: 22,
    h: 12,
    floor: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    pilla: [{
        x: 19.5,
        y1: 1,
        y2: 6,
    }, {
        x: 6.5,
        y1: 5,
        y2: 10,
    }],
    borns: [{
        x: 2,
        y: 1,
    }],
    npcs: [{
        x: 14,
        y: 9,
        name: "王二狗",
    }],
    structs: [
        {
            type: "sign",
            x: 2,
            y: 1,
            message: "A,D 左右移动",
        }, {
            type: "sign",
            x: 10,
            y: 1,
            message: "如果你掉进水中就会失败，你需要按W跳过去",
        }, {
            type: "sign",
            x: 17,
            y: 1,
            message: "走到梯子上，按W,S上下层",
        }, {
            type: "sign",
            x: 14,
            y: 5,
            message: "对于宽阔的缝隙，你需要助跑并跳过去",
        }, {
            type: "sign",
            x: 8,
            y: 5,
            message: "目标：消灭王二狗",
        }, {
            type: "sign",
            x: 7,
            y: 9,
            message: "利用与对手的碰撞，把敌人推进水中",
        }, {
            type: "sign",
            x: 10,
            y: 9,
            message: "碰撞的效果取决于双方的姿势，通常下蹲和跳起方可以获得优势",
        },
    ],
    hooks: {
        onKilled: (game: services.Game, u: services.User) => {
            if (u.npc) {
                game.win(u);
            }
        },
    },
};
