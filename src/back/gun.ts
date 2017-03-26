import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

export function check(u: services.user.User) {
    const x = u.x;
    const y = u.y + common.userHeight * 2 / 3;
    const f = u.faceing;

    for (const user of core.users) {
        let uh = common.userHeight;
        if (user.crawl) {
            uh /= 2;
        }
        if (f < 0 && x > user.x && user.y <= y && user.y + uh >= y) {
            services.user.killed(user, core.KillReason.gun, u);
            user.vx = 6 * f;
        }

        if (f > 0 && x < user.x && user.y <= y && user.y + uh >= y) {
            services.user.killed(user, core.KillReason.gun, u);
            user.vx = 6 * f;
        }
    }
}
