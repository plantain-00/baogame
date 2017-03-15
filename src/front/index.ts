import { connect, emit } from "./socket";
import * as common from "../back/common";
import * as images from "./images";
import * as flare from "./effects/flare";
import * as toast from "./effects/toast";
import * as waterDrop from "./effects/waterDrops";
import * as itemDead from "./effects/itemDead";
import * as drawer from "./drawer";
import * as libs from "./libs";

/* tslint:disable:no-unused-new */

const isMobile = navigator.userAgent.indexOf("iPhone") > -1
    || navigator.userAgent.indexOf("Android") > -1
    || navigator.userAgent.indexOf("iPad") > -1;

const app: any = new libs.Vue({
    el: "#container",
    data: {
        notices: [],
        userName: localStorage.getItem("userName") || "无名小卒",
        showDialog: false,
        showFail: false,
        showMobileControl: isMobile,
    },
    methods: {
        join(this: libs.App) {
            if (this.userName) {
                localStorage.setItem("userName", this.userName);
            } else {
                localStorage.removeItem("userName");
            }
            emit({
                kind: "join",
                join: {
                    userName: this.userName!,
                },
            });
        },
        close(this: libs.App) {
            this.showDialog = false;
        },
        stopPropagation(e: KeyboardEvent) {
            e.stopPropagation();
        },
        touchstart(e: TouchEvent) {
            const t = (e.target as HTMLElement).dataset.act;
            if (t === "a") {
                if (!control.itemDown) {
                    control.itemPress = true;
                }
                control.itemDown = 20000;
            } else if (t === "l") {
                if (!control.leftDown) {
                    control.leftPress = true;
                }
                control.leftDown = 20000;
            } else if (t === "r") {
                if (!control.rightDown) {
                    control.rightPress = true;
                }
                control.rightDown = 20000;
            } else if (t === "u") {
                if (!control.upDown) {
                    control.upPress = true;
                }
                control.upDown = 20000;
            } else if (t === "d") {
                if (!control.downDown) {
                    control.downPress = true;
                }
                control.downDown = 20000;
            }
        },
        touchend(e: TouchEvent) {
            const t = (e.target as HTMLElement).dataset.act;
            if (t === "a") {
                control.itemDown = 0;
            } else if (t === "l") {
                control.leftDown = 0;
            } else if (t === "r") {
                control.rightDown = 0;
            } else if (t === "u") {
                control.upDown = 0;
            } else if (t === "d") {
                control.downDown = 0;
            }
        },
    },
});

let currentUserId: number;
let currentUser: common.User;

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

let cdomBody: HTMLCanvasElement;
let ctxBody: CanvasRenderingContext2D;
let context: CanvasRenderingContext2D;
let ctxBg;
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

let lastControl: string;

function render(ctx: CanvasRenderingContext2D, protocol: common.TickProtocol) {
    ctx.clearRect(0, 0, common.w, common.h);
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
    drawer.drawWater(ctx, 20, "#758", common.h, common.w, t);

    ctx.drawImage(cdomBody, 0, 0);

    drawer.drawDoors(context, game.doors, common.h);
    drawer.drawSigns(context, game.signs, common.h, currentUser);
    drawer.drawItemGates(context, game.itemGates, common.h);

    for (const mine of protocol.tick.mines) {
        ctx.drawImage(images.mine, mine.x - 12, common.h - mine.y - 3, 23, 5);
        if (mine.dead) {
            cdx = 3;
            cdy = 11;
            drawer.flares.push(flare.create(mine.x, mine.y, 0, common.h));
        }
    }

    for (const user of protocol.tick.users) {
        if (user.dead === true) {
            drawer.waterDrops.push(waterDrop.create(user.x, user.y, user.vy, common.h));
            drawer.drawUser(ctxBody, user, currentUserId, common.h, common.w, common.userWidth, common.userHeight);
        } else {
            drawer.drawUser(ctx, user, currentUserId, common.h, common.w, common.userWidth, common.userHeight);
        }
    }

    drawer.drawWater(ctx, 10, "#95a", common.h, common.w, t);

    for (const item of protocol.tick.items) {
        drawer.drawItem(ctx, item, t, common.h);
        if (item.dead) {
            let itemName = "";
            for (const key in common.items) {
                if ((common.items as any)[key].id === item.id) {
                    itemName = (common.items as any)[key].name;
                }
            }
            drawer.itemDeads.push(itemDead.create(item.x, item.y, itemName, common.h, common.itemSize));
        }
    }

    for (const grenade of protocol.tick.grenades) {
        drawer.drawGrenade(ctx, grenade, common.h);
    }

    drawer.draw(ctx);

    ctx.restore();
}

const control: common.Control = {
    upDown: 0,
    downDown: 0,
    leftDown: 0,
    rightDown: 0,
    itemDown: 0,
    itemPress: false,
    leftPress: false,
    rightPress: false,
    upPress: false,
    downPress: false,
};

