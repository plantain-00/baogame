import { connect, emit } from "./socket";
import * as pcController from "./pcController";
import * as mobileController from "./pcController";
import * as common from "../back/common";
import * as images from "./images";
import * as flare from "./effects/flare";
import * as toast from "./effects/toast";
import * as waterDrop from "./effects/waterDrops";
import * as itemDead from "./effects/itemDead";
import * as drawer from "./drawer";

const p1 = (navigator.userAgent.indexOf("iPhone") === -1
    && navigator.userAgent.indexOf("Android") === -1
    && navigator.userAgent.indexOf("iPad") === -1)
    ? pcController.start(joing, initDone)
    : mobileController.start(joing, initDone);

(window as any).items = common.items;

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

function notice(str: string) {
    $(".notice .notiveIn").prepend("<div class='noticeItem'>" + str + "</div>");
}

let cdomBody: HTMLCanvasElement;
let ctxBody: CanvasRenderingContext2D;
let context: CanvasRenderingContext2D;
let ctxBg;
let P: common.Props;
let t = 0;
let cdx = 0;
let cdy = 0;
const game: {
    signs: common.Sign[],
    doors: common.Door[],
    itemGates: common.ItemGate[],
} = {
        signs: [],
        doors: [],
        itemGates: [],
    };

let userName = localStorage.getItem("userName");
if (userName) {
    $("#name").val(userName);
}
function joing(p: boolean) {
    userName = $("#name").val() || "无名小卒";
    if ($("#name").val()) {
        localStorage.setItem("userName", userName!);
    } else {
        localStorage.removeItem("userName");
    }
    emit({
        kind: "join",
        join: {
            userName: userName!,
            p1: p,
        },
    });
}

let lastControl: string;

function initDone() {
    connect(protocol => {
        if (protocol.kind === "initSuccess") {
            P = protocol.initSuccess.props;	// 常量
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
            context = cdom.getContext("2d") !;
            context.font = "14px 宋体";
            context.textBaseline = "middle"; // 设置文本的垂直对齐方式
            context.textAlign = "center"; // 设置文本的水平对对齐方式

            ctxBg = cdomBg.getContext("2d");
            ctxBody = cdomBody.getContext("2d") !;
            ctxBody.font = "14px 宋体";
            ctxBody.textBaseline = "middle"; // 设置文本的垂直对齐方式
            ctxBody.textAlign = "center"; // 设置文本的水平对对齐方式

            drawer.drawBg(ctxBg!, protocol.initSuccess.map, P.w, P.h);
            game.itemGates = protocol.initSuccess.map.itemGates;
            game.doors = protocol.initSuccess.map.doors;
            game.signs = protocol.initSuccess.map.signs;
            const middle = document.getElementById("middle") !;
            middle.innerHTML = "";
            middle.appendChild(cdomBg);
            middle.appendChild(cdom);
            $(".joining").show();
        } else if (protocol.kind === "joinSuccess") {
            $(".joining").hide();
        } else if (protocol.kind === "tick") {
            t++;
            p1.id = protocol.tick.p1;
            for (let i = 0; i < protocol.tick.users.length; i++) {
                if (protocol.tick.users[i].id === p1.id) {
                    p1.data = protocol.tick.users[i];
                }
            }

            render(context, protocol);

            const controlProtocol: common.ControlProtocol = {
                kind: "control",
                control: {
                    leftDown: p1.leftDown,
                    rightDown: p1.rightDown,
                    upDown: p1.upDown,
                    downDown: p1.downDown,
                    itemDown: p1.itemDown,
                    leftPress: p1.leftPress,
                    rightPress: p1.rightPress,
                    upPress: p1.upPress,
                    downPress: p1.downPress,
                    itemPress: p1.itemPress,
                },
            };
            const thisControl = JSON.stringify(controlProtocol);
            if (thisControl !== lastControl) {
                lastControl = thisControl;
                emit(controlProtocol);
            }
            let userCount = 0;
            for (const user of protocol.tick.users) {
                if (!user.npc) {
                    userCount++;
                }
            }
            p1.leftPress = false;
            p1.rightPress = false;
            p1.upPress = false;
            p1.downPress = false;
            p1.itemPress = false;
        } else if (protocol.kind === "explode") {
            cdx = 8;
            cdy = 9;
            drawer.flares.push(flare.create(protocol.explode.x, protocol.explode.y, protocol.explode.power, P.h, true));
        } else if (protocol.kind === "userDead") {
            notice(protocol.userDead.message);
            // p1 dead
            if (protocol.userDead.user.id === p1.id) {
                setTimeout(() => {
                    $(".joining").show().find("h4").html("你挂了");
                }, 500);
            }
            if (protocol.userDead.killer) {
                const killer = protocol.userDead.killer;
                if (killer.score <= 10) {
                    drawer.toasts.push(toast.create(killer.x, killer.y, killer.score * 1.5 + 14, killer.name + scoreText[killer.score - 1], P.h));
                }
            }
        }
    });
}

function render(ctx: CanvasRenderingContext2D, protocol: common.TickProtocol) {
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
    drawer.drawWater(ctx, 20, "#758", P.h, P.w, t);

    ctx.drawImage(cdomBody, 0, 0);

    drawer.drawDoors(context, game.doors, P.h);
    drawer.drawSigns(context, game.signs, P.h, p1.data);
    drawer.drawItemGates(context, game.itemGates, P.h);

    for (const mine of protocol.tick.mines) {
        ctx.drawImage(images.mine, mine.x - 12, P.h - mine.y - 3, 23, 5);
        if (mine.dead) {
            cdx = 3;
            cdy = 11;
            drawer.flares.push(flare.create(mine.x, mine.y, 0, P.h));
        }
    }

    for (const user of protocol.tick.users) {
        if (user.dead === true) {
            drawer.waterDrops.push(waterDrop.create(user.x, user.y, user.vy, P.h));
            drawer.drawUser(ctxBody, user, undefined, P.h, P.w, P.userWidth, P.userHeight, p1.id);
        } else {
            drawer.drawUser(ctx, user, protocol.tick.p1, P.h, P.w, P.userWidth, P.userHeight, p1.id);
        }
    }

    drawer.drawWater(ctx, 10, "#95a", P.h, P.w, t);

    for (const item of protocol.tick.items) {
        drawer.drawItem(ctx, item, t, P.h);
        if (item.dead) {
            let itemName = "";
            for (const key in common.items) {
                if ((common.items as any)[key].id === item.id) {
                    itemName = (common.items as any)[key].name;
                }
            }
            drawer.itemDeads.push(itemDead.create(item.x, item.y, itemName, P.h, P.itemSize));
        }
    }

    for (const entity of protocol.tick.entitys) {
        drawer.drawEntity(ctx, entity, P.h);
    }

    drawer.draw(ctx);

    ctx.restore();
}
