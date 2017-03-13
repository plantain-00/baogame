import * as services from "./services";
import * as core from "./core";

export function lay(user: services.user.User) {
    const x = user.x + user.faceing * 40;
    if (services.map.onFloor(x, user.y)) {
        core.mines.push({
            x,
            y: user.y,
            creater: user,
        });
        user.carryCount--;
    }
}
export function check(user: services.user.User) {
    for (let i = core.mines.length - 1; i >= 0; i--) {
        const mine = core.mines[i];
        if (Math.abs(user.x - mine.x) < 10 && Math.abs(user.y - mine.y) < 5) {
            services.user.killed(user, "mine", mine.creater);
            mine.dead = true;
            return true;
        }
    }
    return false;
}
