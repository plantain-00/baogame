import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

export function update(door: common.Door) {
    for (const user of core.users) {
        if (user.name === "王二狗") {
            return;
        }
    }
    const npc = services.game.createNPC({}, "王二狗");
    npc.npc = true;
    npc.x = (door.x + .5) * common.constant.tileWidth;
    npc.y = (door.y + .5) * common.constant.tileHeight;
}
