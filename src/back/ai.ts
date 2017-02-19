import * as services from "./services";
import * as common from "./common";

function userCanGoLeft(user: services.User, map?: services.Map) {
    const x = Math.floor((user.x - 5) / common.constant.tileWidth);
    const y = Math.floor(user.y / common.constant.tileHeight);
    return user.game.map.floor[y][x];
}
function userCanGoRight(user: services.User, map?: services.Map) {
    const x = Math.floor((user.x + 5) / common.constant.tileWidth);
    const y = Math.floor(user.y / common.constant.tileHeight);
    return user.game.map.floor[y][x];
}
export function playerAI(user: services.User) {
    if (user.status === "standing") {
        if (user.carry === 1) {
            if (user.goleft || !user.goright) {
                user.goleft = true;
                if (userCanGoLeft(user)) {
                    user.leftDown = 200;
                } else {
                    user.goleft = false;
                    user.goright = true;
                    user.leftDown = 0;
                }
            }
            if (user.goright) {
                if (userCanGoRight(user)) {
                    user.rightDown = 200;
                } else {
                    user.goleft = true;
                    user.goright = false;
                    user.rightDown = 0;
                }
            }
        } else if (user.carry === 2) {
            let find = false;
            for (const other of user.game.users) {
                if (user === other || other.dieing) { continue; }
                if (Math.abs(other.y - user.y) < 10 && other.carry !== services.Packs.items.hide.id) {
                    if (user.facing && other.x < user.x || !user.facing && other.x > user.x) {
                        find = true;
                        break;
                    }
                }
            }
            user.itemPress = find;
        }
    }
}
