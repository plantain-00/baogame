import * as common from "../back/common";
import * as images from "./images";
import { Flare } from "./effects/flare";
import { Toast } from "./effects/toast";
import { Brust } from "./effects/brust";
import { WaterDrops } from "./effects/waterDrops";
import { ItemDead } from "./effects/itemDead";
import { ShotLine } from "./effects/shotLine";

export let lists: (Flare | Toast | Brust | WaterDrops | ItemDead | ItemDead | ShotLine)[] = [];

// 绘制背景
export function drawBg(ctx: CanvasRenderingContext2D, map: common.MapData, width: number, height: number) {
    ctx.clearRect(0, 0, width, height);
    // 绘制柱子
    for (const ladder of map.ladders) {
        ctx.fillStyle = "#888";
        for (let j = height - ladder.y2 * common.constant.tileHeight + 10; j < height - ladder.y1 * common.constant.tileHeight; j += 20) {
            ctx.fillRect(ladder.x * common.constant.tileWidth - 10, j, 20, 4);
        }

        ctx.fillStyle = "#aaa";
        ctx.beginPath();
        ctx.rect(ladder.x * common.constant.tileHeight - 12, height - ladder.y2 * common.constant.tileHeight, 4, (ladder.y2 - ladder.y1) * common.constant.tileHeight);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ladder.x * common.constant.tileWidth - 10, height - ladder.y2 * common.constant.tileHeight - 4, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.rect(ladder.x * common.constant.tileWidth + 8, height - ladder.y2 * common.constant.tileHeight, 4, (ladder.y2 - ladder.y1) * common.constant.tileHeight);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ladder.x * common.constant.tileWidth + 10, height - ladder.y2 * common.constant.tileHeight - 4, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    // 绘制地板
    for (let i = 0; i < map.floor.length; i++) {
        for (let j = 0; j < map.floor[i].length; j++) {
            const x = j * common.constant.tileWidth;
            const y = height - (i) * common.constant.tileHeight;
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

export function drawSigns(ctx: CanvasRenderingContext2D, signs: common.Sign[], height: number, p1Data: common.User | undefined) {
    ctx.fillStyle = "#fff";
    ctx.font = "20px 宋体";
    for (const sign of signs) {
        ctx.drawImage(images.sign, sign.x * common.constant.tileWidth, height - (sign.y + 1) * common.constant.tileHeight, common.constant.tileWidth, common.constant.tileHeight);
    }
    if (p1Data) {
        const ux = Math.floor(p1Data.x / common.constant.tileWidth);
        const uy = Math.floor(p1Data.y / common.constant.tileHeight);
        for (const sign of signs) {
            if (ux === sign.x && uy === sign.y) {
                ctx.fillText(sign.message, sign.x * common.constant.tileWidth, height - (sign.y + 1) * common.constant.tileHeight - 30);
                break;
            }
        }
    }
    ctx.font = "14px 宋体";
}

export function drawDoors(ctx: CanvasRenderingContext2D, doors: common.Door[], height: number) {
    ctx.fillStyle = "#fff";
    ctx.font = "20px 宋体";
    for (const door of doors) {
        ctx.drawImage(images.door, door.x * common.constant.tileWidth, height - (door.y + 1) * common.constant.tileHeight, common.constant.tileWidth, common.constant.tileHeight);
    }
    ctx.font = "14px 宋体";
}

export function drawItemGates(ctx: CanvasRenderingContext2D, itemGates: common.ItemGate[], height: number) {
    ctx.fillStyle = "#fff";
    ctx.font = "20px 宋体";
    for (const itemGate of itemGates) {
        ctx.drawImage(images.itemGate, itemGate.x * common.constant.tileWidth, height - (itemGate.y + 1) * common.constant.tileHeight, common.constant.tileWidth, common.constant.tileHeight);
    }
    ctx.font = "14px 宋体";
}

export function drawWater(ctx: CanvasRenderingContext2D, waterHeight: number, color: string, height: number, width: number, t: number) {
    const waveLen = 20;
    let waveHeight = waterHeight / 5;
    const c = waveLen / 2;
    const b = height - waterHeight;
    const offset = Math.sin(t / 50 + waterHeight) * 10;
    let start = offset - 10;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(start, height);
    ctx.lineTo(start, height - waterHeight);
    while (start < width) {
        ctx.bezierCurveTo(start + c, b + waveHeight, start + waveLen - c, b + waveHeight, start + waveLen, b);
        start += waveLen;
        waveHeight *= -1;
    }
    ctx.lineTo(width, height);
    ctx.fill();
}

export function drawWeapon(ctx: CanvasRenderingContext2D, index: number) {
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

export function drawUser(ctx: CanvasRenderingContext2D, user: common.User, p1Id: number | undefined | null, height: number, width: number, userWidth: number, userHeight: number, p1id: number | null | undefined) {
    if (user.doubleJumping) {
        lists.push(new Brust(user.x, user.y, 10, 40, height));
    }

    ctx.save();
    let img;
    ctx.translate(user.x, height - user.y);
    if (user.dead) {
        img = images.alone;
    } else if (user.status === "dieing") {
        img = images.alone;
    } else if (user.carry === common.items.power.id) {
        img = images.win;
    } else if (user.danger) {
        img = images.danger;
    } else if (user.status === "crawling" || user.status === "mining" || user.status === "rolling2") {
        img = images.throll;
    } else if (user.carry === common.items.bomb.id) {
        img = images.wtf;
    } else if (user.status === "falling" || user.status === "climbing") {
        img = images.happy;
    } else {
        img = images.normal;
    }

    if (user.id === p1Id) {
        ctx.fillStyle = "#ffa";
    } else {
        ctx.fillStyle = "#f77";
    }

    // 用户指示器
    if (user.carry !== common.items.hide.id || user.id === p1id) {
        ctx.fillText(user.name, 0, -50);
        if (user.nearLadder && user.id === p1id) {
            ctx.fillText("上", 0, -70);
        }
    }

    ctx.scale(user.faceing, 1);

    if (user.fireing) {
        if (user.fireing === 5) {
            lists.push(new ShotLine(user.x, user.y + 25, user.faceing, height, width));
        }
        ctx.save();
        ctx.translate(0, -userWidth / 2);
        drawWeapon(ctx, 25 - user.fireing);
        ctx.restore();
    }

    if (user.carry === common.items.hide.id) {
        ctx.globalAlpha = user.carryCount > 900 ? (user.carryCount - 900) / 100 : user.carryCount > 100 ? 0 : (100 - user.carryCount) / 100;
    }

    if (user.status === "crawling" || user.status === "mining" || user.status === "rolling2") {
        ctx.drawImage(img, -userWidth / 2, -25, userWidth, userHeight);
    } else {
        ctx.drawImage(img, -userWidth / 2, -userHeight, userWidth, userHeight);
    }
    if (user.carry === common.items.flypack.id) {
        const bottleWidth = 10;
        const bottleHeight = 30;
        const wPadding = -userWidth / 2 - bottleWidth;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.fillStyle = "rgb(100,160,255)";
        ctx.fillRect(wPadding, -bottleHeight * user.carryCount / common.items.flypack.count, bottleWidth, bottleHeight * user.carryCount / common.items.flypack.count);
        ctx.stroke();

        ctx.drawImage(images.jet, wPadding - 16, -bottleHeight - 10, 40, bottleHeight + 20);
        if (user.flying) {
            lists.push(new Brust(user.x, user.y, 1, 5, height, user.faceing * (wPadding + bottleWidth / 2), -10));
        }
    }
    if (user.carry === common.items.bomb.id) {
        ctx.drawImage(images.bomb, userWidth / 2 - 10, -userHeight, 30, 40);
        if (!user.dead) {
            ctx.scale(user.faceing, 1);
            const x = user.faceing * (userWidth / 2 + 10);
            ctx.font = "28px 宋体";
            ctx.fillStyle = "#ff0";
            ctx.fillText((Math.floor(user.carryCount * 17 / 1000) + 1).toString(), x, -userHeight - 10);
            ctx.font = "14px 宋体";
            ctx.scale(user.faceing, 1);
        }
    }
    if (user.grenadeing > 0) {
        ctx.save();

        ctx.translate(-10, -20);
        ctx.rotate((25 - user.grenadeing) / 10);
        ctx.translate(-40, -userHeight / 2);

        ctx.drawImage(images.arm, 0, 0, 40, 40);
        ctx.drawImage(images.grenade, -10, -13, 30, 40);
        ctx.restore();
    }
    ctx.restore();
}

export function drawItem(ctx: CanvasRenderingContext2D, item: common.Item, t: number, height: number) {
    const s = common.constant.itemSize;
    ctx.strokeStyle = "rgba(255,255,255," + Math.abs((t % 300) / 150 - 1) + ")";
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(item.x, height - item.y);
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.drawImage(images.items[item.id - 1], -s, -s, s * 2, s * 2);
    ctx.restore();
}

export function drawEntity(ctx: CanvasRenderingContext2D, entity: common.Entity, height: number) {
    const w = 15;
    const h = 18;
    ctx.save();
    ctx.translate(entity.x, height - entity.y);
    ctx.rotate(entity.r / 10);
    ctx.drawImage(images.grenade, -w, -h, w * 2, h * 2);
    ctx.restore();
}
