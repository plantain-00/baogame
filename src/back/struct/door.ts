import * as services from "../services";
import * as common from "../common";

export class Door {
    id: number;
    x: number;
    y: number;
    constructor(public game: services.Game, data: any) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
    }
    update() {
        for (const user of this.game.users) {
            if (user.name === "王二狗") {
                return;
            }
        }
        const npc = this.game.createNPC({ name: "王二狗" });
        npc.npc = true;
        npc.x = (this.x + .5) * common.constant.tileWidth;
        npc.y = (this.y + .5) * common.constant.tileHeight;
    }
    getData() {
        return {
            id: this.id,
            type: "door",
            x: this.x,
            y: this.y,
        };
    }
}
