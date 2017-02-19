import { connect, emit } from "./socket";
import { Packs } from "./JPack";
import * as pcController from "./pcController";
import * as mobileController from "./pcController";
import * as common from "../back/common";

const {p1, p2} = (navigator.userAgent.indexOf("iPhone") === -1
    && navigator.userAgent.indexOf("Android") === -1
    && navigator.userAgent.indexOf("iPad") === -1)
    ? pcController.start(joing, initDone)
    : mobileController.start(joing, initDone);

// 5毛钱特效
// effect 是由事件触发的，临时的，逻辑无关效果。如爆炸后的效果、喷出气体等
class Smoke {
    life: number;
    totalLife: number;
    chaos: number;
    constructor(public x: any, public y: any, public size: any, life: number) {
        this.life = Math.floor(life);
        this.totalLife = Math.random() * 60 + 30;
        this.chaos = Math.random() * 4 - 2;
    }
    draw(ctx: any, t: any) {
        t += this.chaos;
        const g = t < 5 ? 255 - Math.floor(t * 50) : Math.min(255, Math.floor(t * 20));
        const b = t < 5 ? 0 : Math.min(255, Math.floor(t * 20));
        const a = (this.totalLife - this.life) / this.totalLife;
        ctx.fillStyle = "rgba(255, " + g + ", " + b + ", " + a + ")";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Flare {
    x: any;
    y: any;
    txt: string;
    life: number;
    smokes: Smoke[];
    constructor(mine: any, large?: any) {
        this.x = mine.x;
        this.y = mine.y;
        this.txt = " 嘭！";
        this.life = 70;
        this.smokes = [];

        if (large) {
            for (let j = 0; j < 15; j++) {
                const r = j / 3 - .8 + Math.random() * .5 - .25;
                const len = Math.random() * 30 + 15;
                for (let i = 0; i < len; i++) {
                    this.smokes.push(new Smoke(
                        i * .04 * mine.power * Math.sin(r),
                        -i * .04 * mine.power * Math.cos(r) + i * i * mine.power / 3000,
                        5 * Math.pow((len - i) / len, .6) * (Math.random() + 2),
                        -i + Math.random() * len,
                    ));
                }
            }
        } else {
            for (let j = 0; j < 5; j++) {
                const r = j / 3 - .8 + Math.random() * .5 - .25;
                const len = Math.random() * 20 + 10;
                for (let i = 0; i < len; i++) {
                    this.smokes.push(new Smoke(
                        i * 5 * Math.sin(r),
                        -i * 5 * Math.cos(r) + i * i / 10,
                        3 * Math.pow((len - i) / len, .8) * (Math.random() + 2),
                        -i + Math.random() * len,
                    ));
                }
            }
        }
    }
    draw(ctx: any) {
        ctx.save();
        ctx.translate(this.x, P.h - this.y);
        ctx.fillStyle = "#fff";
        ctx.font = "34px 宋体";
        ctx.fillText(this.txt, 0, this.life - 80);
        ctx.font = "14px 宋体";
        const _this = this;
        this.smokes.forEach((smoke) => {
            smoke.life++;
            if (smoke.life > 0 && smoke.life < smoke.totalLife) {
                smoke.draw(ctx, 70 - _this.life);
            }
        });
        ctx.restore();
    }
}

class Toast {
    x: any;
    y: any;
    dy = -60;
    size: number;
    txt: string;
    life = 40;
    t = 0;
    constructor(user: any) {
        this.x = user.x;
        this.y = user.y;
        this.size = user.size;
        this.txt = user.txt;
    }
    draw(ctx: any) {
        this.t++;
        ctx.save();
        if (this.life < 10) {
            this.dy -= (10 - this.life) / 4;
            ctx.globalAlpha = this.life / 10;
        }
        ctx.translate(this.x, P.h - this.y);
        ctx.scale(Math.min(this.t / 5, 1), Math.min(this.t / 5, 1));
        ctx.fillStyle = "#fff";
        ctx.font = this.size + "px 宋体";
        ctx.fillText(this.txt, 0, this.dy);
        ctx.font = "14px 宋体";
        ctx.restore();
    }
}

class Brust {
    x: any;
    y: any;
    size: number;
    life = 100;
    drops: any[];
    vy = 2;
    constructor(u: any, count: any, w: any, dx?: any, dy?: any, size?: any) {
        this.x = u.x;
        this.y = u.y;
        this.size = size || 6;
        this.drops = [];
        dx = dx || 0;
        dy = dy || 0;
        for (let i = 0; i < count; i++) {
            this.drops.push({
                x: Math.random() * w - w / 2 + dx, y: Math.random() * 10 - 5 + dy,
            });
        }
    }

    draw(ctx: any) {
        ctx.save();
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = this.life / 100;
        const _this = this;
        this.vy *= .95;
        this.drops.forEach(drop => {
            drop.y -= _this.vy;
            ctx.beginPath();
            ctx.arc(drop.x + _this.x, P.h - drop.y - _this.y, _this.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}

class WaterDrops {
    x: any;
    y: any;
    life = 100;
    drops: any[];
    constructor(u: any) {
        this.x = u.x;
        this.y = u.y;
        this.drops = [];

        for (let i = 0; i < 1 - u.vy * 2; i++) {
            this.drops.push({
                x: 0, y: 0, vx: Math.random() * 4 - 2, vy: -Math.random() * u.vy / 1.5 + 1,
            });
        }
    }
    draw(ctx: any) {
        ctx.save();
        ctx.fillStyle = "#95a";
        const _this = this;
        this.drops.forEach(drop => {
            if (drop.y >= 0) {
                drop.y += drop.vy;
                drop.vy -= .2;
                drop.x += drop.vx;
                ctx.beginPath();
                ctx.arc(drop.x + _this.x, P.h - drop.y - _this.y, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.restore();
    }
}

class ItemDead {
    life = 40;
    constructor(public item: any, public name: any) { }
    draw(ctx: any) {
        ctx.strokeStyle = "rgba(255,255,255," + (this.life) / 40 + ")";
        ctx.beginPath();
        ctx.arc(this.item.x, P.h - this.item.y, P.itemSize + (40 - this.life) / 2, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.font = (1600 - this.life * this.life) / 160 + 12 + "px 宋体";
        ctx.fillStyle = "#fff";
        ctx.fillText(this.name, this.item.x, P.h - this.item.y);
        ctx.font = "14px 宋体";
    }
}

class ShotLine {
    life = 20;
    constructor(public x: number, public y: number, public dir: any) { }
    draw(ctx: any) {
        ctx.strokeStyle = "rgba(255,255,0," + (this.life) / 20 + ")";
        ctx.beginPath();
        if (this.dir === 1) {
            ctx.moveTo(this.x + 40, P.h - this.y);
            ctx.lineTo(P.w, P.h - this.y);
        } else {
            ctx.moveTo(this.x - 40, P.h - this.y);
            ctx.lineTo(0, P.h - this.y);
        }
        ctx.stroke();
    }
}

// let effects: any;
let lists: any[] = [];
const Effect = {
    // create(name: any, val: any) {
    //     effects[name] = val;
    // },
    trigger(effect: any) {
        lists.push(effect);
    },
    render(ctx: any) {
        for (let i = lists.length - 1; i >= 0; i--) {
            const eff = lists[i];
            if (eff.life < 0) {
                lists.splice(i, 1);
            } else {
                eff.draw(ctx);
                eff.life--;
            }
        }
    },
    clean() {
        lists = [];
    },
};

const scoreText = [
    "小试牛刀",
    "势不可挡",
    "正在大杀特杀",
    "已经主宰比赛",
    "已经杀人如麻",
    "已经无人能挡",
    "已经变态杀戮",
    "已经妖怪般的杀戮",
    "已经如同神一般",
    "已经超越神了",
];

function notice(str: any) {
    $(".notice .notiveIn").prepend("<div class='noticeItem'>" + str + "</div>");
}

let cdomBody: any;
let ctxBody: any;
let ctx: any;
let ctxBg;
let P: any;
let t = 0;
let cdx = 0;
let cdy = 0;
let canJoin: any = null;
const game: any = {};

let userName = localStorage.getItem("userName");
if (userName) {
    $("#name").val(userName);
}
function joing(p: any) {
    if (!canJoin) { return; }
    userName = $("#name").val() || "无名小卒";
    if ($("#name").val()) {
        localStorage.setItem("userName", userName!);
    } else {
        localStorage.removeItem("userName");
    }
    emit("join", {
        userName,
        p1: p,
    });
}

function parseParam() {
    let query = location.search;
    if (query.indexOf("?") === 0) {
        query = query.substring(1);
    }
    if (!query) {
        return {};
    }
    const arr = query.split("&");
    const res: any = {};
    for (let i = arr.length - 1; i >= 0; i--) {
        const pair = arr[i].split("=");
        if (pair[1]) {
            res[pair[0]] = decodeURIComponent(pair[1].replace(/\+/g, " "));
        } else {
            res[pair[0]] = null;
        }
    }
    return res;
}

function initDone() {
    let controlCache = "";
    const param = parseParam();
    connect(param.roomID, () => {
        emit("init", { userName });
    }, (name, data) => {
        if (name === "init") {
            Effect.clean();
            P = data.props;	// 常量
            const cdom = document.createElement("canvas");	// 玩家层
            const cdomBg = document.createElement("canvas");	// 背景层（只绘制一次）
            cdomBody = document.createElement("canvas");	// 标记层（只添加，不修改，尸体）
            cdom.width = P.w;
            cdom.height = P.h;
            cdom.id = "fg";
            cdomBg.width = P.w;
            cdomBg.height = P.h;
            cdomBg.id = "bg";
            cdomBody.width = P.w;
            cdomBody.height = P.h;
            ctx = cdom.getContext("2d");
            ctx.font = "14px 宋体";
            ctx.textBaseline = "middle"; // 设置文本的垂直对齐方式
            ctx.textAlign = "center"; // 设置文本的水平对对齐方式

            ctxBg = cdomBg.getContext("2d");
            ctxBody = cdomBody.getContext("2d");
            ctxBody.font = "14px 宋体";
            ctxBody.textBaseline = "middle"; // 设置文本的垂直对齐方式
            ctxBody.textAlign = "center"; // 设置文本的水平对对齐方式

            drawBg(ctxBg, data.map);
            game.structs = [];
            for (let i = 0; i < data.map.structs.length; i++) {
                game.structs[data.map.structs[i].id] = data.map.structs[i];
            }
            const middle: any = document.getElementById("middle");
            middle.innerHTML = "";
            middle.appendChild(cdomBg);
            middle.appendChild(cdom);
            // 初始化尸体
            for (const body of data.bodies) {
                const user = Packs.userPack.decode(body);
                drawUser(ctxBody, user, {});
            }
            $(".joining").show();
        } else if (name === "joinSuccess") {
            $(".joining").hide();
        } else if (name === "joinFail") {
            alert(data);
        } else if (name === "tick") {
            t++;
            p1.id = data.p1;
            p1.onStruct = data.onStruct;
            for (let i = 0; i < data.users.length; i++) {
                data.users[i] = Packs.userPack.decode(data.users[i]);
                if (data.users[i].id === p1) {
                    p1.data = data.users[i];
                }
            }
            for (let i = 0; i < data.items.length; i++) {
                data.items[i] = Packs.itemPack.decode(data.items[i]);
            }
            for (let i = 0; i < data.mines.length; i++) {
                data.mines[i] = Packs.minePack.decode(data.mines[i]);
            }
            for (let i = 0; i < data.entitys.length; i++) {
                data.entitys[i] = Packs.entityPack.decode(data.entitys[i]);
            }

            render(ctx, data);

            // 发送控制
            const control = JSON.stringify(Packs.controlPack.encode(p1));
            if (controlCache !== control) {
                controlCache = control;
                emit("control", Packs.controlPack.encode(p1));
            }
            let userCount = 0;
            for (const user of data.users) {
                if (!user.npc) {
                    userCount++;
                }
            }
            if (userCount < P.maxUser && canJoin !== true) {
                canJoin = true;
                $(".joining .joinBtn").removeAttr("disabled");
                $(".joining .joinBtn").removeAttr("disabledText");
            } else if (userCount >= P.maxUser && canJoin !== false) {
                canJoin = false;
                $(".joining .joinBtn").attr("disabled", "disabled");
                $(".joining .joinBtn").attr("disabledText", "：房间已满");
            }
            p1.leftPress = false;
            p1.rightPress = false;
            p1.upPress = false;
            p1.downPress = false;
            p1.itemPress = false;
        } else if (name === "explode") {
            cdx = 8;
            cdy = 9;
            Effect.trigger(new Flare(data, true));
        } else if (name === "userDead") {
            const user = Packs.userPack.decode(data.user);
            notice(data.message);
            // p1 dead
            if (user.id === p1.id) {
                setTimeout(() => {
                    $(".joining").show().find("h4").html("你挂了");
                }, 500);
            }
            if (data.killer) {
                const killer = Packs.userPack.decode(data.killer);
                if (killer.score <= 10) {
                    Effect.trigger(new Toast({
                        x: killer.x,
                        y: killer.y,
                        size: killer.score * 1.5 + 14,
                        txt: killer.name + scoreText[killer.score - 1],
                    }));
                }
            }
        } else if (name === "win") {
            $(".win").css("display", "-webkit-box");
        }
    });
}

const imgUrls: any = {
    happy: "/head/happy.png",
    throll: "/head/throll.png",
    danger: "/head/danger3.png",
    alone: "/head/alone.png",
    alone2: "/head/alone2.png",
    alone3: "/head/alone3.png",
    normal: "/head/normal.png",
    win: "/head/win.png",
    wtf: "/head/wtf.png",
    items: [
        "/item/power.png",
        "/item/gun.png",
        "/item/mine.png",
        "/item/drug.png",
        "/item/hide.png",
        "/item/random.png",
        "/item/random.png",
        "/item/flypack.png",
        "/item/grenade.png",
    ],
    sign: "/tile/sign.png",
    door: "/tile/door.png",
    itemGate: "/tile/itemGate.png",
    bomb: "/bomb.png",
    arm: "/arm.png",
    grenade: "/grenade.png",
    minePlaced: "/mine.png",
    jet: "/jet.png",
};

const imgs: any = {};
for (const key in imgUrls) {
    if (typeof (imgUrls[key]) === "string") {
        const Img = new Image();
        Img.src = "./imgs" + imgUrls[key];
        imgs[key] = Img;
    } else {
        const arr = [];
        for (const imgUrl of imgUrls[key]) {
            const Img = new Image();
            Img.src = "./imgs" + imgUrl;
            arr.push(Img);
        }
        imgs[key] = arr;
    }
}

// 绘制背景
function drawBg(ctx: any, map: any) {
    ctx.clearRect(0, 0, P.w, P.h);
    // 绘制柱子
    map.pilla.forEach((pilla: any) => {
        ctx.fillStyle = "#888";
        for (let j = P.h - pilla.y2 * common.constant.tileHeight + 10; j < P.h - pilla.y1 * common.constant.tileHeight; j += 20) {
            ctx.fillRect(pilla.x * common.constant.tileWidth - 10, j, 20, 4);
        }

        ctx.fillStyle = "#aaa";
        ctx.beginPath();
        ctx.rect(pilla.x * common.constant.tileHeight - 12, P.h - pilla.y2 * common.constant.tileHeight, 4, (pilla.y2 - pilla.y1) * common.constant.tileHeight);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pilla.x * common.constant.tileWidth - 10, P.h - pilla.y2 * common.constant.tileHeight - 4, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.rect(pilla.x * common.constant.tileWidth + 8, P.h - pilla.y2 * common.constant.tileHeight, 4, (pilla.y2 - pilla.y1) * common.constant.tileHeight);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pilla.x * common.constant.tileWidth + 10, P.h - pilla.y2 * common.constant.tileHeight - 4, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    });

    // 绘制地板
    for (let i = 0; i < map.floor.length; i++) {
        for (let j = 0; j < map.floor[i].length; j++) {
            const x = j * common.constant.tileWidth;
            const y = P.h - (i) * common.constant.tileHeight;
            if (map.floor[i][j]) {
                ctx.beginPath();
                ctx.fillStyle = "#aa8";
                ctx.moveTo(x + 1, y);
                ctx.lineTo(x + common.constant.tileWidth - 1, y);
                ctx.lineTo(x + common.constant.tileWidth - 1, y + 4);
                ctx.lineTo(x + common.constant.tileWidth - 5, y + 8);
                ctx.lineTo(x + 5, y + 8);
                ctx.lineTo(x + 1, y + 4);
                ctx.fill();

                ctx.fillStyle = "#982";
                ctx.beginPath();
                ctx.fillRect(x + 1, y, common.constant.tileWidth - 2, 4);
                ctx.fill();
            }
        }
    }
}

function drawStructs(structs: any[]) {
    ctx.fillStyle = "#fff";
    ctx.font = "20px 宋体";
    for (let i = 1; i < structs.length; i++) {
        const struct = structs[i];
        if (struct.type === "sign") {
            if (struct.id === p1.onStruct) {
                ctx.fillText(struct.message, struct.x * common.constant.tileWidth, P.h - (struct.y + 1) * common.constant.tileHeight - 30);
            }
            ctx.drawImage(imgs.sign, struct.x * common.constant.tileWidth, P.h - (struct.y + 1) * common.constant.tileHeight, common.constant.tileWidth, common.constant.tileHeight);
        } else if (struct.type === "itemGate") {
            ctx.drawImage(imgs.itemGate, struct.x * common.constant.tileWidth, P.h - (struct.y + 1) * common.constant.tileHeight, common.constant.tileWidth, common.constant.tileHeight);
        } else {
            ctx.drawImage(imgs.door, struct.x * common.constant.tileWidth, P.h - (struct.y + 1) * common.constant.tileHeight, common.constant.tileWidth, common.constant.tileHeight);
        }
    }
    ctx.font = "14px 宋体";
}

function drawWater(ctx: any, height: any, color: any) {
    const waveLen = 20;
    let waveHeight = height / 5;
    const c = waveLen / 2;
    const b = P.h - height;
    const offset = Math.sin(t / 50 + height) * 10;
    let start = offset - 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(start, P.h);
    ctx.lineTo(start, P.h - height);
    while (start < P.w) {
        ctx.bezierCurveTo(start + c, b + waveHeight, start + waveLen - c, b + waveHeight, start + waveLen, b);
        start += waveLen;
        waveHeight *= -1;
    }
    ctx.lineTo(P.w, P.h);
    ctx.fill();
}

function drawWeapon(ctx: any, index: any) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 6;
    if (index < 10) {
        ctx.rotate(1 - index / 10);
    }
    ctx.beginPath();
    ctx.moveTo(10, 0);
    let endx;
    if (index < 10) {
        ctx.lineTo(10 + index * 2, 10 - index);
        ctx.lineTo(10 + index * 3, -5);
        endx = 10 + index * 3;
    } else {
        ctx.lineTo(10 + 20, 0);
        ctx.lineTo(10 + 30, -5);
        endx = 10 + 30;
    }
    ctx.stroke();

    ctx.strokeStyle = "#F00";
    ctx.beginPath();
    ctx.moveTo(endx, 0);
    ctx.lineTo(endx, -6);
    ctx.lineTo(endx + 9, -6);
    ctx.stroke();

    ctx.lineWidth = 1;
}

function drawUser(ctx: any, user: any, data: any) {
    if (user.doubleJumping) {
        Effect.trigger(new Brust(user, 10, 40))
    }

    ctx.save();
    let img;
    ctx.translate(user.x, P.h - user.y);
    if (user.dead) {
        img = imgs.alone;
    } else if (user.status === "dieing") {
        img = imgs.alone;
    } else if (user.carry === Packs.items.power.id) {
        img = imgs.win;
    } else if (user.danger) {
        img = imgs.danger;
    } else if (user.status === "crawling" || user.status === "mining" || user.status === "rolling2") {
        img = imgs.throll;
    } else if (user.carry === Packs.items.bomb.id) {
        img = imgs.wtf;
    } else if (user.status === "falling" || user.status === "climbing") {
        img = imgs.happy;
    } else {
        img = imgs.normal;
    }

    if (user.id === data.p1) {
        ctx.fillStyle = "#ffa";
    } else if (user.id === data.p2) {
        ctx.fillStyle = "#aaf";
    } else {
        ctx.fillStyle = "#f77";
    }

    // 用户指示器
    if (user.carry !== Packs.items.hide.id || (user.id === p1.id && !p2.id)) {
        ctx.fillText(user.name, 0, -50);
        if (user.nearPilla && (user.id === p1.id || user.id === p2.id)) {
            ctx.fillText("上", 0, -70);
        }
    }

    ctx.scale(user.faceing, 1);

    if (user.fireing) {
        if (user.fireing === 5) {
            Effect.trigger(new ShotLine(user.x, user.y + 25, user.faceing));
        }
        ctx.save();
        ctx.translate(0, -P.userWidth / 2);
        drawWeapon(ctx, 25 - user.fireing);
        ctx.restore();
    }

    if (user.carry === Packs.items.hide.id) {
        ctx.globalAlpha = user.carryCount > 900 ? (user.carryCount - 900) / 100 : user.carryCount > 100 ? 0 : (100 - user.carryCount) / 100;
    }

    if (user.status === "crawling" || user.status === "mining" || user.status === "rolling2") {
        ctx.drawImage(img, -P.userWidth / 2, -25, P.userWidth, P.userHeight);
    } else {
        ctx.drawImage(img, -P.userWidth / 2, -P.userHeight, P.userWidth, P.userHeight);
    }
    if (user.carry === Packs.items.flypack.id) {
        const bottleWidth = 10;
        const bottleHeight = 30;
        const wPadding = -P.userWidth / 2 - bottleWidth;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.fillStyle = "rgb(100,160,255)";
        ctx.fillRect(wPadding, -bottleHeight * user.carryCount / Packs.items.flypack.count, bottleWidth, bottleHeight * user.carryCount / Packs.items.flypack.count);
        ctx.stroke();

        ctx.drawImage(imgs.jet, wPadding - 16, -bottleHeight - 10, 40, bottleHeight + 20);
        if (user.flying) {
            Effect.trigger(new Brust(user, 1, 5, user.faceing * (wPadding + bottleWidth / 2), -10));
        }
    }
    if (user.carry === Packs.items.bomb.id) {
        ctx.drawImage(imgs.bomb, P.userWidth / 2 - 10, -P.userHeight, 30, 40);
        if (!user.dead) {
            ctx.scale(user.faceing, 1);
            const x = user.faceing * (P.userWidth / 2 + 10)
            ctx.font = "28px 宋体";
            ctx.fillStyle = "#ff0";
            ctx.fillText(Math.floor(user.carryCount * 17 / 1000) + 1, x, -P.userHeight - 10);
            ctx.font = "14px 宋体";
            ctx.scale(user.faceing, 1);
        }
    }
    if (user.grenadeing > 0) {
        ctx.save();

        ctx.translate(-10, -20);
        ctx.rotate((25 - user.grenadeing) / 10);
        ctx.translate(-40, -P.userHeight / 2);

        ctx.drawImage(imgs.arm, 0, 0, 40, 40);
        ctx.drawImage(imgs.grenade, -10, -13, 30, 40);
        ctx.restore();
    }
    ctx.restore();
}

function drawItem(ctx: any, item: any) {
    const s = common.constant.itemSize;
    ctx.strokeStyle = "rgba(255,255,255," + Math.abs((t % 300) / 150 - 1) + ")";
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(item.x, P.h - item.y);
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.drawImage(imgs.items[item.id - 1], -s, -s, s * 2, s * 2);
    ctx.restore();
}

function drawEntity(ctx: any, entity: any) {
    const w = 15;
    const h = 18;
    ctx.save();
    ctx.translate(entity.x, P.h - entity.y);
    ctx.rotate(entity.r / 10);
    ctx.drawImage(imgs.grenade, -w, -h, w * 2, h * 2);
    ctx.restore();
}

function render(ctx: any, data: any) {
    ctx.clearRect(0, 0, P.w, P.h);
    ctx.save();
    ctx.translate(cdx, cdy);
    if (cdx > .5) {
        cdx *= -.98;
    } else {
        cdx = 0;
    }
    if (cdy > .5) {
        cdy *= -.97;
    } else {
        cdy = 0;
    }
    drawWater(ctx, 20, "#758");

    ctx.drawImage(cdomBody, 0, 0);

    drawStructs(game.structs);

    data.mines.forEach((mine: any) => {
        ctx.drawImage(imgs.minePlaced, mine.x - 12, P.h - mine.y - 3, 23, 5);
        if (mine.dead) {
            cdx = 3;
            cdy = 11;
            Effect.trigger(new Flare(mine));
        }
    });

    for (const user of data.users) {
        if (user.dead === true) {
            Effect.trigger(new WaterDrops(user));
            drawUser(ctxBody, user, {});
        } else {
            drawUser(ctx, user, data);
        }
    }

    drawWater(ctx, 10, "#95a");

    for (const item of data.items) {
        drawItem(ctx, item);
        if (item.dead) {
            let itemName = "";
            for (const key in Packs.items) {
                if ((Packs.items as any)[key].id === item.id) {
                    itemName = (Packs.items as any)[key].name;
                }
            }
            Effect.trigger(new ItemDead(item, itemName));
        }
    }

    for (const entity of data.entitys) {
        drawEntity(ctx, entity);
    }

    Effect.render(ctx);

    ctx.restore();
}
