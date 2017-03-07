import * as services from "./services";
import * as common from "./common";

export function update(game: services.game.Game, door: common.Door) {
    for (const user of game.users) {
        if (user.name === "王二狗") {
            return;
        }
    }
    const npc = services.game.createNPC(game, { name: "王二狗" });
    npc.npc = true;
    npc.x = (door.x + .5) * common.constant.tileWidth;
    npc.y = (door.y + .5) * common.constant.tileHeight;
}
