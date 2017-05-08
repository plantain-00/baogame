import * as variables from "./variables";

export const happy = new Image();
happy.src = `./imgs/head/${variables.staticImgsHeadHappyPng}`;

export const throll = new Image();
throll.src = `./imgs/head/${variables.staticImgsHeadThrollPng}`;

export const danger = new Image();
danger.src = `./imgs/head/${variables.staticImgsHeadDanger3Png}`;

export const alone = new Image();
alone.src = `./imgs/head/${variables.staticImgsHeadAlonePng}`;

export const normal = new Image();
normal.src = `./imgs/head/${variables.staticImgsHeadNormalPng}`;

export const win = new Image();
win.src = `./imgs/head/${variables.staticImgsHeadWinPng}`;

export const wtf = new Image();
wtf.src = `./imgs/head/${variables.staticImgsHeadWtfPng}`;

export const sign = new Image();
sign.src = `./imgs/tile/${variables.staticImgsTileSignPng}`;

export const door = new Image();
door.src = `./imgs/tile/${variables.staticImgsTileDoorPng}`;

export const itemGate = new Image();
itemGate.src = `./imgs/tile/${variables.staticImgsTileItemGatePng}`;

export const bomb = new Image();
bomb.src = `./imgs/${variables.staticImgsBombPng}`;

export const grenade = new Image();
grenade.src = `./imgs/${variables.staticImgsGrenadePng}`;

export const arm = new Image();
arm.src = `./imgs/${variables.staticImgsArmPng}`;

export const mine = new Image();
mine.src = `./imgs/${variables.staticImgsMinePng}`;

export const jet = new Image();
jet.src = `./imgs/${variables.staticImgsJetPng}`;

const itemPower = new Image();
itemPower.src = `./imgs/item/${variables.staticImgsItemPowerPng}`;
const itemGun = new Image();
itemGun.src = `./imgs/item/${variables.staticImgsItemGunPng}`;
const itemMine = new Image();
itemMine.src = `./imgs/item/${variables.staticImgsItemMinePng}`;
const itemDrug = new Image();
itemDrug.src = `./imgs/item/${variables.staticImgsItemDrugPng}`;
const itemHide = new Image();
itemHide.src = `./imgs/item/${variables.staticImgsItemHidePng}`;
const itemRandom = new Image();
itemRandom.src = `./imgs/item/${variables.staticImgsItemRandomPng}`;
const itemFlypack = new Image();
itemFlypack.src = `./imgs/item/${variables.staticImgsItemFlypackPng}`;
const itemGrenade = new Image();
itemGrenade.src = `./imgs/item/${variables.staticImgsItemGrenadePng}`;

export const items: HTMLImageElement[] = [itemPower, itemGun, itemMine, itemDrug, itemHide, itemRandom, itemRandom, itemFlypack, itemGrenade];
