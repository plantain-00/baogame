import * as common from "../back/common";
import * as images from "./images";
import * as flare from "./effects/flare";
import * as toast from "./effects/toast";
import * as waterDrop from "./effects/waterDrops";
import * as itemDead from "./effects/itemDead";
import * as drawer from "./drawer";
import * as libs from "./libs";
import * as locales from "./locales";
import * as format from "./format";

const isMobile = navigator.userAgent.indexOf("iPhone") > -1
    || navigator.userAgent.indexOf("Android") > -1
    || navigator.userAgent.indexOf("iPad") > -1;

const app: any = new libs.Vue({
    el: "#container",
    data: {
        userName: localStorage.getItem("userName") || locales.locale.ui.noOne,
        showDialog: false,
        showFail: false,
        showMobileControl: isMobile,
        ui: locales.locale.ui,
    },
    methods: {
        join(this: libs.App) {
            if (this.userName) {
                localStorage.setItem("userName", this.userName);
            } else {
                localStorage.removeItem("userName");
            }
            emit({
                kind: common.ProtocolKind.join,
                join: {
                    userName: this.userName!,
                },
            });
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

const fg = document.getElementById("fg") as HTMLCanvasElement;
fg.width = common.w;
fg.height = common.h;
const context = fg.getContext("2d")!;
context.font = "14px 宋体";
context.textBaseline = "middle";
context.textAlign = "center";

const bg = document.getElementById("bg") as HTMLCanvasElement;
bg.width = common.w;
bg.height = common.h;
const ctxBg = bg.getContext("2d")!;

let t = 0;
let cdx = 0;
let cdy = 0;
const game: {
    doors: common.Door[],
    itemGates: common.ItemGate[],
} = {
        doors: [],
        itemGates: [],
    };

let lastControl: string;

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

let ws: WebSocket | undefined;
let debug = false;

function emit(protocol: common.Protocol) {
    if (!ws) {
        return;
    }
    ws.send(format.encode(protocol, debug));
}

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

const urlProtocol = location.protocol === "https:" ? "wss:" : "ws:";
const reconnector = new libs.Reconnector(() => {
    ws = new WebSocket(`${urlProtocol}//${location.host}/ws/`);
    ws.binaryType = "arraybuffer";
    ws.onmessage = evt => {
        debug = typeof evt.data === "string";
        const protocol = format.decode(evt.data);
        if (protocol.kind === common.ProtocolKind.initSuccess) {
            drawer.drawBg(ctxBg, protocol.initSuccess.map, common.w, common.h);
            game.itemGates = protocol.initSuccess.map.itemGates || [];
            game.doors = protocol.initSuccess.map.doors || [];
            app.showDialog = true;
        } else if (protocol.kind === common.ProtocolKind.joinSuccess) {
            currentUserId = protocol.joinSuccess.userId;
            app.showDialog = false;
        } else if (protocol.kind === common.ProtocolKind.tick) {
            t++;
            if (protocol.tick.users) {
                for (let i = 0; i < protocol.tick.users.length; i++) {
                    if (protocol.tick.users[i].id === currentUserId) {
                        currentUser = protocol.tick.users[i];
                        break;
                    }
                }
            }

            context.clearRect(0, 0, common.w, common.h);
            context.save();
            context.translate(cdx, cdy);
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
            drawer.drawWater(context, 20, "#758", common.h, common.w, t);

            drawer.drawDoors(context, game.doors, common.h);
            drawer.drawItemGates(context, game.itemGates, common.h);

            if (protocol.tick.mines) {
                for (const mine of protocol.tick.mines) {
                    context.drawImage(images.mine, mine.x - 12, common.h - mine.y - 3, 23, 5);
                    if (mine.dead) {
                        cdx = 3;
                        cdy = 11;
                        drawer.flares.push(flare.create(mine.x, mine.y, 0, common.h));
                    }
                }
            }

            if (protocol.tick.users) {
                for (const user of protocol.tick.users) {
                    if (user.dead === true) {
                        drawer.waterDrops.push(waterDrop.create(user.x, user.y, user.vy, common.h));
                    } else {
                        drawer.drawUser(context, user, currentUserId, common.h, common.w, common.userWidth, common.userHeight);
                    }
                }
            }

            drawer.drawWater(context, 10, "#95a", common.h, common.w, t);

            if (protocol.tick.items) {
                for (const item of protocol.tick.items) {
                    drawer.drawItem(context, item, t, common.h);
                    if (item.dead) {
                        const itemName = locales.locale.item[item.type];
                        drawer.itemDeads.push(itemDead.create(item.x, item.y, itemName, common.h, common.itemSize));
                    }
                }
            }

            if (protocol.tick.grenades) {
                for (const grenade of protocol.tick.grenades) {
                    drawer.drawGrenade(context, grenade, common.h);
                }
            }

            drawer.draw(context);

            context.restore();

            const controlProtocol: common.ControlProtocol = {
                kind: common.ProtocolKind.control,
                control,
            };
            const thisControl = JSON.stringify(controlProtocol);
            if (thisControl !== lastControl) {
                lastControl = thisControl;
                emit(controlProtocol);
            }
            control.leftPress = false;
            control.rightPress = false;
            control.upPress = false;
            control.downPress = false;
            control.itemPress = false;
        } else if (protocol.kind === common.ProtocolKind.explode) {
            cdx = 8;
            cdy = 9;
            drawer.flares.push(flare.create(protocol.explode.x, protocol.explode.y, protocol.explode.power, common.h, true));
        } else if (protocol.kind === common.ProtocolKind.userDead) {
            if (protocol.userDead.user.id === currentUserId) {
                setTimeout(() => {
                    app.showFail = true;
                    app.showDialog = true;
                }, 500);
            }
            if (protocol.userDead.killer) {
                const killer = protocol.userDead.killer;
                if (killer.score >= 3) {
                    drawer.toasts.push(toast.create(killer.x, killer.y, killer.score * 1.5 + 14, killer.name + locales.getScoreText(killer.score), common.h));
                }
            }
        }
    };
    ws.onclose = () => {
        reconnector.reconnect();
    };
    ws.onopen = () => {
        reconnector.reset();
    };
});
