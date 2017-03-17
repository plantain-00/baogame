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
};

const otherLocales: { [language: string]: typeof defaultLocale } = {
    "zh-CN": {
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
    },
};

const locale = otherLocales[navigator.language] || defaultLocale;

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
