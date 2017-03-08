export interface ItemDead {
    life: number;
    x: number;
    y: number;
    name: string;
    height: number;
    itemSize: number;
}

export function create(x: number, y: number, name: string, height: number, itemSize: number): ItemDead {
    return {
        life: 40,
        x,
        y,
        name,
        height,
        itemSize,
    };
}

export function draw(ctx: CanvasRenderingContext2D, itemDead: ItemDead) {
    ctx.strokeStyle = "rgba(255,255,255," + (itemDead.life) / 40 + ")";
    ctx.beginPath();
    ctx.arc(itemDead.x, itemDead.height - itemDead.y, itemDead.itemSize + (40 - itemDead.life) / 2, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.font = (1600 - itemDead.life * itemDead.life) / 160 + 12 + "px 宋体";
    ctx.fillStyle = "#fff";
    ctx.fillText(itemDead.name, itemDead.x, itemDead.height - itemDead.y);
    ctx.font = "14px 宋体";
}
