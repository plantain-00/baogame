import * as common from "../back/common";

const defaultLocale = {
    item: {
        power: "power",
        gun: "gun",
        mine: "mine",
        drug: "drug",
        hide: "hide",
        bomb: "bomb",
        doublejump: "doublejump",
        flypack: "flypack",
        grenade: "grenade",
    },
    score: [
        "is on a Killing Spree",
        "is Dominating",
        "has a Mega-Kill",
        "is Unstoppable",
        "is Wicked Sick",
        "has a M-m-m-m....Monster Kill",
        "is Godlike",
        "Holy Shit",
    ],
    ui: {
        youAreDead: "You are dead",
        joinGame: "Join game",
        yourName: "Your name:",
        joinByPressE: "Join by press 'e'",
        left: "left",
        right: "right",
        up: "up",
        down: "down",
        useItem: "item",
        notice: "W,A,S,D: move Q: use item",
        noOne: "no one",
    },
};

const otherLocales: { [language: string]: typeof defaultLocale } = {
    "zh-cn": {
        item: {
            power: "无敌",
            gun: "枪",
            mine: "地雷",
            drug: "毒药",
            hide: "隐身",
            bomb: "惊喜！",
            doublejump: "二段跳",
            flypack: "喷气背包",
            grenade: "手雷",
        },
        score: [
            "正在大杀特杀",
            "已经主宰比赛",
            "已经杀人如麻",
            "已经无人能挡",
            "已经变态杀戮",
            "已经妖怪般的杀戮",
            "已经如同神一般",
            "已经超越神了",
        ],
        ui: {
            youAreDead: "你挂了",
            joinGame: "加入游戏",
            yourName: "你的名字:",
            joinByPressE: "按e加入",
            left: "左",
            right: "右",
            up: "上",
            down: "下",
            useItem: "物品",
            notice: "W,A,S,D: 移动 Q: 使用物品",
            noOne: "无名小卒",
        },
    },
};

export const locale = otherLocales[navigator.language.toLowerCase()] || defaultLocale;

export function getItemName(id: number) {
    if (id === common.items.power.id) {
        return locale.item.power;
    }
    if (id === common.items.gun.id) {
        return locale.item.gun;
    }
    if (id === common.items.mine.id) {
        return locale.item.mine;
    }
    if (id === common.items.drug.id) {
        return locale.item.drug;
    }
    if (id === common.items.hide.id) {
        return locale.item.hide;
    }
    if (id === common.items.bomb.id) {
        return locale.item.bomb;
    }
    if (id === common.items.doublejump.id) {
        return locale.item.doublejump;
    }
    if (id === common.items.flypack.id) {
        return locale.item.flypack;
    }
    if (id === common.items.grenade.id) {
        return locale.item.grenade;
    }
    return "";
}

export function getScoreText(score: number) {
    if (score <= 8) {
        return locale.score[score - 1];
    }
    return locale.score[7];
}
