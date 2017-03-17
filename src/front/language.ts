import * as common from "../back/common";

export function getItemName(id: number) {
    if (id === common.items.power.id) {
        return "无敌";
    }
    if (id === common.items.gun.id) {
        return "枪";
    }
    if (id === common.items.mine.id) {
        return "地雷";
    }
    if (id === common.items.drug.id) {
        return "毒药";
    }
    if (id === common.items.hide.id) {
        return "隐身";
    }
    if (id === common.items.bomb.id) {
        return "惊喜！";
    }
    if (id === common.items.doublejump.id) {
        return "二段跳";
    }
    if (id === common.items.flypack.id) {
        return "喷气背包";
    }
    if (id === common.items.grenade.id) {
        return "手雷";
    }
    return "";
}