document.addEventListener("keydown", e => {
    if (e.keyCode === 87) {
        if (!control.upDown) {
            control.upPress = true;
        }
        control.upDown = 2000;
    } else if (e.keyCode === 83) {
        if (!control.downDown) {
            control.downPress = true;
        }
        control.downDown = 2000;
    } else if (e.keyCode === 65) {
        if (!control.leftDown) {
            control.leftPress = true;
        }
        control.leftDown = 2000;
    } else if (e.keyCode === 68) {
        if (!control.rightDown) {
            control.rightPress = true;
        }
        control.rightDown = 2000;
    } else if (e.keyCode === 81) {
        if (!control.itemDown) {
            control.itemPress = true;
        }
        control.itemDown = 2000;
    }
});
document.addEventListener("keyup", e => {
    if (e.keyCode === 87) {
        control.upDown = 0;
    } else if (e.keyCode === 83) {
        control.downDown = 0;
    } else if (e.keyCode === 65) {
        control.leftDown = 0;
    } else if (e.keyCode === 68) {
        control.rightDown = 0;
    } else if (e.keyCode === 81) {
        control.itemDown = 0;
    }
    if (e.keyCode === 69) {
        if (app.showDialog) {
            app.join();
        }
    }
    e.preventDefault();
});

const middle = document.getElementById("middle")!;
function checkDisplay() {
    if (600 > window.innerHeight) {
        const h = window.innerHeight;
        const w = Math.floor(h / 600 * 1100);
        middle.style.width = `${w}px`;
        middle.style.height = `${h}px`;
    } else {
        middle.style.removeProperty("width");
        middle.style.removeProperty("height");
    }
}

if (isMobile) {
    document.ontouchmove = e => e.preventDefault;
    checkDisplay();
    window.onresize = checkDisplay;
}

connect(protocol => {
    if (protocol.kind === "initSuccess") {
        const cdom = document.createElement("canvas");	// 玩家层
        const cdomBg = document.createElement("canvas");	// 背景层（只绘制一次）
        cdomBody = document.createElement("canvas");	// 标记层（只添加，不修改，尸体）
        cdom.width = common.w;
        cdom.height = common.h;
        cdom.id = "fg";
        cdomBg.width = common.w;
        cdomBg.height = common.h;
        cdomBg.id = "bg";
        cdomBody.width = common.w;
        cdomBody.height = common.h;
        context = cdom.getContext("2d")!;
        context.font = "14px 宋体";
        context.textBaseline = "middle"; // 设置文本的垂直对齐方式
        context.textAlign = "center"; // 设置文本的水平对对齐方式

        ctxBg = cdomBg.getContext("2d");
        ctxBody = cdomBody.getContext("2d")!;
        ctxBody.font = "14px 宋体";
        ctxBody.textBaseline = "middle"; // 设置文本的垂直对齐方式
        ctxBody.textAlign = "center"; // 设置文本的水平对对齐方式

        drawer.drawBg(ctxBg!, protocol.initSuccess.map, common.w, common.h);
        game.itemGates = protocol.initSuccess.map.itemGates;
        game.doors = protocol.initSuccess.map.doors;
        game.signs = protocol.initSuccess.map.signs;
        middle.innerHTML = "";
        middle.appendChild(cdomBg);
        middle.appendChild(cdom);
        app.showDialog = true;
    } else if (protocol.kind === "joinSuccess") {
        currentUserId = protocol.userId;
        app.showDialog = false;
    } else if (protocol.kind === "tick") {
        t++;
        for (let i = 0; i < protocol.tick.users.length; i++) {
            if (protocol.tick.users[i].id === currentUserId) {
                currentUser = protocol.tick.users[i];
                break;
            }
        }

        render(context, protocol);

        const controlProtocol: common.ControlProtocol = {
            kind: "control",
            control,
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
        control.leftPress = false;
        control.rightPress = false;
        control.upPress = false;
        control.downPress = false;
        control.itemPress = false;
    } else if (protocol.kind === "explode") {
        cdx = 8;
        cdy = 9;
        drawer.flares.push(flare.create(protocol.explode.x, protocol.explode.y, protocol.explode.power, common.h, true));
    } else if (protocol.kind === "userDead") {
        app.notices.push(protocol.userDead.message);
        if (protocol.userDead.user.id === currentUserId) {
            setTimeout(() => {
                app.showFail = true;
                app.showDialog = true;
            }, 500);
        }
        if (protocol.userDead.killer) {
            const killer = protocol.userDead.killer;
            if (killer.score <= 10) {
                drawer.toasts.push(toast.create(killer.x, killer.y, killer.score * 1.5 + 14, killer.name + scoreText[killer.score - 1], common.h));
            }
        }
    }
});
