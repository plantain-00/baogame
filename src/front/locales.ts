const defaultLocale = {
    item: [
        "power",
        "gun",
        "mine",
        "drug",
        "hide",
        "bomb",
        "doublejump",
        "flypack",
        "grenade",
    ],
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
        item: [
            "无敌",
            "枪",
            "地雷",
            "毒药",
            "隐身",
            "惊喜！",
            "二段跳",
            "喷气背包",
            "手雷",
        ],
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

export function getScoreText(score: number) {
    if (score <= 8) {
        return locale.score[score - 1];
    }
    return locale.score[7];
}
