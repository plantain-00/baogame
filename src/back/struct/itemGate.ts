import * as services from "../services";
import * as common from "../common";

export class ItemGate {
    id: number;
    x: number;
    y: number;
    itemType: any;
    targetItem: services.Item;
    constructor(public game: services.Game, data: any) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.itemType = data.itemType;
    }
    update() {
        if (this.itemType !== undefined) {
            if ((this.game.tick + 120) % 150 === 0 && (!this.targetItem || this.targetItem.dead)) {
                const item = this.game.createItem(this.itemType);
                item.x = (this.x + .5) * common.constant.tileWidth;
                item.y = (this.y + .5) * common.constant.tileHeight;
                item.vx = 0;
                item.vy = 0;
                this.targetItem = item;
            }
        } else {
            // 生成物品（如果需要）
            if (this.game.items.length < this.game.users.length && Math.random() * 100 < this.game.users.length) {
                const item = this.game.createItem();
                item.x = (this.x + .5) * common.constant.tileWidth;
                item.y = (this.y + .5) * common.constant.tileHeight;
            }
        }
    }
    getData() {
        return {
            id: this.id,
            type: "itemGate",
            x: this.x,
            y: this.y,
        };
    }
}
