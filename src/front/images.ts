import * as variables from "./variables";

export const happy = new Image();
happy.src = `./imgs/head/${variables.headHappyPng}`;

export const throll = new Image();
throll.src = `./imgs/head/${variables.headThrollPng}`;

export const danger = new Image();
danger.src = `./imgs/head/${variables.headDanger3Png}`;

export const alone = new Image();
alone.src = `./imgs/head/${variables.headAlonePng}`;

export const normal = new Image();
normal.src = `./imgs/head/${variables.headNormalPng}`;

export const win = new Image();
win.src = `./imgs/head/${variables.headWinPng}`;

export const wtf = new Image();
wtf.src = `./imgs/head/${variables.headWtfPng}`;

export const sign = new Image();
sign.src = `./imgs/tile/${variables.tileSignPng}`;

export const door = new Image();
door.src = `./imgs/tile/${variables.tileDoorPng}`;

export const itemGate = new Image();
itemGate.src = `./imgs/tile/${variables.tileItemGatePng}`;

export const bomb = new Image();
bomb.src = `./imgs/${variables.bombPng}`;

export const grenade = new Image();
grenade.src = `./imgs/${variables.grenadePng}`;

export const arm = new Image();
arm.src = `./imgs/${variables.armPng}`;

export const mine = new Image();
mine.src = `./imgs/${variables.minePng}`;

export const jet = new Image();
jet.src = `./imgs/${variables.jetPng}`;

const itemPower = new Image();
itemPower.src = `./imgs/item/${variables.itemPowerPng}`;
const itemGun = new Image();
itemGun.src = `./imgs/item/${variables.itemGunPng}`;
const itemMine = new Image();
itemMine.src = `./imgs/item/${variables.itemMinePng}`;
const itemDrug = new Image();
itemDrug.src = `./imgs/item/${variables.itemDrugPng}`;
const itemHide = new Image();
itemHide.src = `./imgs/item/${variables.itemHidePng}`;
const itemRandom = new Image();
itemRandom.src = `./imgs/item/${variables.itemRandomPng}`;
const itemFlypack = new Image();
itemFlypack.src = `./imgs/item/${variables.itemFlypackPng}`;
const itemGrenade = new Image();
itemGrenade.src = `./imgs/item/${variables.itemGrenadePng}`;

export const items: HTMLImageElement[] = [itemPower, itemGun, itemMine, itemDrug, itemHide, itemRandom, itemRandom, itemFlypack, itemGrenade];
