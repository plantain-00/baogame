import { connect, emit } from "./socket";
import * as pcController from "./pcController";
import * as mobileController from "./pcController";
import * as common from "../back/common";
import * as images from "./images";
import { Flare } from "./effects/flare";
import { Toast } from "./effects/toast";
import { WaterDrops } from "./effects/waterDrops";
import { ItemDead } from "./effects/itemDead";
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

function notice(str: any) {
    $(".notice .notiveIn").prepend("<div class='noticeItem'>" + str + "</div>");
}

let cdomBody: any;
let ctxBody: any;
let context: any;
let ctxBg;
let P: any;
let t = 0;
let cdx = 0;
let cdy = 0;
let canJoin: any = null;
const game: {
    signs: common.SignProtocol[],
    doors: common.DoorProtocol[],
    itemGates: common.ItemGateProtocol[],
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
    if (!canJoin) { return; }
    userName = $("#name").val() || "无名小卒";
    if ($("#name").val()) {
        localStorage.setItem("userName", userName!);
    } else {
        localStorage.removeItem("userName");
    }
    emit({
        kind: "join",
        userName: userName!,
        p1: p,
    });
}

function getUrlParameter(name: string): string | undefined {
    const reg: RegExp = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const array: RegExpMatchArray | null = window.location.search.substr(1).match(reg);
    if (array && array.length >= 3) {
        return decodeURI(array[2]);
    }
    return undefined;
}

let lastControl: string;

function initDone() {
    const roomId = +getUrlParameter("roomID");
    connect(roomId, () => {
        emit({ kind: "init", userName: userName! });
    }, protocol => {
        if (protocol.kind === "init") {
            P = protocol.data.props;	// 常量
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
            context = cdom.getContext("2d");
            context.font = "14px 宋体";
            context.textBaseline = "middle"; // 设置文本的垂直对齐方式
            context.textAlign = "center"; // 设置文本的水平对对齐方式

            ctxBg = cdomBg.getContext("2d");
            ctxBody = cdomBody.getContext("2d");
            ctxBody.font = "14px 宋体";
            ctxBody.textBaseline = "middle"; // 设置文本的垂直对齐方式
            ctxBody.textAlign = "center"; // 设置文本的水平对对齐方式

            drawer.drawBg(ctxBg!, protocol.data.map, P.w, P.h);
            game.itemGates = protocol.data.map.itemGates;
            game.doors = protocol.data.map.doors;
            game.signs = protocol.data.map.signs;
            const middle = document.getElementById("middle") !;
            middle.innerHTML = "";
            middle.appendChild(cdomBg);
            middle.appendChild(cdom);
            // 初始化尸体
            for (const user of protocol.data.bodies) {
                drawer.drawUser(ctxBody, user, {}, P.h, P.w, P.userWidth, P.userHeight, p1.id);
            }
            $(".joining").show();
        } else if (protocol.kind === "joinSuccess") {
            $(".joining").hide();
        } else if (protocol.kind === "joinFail") {
            alert(protocol.data);
        } else if (protocol.kind === "tick") {
            t++;
            p1.id = protocol.data.p1;
            for (let i = 0; i < protocol.data.users.length; i++) {
                if (protocol.data.users[i].id === p1.id) {
                    p1.data = protocol.data.users[i];
                }
            }

            render(context, protocol.data);

            const controlProtocol: common.ControlProtocol = {
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
            };
            const thisControl = JSON.stringify(controlProtocol);
            if (thisControl !== lastControl) {
                lastControl = thisControl;
                emit({ kind: "control", data: controlProtocol });
            }
            let userCount = 0;
            for (const user of protocol.data.users) {
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
        } else if (protocol.kind === "explode") {
            cdx = 8;
            cdy = 9;
            drawer.lists.push(new Flare(protocol.data, P.h, true));
        } else if (protocol.kind === "userDead") {
            notice(protocol.data.message);
            // p1 dead
            if (protocol.data.user.id === p1.id) {
                setTimeout(() => {
                    $(".joining").show().find("h4").html("你挂了");
                }, 500);
            }
            if (protocol.data.killer) {
                const killer = protocol.data.killer;
                if (killer.score <= 10) {
                    drawer.lists.push(new Toast({
                        x: killer.x,
                        y: killer.y,
                        size: killer.score * 1.5 + 14,
                        txt: killer.name + scoreText[killer.score - 1],
                    }, P.h));
                }
            }
        } else if (protocol.kind === "win") {
            $(".win").css("display", "-webkit-box");
        }
    });
}

function render(ctx: CanvasRenderingContext2D, data: common.TickProtocol) {
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

    for (const mine of data.mines) {
        ctx.drawImage(images.mine, mine.x - 12, P.h - mine.y - 3, 23, 5);
        if (mine.dead) {
            cdx = 3;
            cdy = 11;
            drawer.lists.push(new Flare(mine, P.h));
        }
    }

    for (const user of data.users) {
        if (user.dead === true) {
            drawer.lists.push(new WaterDrops(user, P.h));
            drawer.drawUser(ctxBody, user, {}, P.h, P.w, P.userWidth, P.userHeight, p1.id);
        } else {
            drawer.drawUser(ctx, user, data, P.h, P.w, P.userWidth, P.userHeight, p1.id);
        }
    }

    drawer.drawWater(ctx, 10, "#95a", P.h, P.w, t);

    for (const item of data.items) {
        drawer.drawItem(ctx, item, t, P.h);
        if (item.dead) {
            let itemName = "";
            for (const key in common.items) {
                if ((common.items as any)[key].id === item.id) {
                    itemName = (common.items as any)[key].name;
                }
            }
            drawer.lists.push(new ItemDead(item, itemName, P.h, P.itemSize));
        }
    }

    for (const entity of data.entitys) {
        drawer.drawEntity(ctx, entity, P.h);
    }

    for (let i = drawer.lists.length - 1; i >= 0; i--) {
        const eff = drawer.lists[i];
        if (eff.life < 0) {
            drawer.lists.splice(i, 1);
        } else {
            eff.draw(ctx);
            eff.life--;
        }
    }

    ctx.restore();
}
