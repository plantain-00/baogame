import * as services from "./services";
import * as common from "./common";
import * as core from "./core";
import * as libs from "./libs";

let nextId = 0;

export interface User {
    id: number;
    name: string;
    onFloor: number | false;
    onLadder: boolean;
    nearLadder?: common.Ladder;
    dead: boolean;
    rolling: boolean;
    crawl: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
    dieing: boolean;
    faceing: number;
    danger: boolean;
    ignore: any[];
    itemType?: number;
    itemCount: number;
    fireing: number | boolean;
    mining: number | boolean;
    grenadeing: number;
    score: number;
    canDoubleJump: boolean;
    lastTouch?: number;
    rollPoint: number;
    ladder: common.Ladder | undefined;
    doubleJumping: boolean;
    flying: number;
    status: common.userStatus;
    npc: boolean;
    r: number;
    vr: number;
    control: common.Control;
    flypackActive: boolean;
    killer?: number;
    killedBy: core.KillReason | undefined;
    goleft: boolean;
    goright: boolean;
    facing: boolean;
    ws?: libs.WebSocket;
}

export function create(name: string, ws?: libs.WebSocket): User {
    return {
        id: nextId++,
        name,
        onFloor: false,
        onLadder: false,
        dead: false,
        rolling: false,
        crawl: false,
        x: Math.random() * (common.w - 300) + 150,
        y: 380,
        vx: 0,
        vy: 0,
        dieing: false,
        faceing: 1,
        danger: false,
        ignore: [],
        itemCount: 0,
        fireing: 0,
        mining: 0,
        grenadeing: 0,
        score: 0,
        canDoubleJump: false,
        rollPoint: 0,
        control: {
            leftDown: 0,
            rightDown: 0,
            upDown: 0,
            downDown: 0,
            itemDown: 0,
            leftPress: false,
            rightPress: false,
            upPress: false,
            downPress: false,
            itemPress: false,
        },
        ladder: undefined,
        doubleJumping: false,
        flying: 0,
        status: common.userStatus.standing,
        npc: false,
        r: 0,
        vr: 0,
        flypackActive: false,
        killedBy: undefined,
        goleft: false,
        goright: false,
        facing: false,
        ws,
    };
}
export function getStatus(user: User): common.userStatus {
    user.crawl = false;
    if (user.dieing) { return common.userStatus.dieing; }
    if ((user.vy <= 0 || user.onLadder) && services.mine.check(user)) {
        return common.userStatus.dieing;
    }
    if (user.onLadder && user.vx === 0 && user.vy === 0) {
        return common.userStatus.climbing;
    } else {
        const onFloor = services.map.onFloor(user.x, user.y);
        user.onFloor = onFloor;
        user.nearLadder = services.map.nearLadder(user);
        if (onFloor && user.vy <= 0) {
            if (user.rolling) {
                user.rollPoint--;
                if (user.rollPoint <= 0) {
                    user.vx = 0;
                    user.rolling = false;
                } else {
                    user.crawl = true;
                    return common.userStatus.rolling2;
                }
            }
            if (user.danger) {
                if (Math.abs(user.vx) < .2) {
                    user.danger = false;
                    return common.userStatus.standing;
                } else {
                    return common.userStatus.rolling;
                }
            }
            if (typeof user.mining === "number" && user.mining > 0) {
                user.mining--;
                if (user.mining === 0) {
                    services.mine.lay(user);
                } else {
                    return common.userStatus.mining;
                }
            }
            if ((user.control.upDown || user.control.downDown) && user.nearLadder) {
                user.onLadder = true;
                user.onFloor = false;
                user.vx = 0;
                user.ladder = user.nearLadder;
                user.x = user.ladder.x * common.tileWidth;
                return common.userStatus.climbing;
            } else if (user.control.downDown) {
                user.crawl = true;
                if (Math.abs(user.vx) < .2) {
                    return common.userStatus.crawling;
                } else {
                    user.rolling = true;
                    user.rollPoint = 20;
                    if (user.vx > 0) { user.vx += 2; }
                    if (user.vx < 0) { user.vx -= 2; }
                    return common.userStatus.rolling2;
                }
            } else if (user.control.itemPress && user.vx === 0 && user.itemType === common.ItemType.mine && user.itemCount > 0) {
                user.mining = 20;
                return common.userStatus.mining;
            } else {
                user.lastTouch = undefined;
                if (user.itemType === common.ItemType.doublejump) {
                    user.canDoubleJump = true;
                }
                return common.userStatus.standing;
            }
        } else {
            return common.userStatus.falling;
        }
    }
}
export function update(user: User) {
    user.doubleJumping = false;
    user.flying = 0;

    for (const key in user.ignore) {
        user.ignore[key]--;
    }
    // 时限
    if (user.itemType === common.ItemType.power || user.itemType === common.ItemType.hide || user.itemType === common.ItemType.bomb) {
        user.itemCount--;
        if (user.itemCount <= 0) {
            if (user.itemType === common.ItemType.bomb) {
                services.grenade.explode(user.x + user.faceing * 20, user.y + common.userHeight / 2, user, 120);
            }
            user.itemType = undefined;
            user.itemCount = 0;
        }
    }
    user.status = getStatus(user);

    if (user.npc) {
        services.ai.play(user);
    }
    if (user.status === common.userStatus.falling
        || user.status === common.userStatus.standing
        || user.status === common.userStatus.climbing) {
        if (typeof user.fireing === "number" && user.fireing > 0) {
            user.fireing--;
            if (user.fireing === 5) {
                user.itemCount--;
                if (user.itemCount === 0) {
                    user.itemType = undefined;
                }
                services.gun.check(user);
            }
        } else if (user.control.itemPress && user.itemType === common.ItemType.gun && user.itemCount > 0) {
            user.fireing = 25;
        }
    } else {
        user.fireing = 0;
    }

    if (user.status === common.userStatus.falling
        || user.status === common.userStatus.standing
        || user.status === common.userStatus.climbing
        || user.status === common.userStatus.crawling) {
        // grenade
        if (user.grenadeing > 0 && user.control.itemDown) {
            user.grenadeing++;
            user.grenadeing = Math.min(25, user.grenadeing);
        } else if (user.grenadeing > 0 && !user.control.itemDown) {
            services.grenade.throwGrenade(user);
            user.grenadeing = 0;
            user.itemCount--;
            if (user.itemCount === 0) {
                user.itemType = undefined;
            }
        } else if (user.grenadeing === 0 && user.control.itemPress && user.itemType === common.ItemType.grenade && user.itemCount > 0) {
            user.grenadeing = 1;
        }
    } else {
        user.grenadeing = 0;
    }

    if (user.status === common.userStatus.dieing) {
        user.vx *= .98;
        user.vy -= .2;
        user.vy = Math.max(-9, user.vy);
        user.r += user.vr;
        user.vr *= .96;
    }
    if (user.status === common.userStatus.climbing) {
        if (user.control.upDown && !user.control.downDown && user.y < user.ladder!.y2 * common.tileHeight - common.userHeight) {
            user.y += 3;
        } else if (user.control.downDown && !user.control.upDown && user.y > user.ladder!.y1 * common.tileHeight + 3) {
            user.y -= 3;
        }
        if (user.control.leftPress) {
            if (user.faceing !== -1) {
                user.faceing = -1;
            } else {
                user.vx = -2;
                user.onLadder = false;
            }
        } else if (user.control.rightPress) {
            if (user.faceing !== 1) {
                user.faceing = 1;
            } else {
                user.vx = 2;
                user.onLadder = false;
            }
        }
    } else if (user.status === common.userStatus.standing) {
        if (user.control.leftDown && !user.control.rightDown) {
            if (user.vx > 0) {
                if (user.itemType === common.ItemType.power) {
                    user.vx = -.4;
                } else {
                    user.vx = -1;
                }
            } else {
                if (user.itemType === common.ItemType.power) {
                    user.vx -= .08;
                } else {
                    user.vx -= .2;
                }
            }
            user.faceing = -1;
            user.vx = Math.max(user.vx, -4, -user.control.leftDown / 20);
        } else if (!user.control.leftDown && user.control.rightDown) {
            if (user.vx < 0) {
                if (user.itemType === common.ItemType.power) {
                    user.vx = .4;
                } else {
                    user.vx = 1;
                }
            } else {
                if (user.itemType === common.ItemType.power) {
                    user.vx += .08;
                } else {
                    user.vx += .2;
                }
            }
            user.faceing = 1;
            user.vx = Math.min(user.vx, 4, user.control.rightDown / 20);
        } else {
            user.vx = 0;
        }
        if (user.control.upDown > 60 && !user.control.downDown) {
            user.vy = 5;
            user.flypackActive = false;
        } else {
            user.vy = 0;
        }
    } else if (user.status === common.userStatus.rolling2) {
        user.vx *= .96;
    } else if (user.status === common.userStatus.rolling) {
        user.vx *= .9;
    } else if (user.status === common.userStatus.falling) {
        if (user.control.upPress && user.canDoubleJump) {
            user.doubleJumping = true;
            user.canDoubleJump = false;
            user.vy = 5;
        }
        if (user.control.upPress && user.itemType === common.ItemType.flypack) {
            user.flypackActive = true;
        }
        if (user.control.upDown && user.itemType === common.ItemType.flypack && user.itemCount > 0 && user.flypackActive) {
            user.vy += .3;
            user.flying += 1;
            user.itemCount--;
        }
        if (user.control.leftPress && user.faceing === 1) {
            user.faceing = -1;
        }
        if (user.control.rightPress && user.faceing === -1) {
            user.faceing = 1;
        }
        if (user.control.leftDown && user.itemType === common.ItemType.flypack && user.itemCount > 0) {
            user.vx -= .15;
            user.flying += 2;
            user.itemCount -= .2;
        }
        if (user.control.rightDown && user.itemType === common.ItemType.flypack && user.itemCount > 0) {
            user.vx += .15;
            user.flying += 4;
            user.itemCount -= .2;
        }
        user.vy -= .2;
        user.vy = Math.max(-9, user.vy);
        user.vy = Math.min(10, user.vy);
        user.vx = Math.max(-8, user.vx);
        user.vx = Math.min(8, user.vx);
        if (user.vy === -9) {
            user.danger = true;
        }
    } else if (user.status === common.userStatus.crawling) {
        user.vx = 0;
    }

    // final process
    user.x += user.vx;
    if (user.x <= 0) { user.vx = Math.abs(user.vx); }
    if (user.x >= common.w) { user.vx = -Math.abs(user.vx); }
    if (user.y < 0) {
        user.dead = true;
        if (!user.dieing) {
            killed(user, "fall");
        }
    } else {
        if (user.vy > 0) {
            user.y += Math.floor(user.vy);
        } else {
            for (let i = 0; i < -user.vy; i++) {
                user.y--;
                if (!user.dieing && services.map.onFloor(user.x, user.y)) {
                    user.vy = 0;
                    break;
                }
            }
        }
    }
}
export function killed(user: User, action: core.KillReason, byUser?: User) {
    if (user.dieing) {
        return;
    }
    if (byUser) {
        user.killer = byUser.id;
    }

    user.killedBy = action;

    if (action === "power") {
        user.vy = 10;
    } else if (action === "drug") {
        user.vy = 3;
        user.killer = user.lastTouch;
    } else if (action === "gun") {
        user.vy = 1;
    } else if (action === "mine") {
        user.vy = 10;
    } else if (action === "bomb") {
        // todo
    } else {
        user.killer = user.lastTouch;
    }

    let killer: User | undefined;
    if (user.killer && user.killer !== user.id) {
        killer = core.users.find(u => u.id === user.killer);
        if (killer) {
            killer.score++;
        }
    }

    core.announce({
        kind: "userDead",
        userDead: {
            user: getData(user),
            killer: killer ? getData(killer) : undefined,
        },
    });
}
export function getData(user: User): common.User {
    return {
        itemType: user.itemType,
        itemCount: user.itemCount,
        nearLadder: user.nearLadder,
        faceing: user.faceing,
        fireing: user.fireing as number,
        grenadeing: user.grenadeing,
        danger: user.danger,
        status: user.status,
        name: user.name,
        id: user.id,
        x: Math.round(user.x),
        y: user.y,
        vy: user.vy,
        score: user.score,
        dead: user.dead,
        npc: user.npc,
        doubleJumping: user.doubleJumping,
        flying: user.flying,
    };
}

export function collide(a: services.user.User, b: services.user.User) {
    if (a.dead || b.dead) {
        return;
    }
    if ((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) > common.userWidth * common.userWidth) {
        return;
    }

    if (a.itemType === common.ItemType.power && b.itemType !== common.ItemType.power) {
        services.user.killed(b, "power", a);
        b.vx = (b.x - a.x) / 2;
        if (b.itemType === common.ItemType.bomb) {
            a.itemType = b.itemType;
            a.itemCount = b.itemCount;
            b.itemType = undefined;
        }
        return;
    } else if (a.itemType !== common.ItemType.power && b.itemType === common.ItemType.power) {
        services.user.killed(a, "power", b);
        a.vx = (a.x - b.x) / 2;
        if (a.itemType === common.ItemType.bomb) {
            b.itemType = a.itemType;
            b.itemCount = a.itemCount;
            a.itemType = undefined;
        }
        return;
    } else if (a.itemType === common.ItemType.power && b.itemType === common.ItemType.power) {
        a.itemType = undefined;
        b.itemType = undefined;
    }
    // 排除刚刚碰撞
    if (a.ignore[b.id] > 0 || b.ignore[a.id] > 0) { return; }

    if (b.itemType === common.ItemType.bomb && a.itemType !== common.ItemType.bomb) {
        a.itemType = b.itemType;
        a.itemCount = b.itemCount;
        b.itemType = undefined;
    } else if (a.itemType === common.ItemType.bomb && b.itemType !== common.ItemType.bomb) {
        b.itemType = a.itemType;
        b.itemCount = a.itemCount;
        a.itemType = undefined;
    }
    // 正常情况
    if (a.onFloor && b.onFloor) {
        if (a.crawl && !b.crawl) {
            b.vy = 5;
            b.danger = true;
        } else if (!a.crawl && b.crawl) {
            a.vy = 5;
            a.danger = true;
        } else {
            if (a.crawl && b.crawl) {
                a.crawl = false;
                b.crawl = false;
            }
            const tmp = a.vx;
            a.vx = b.vx;
            b.vx = tmp;

            a.vy = 2.5;
            b.vy = 2.5;
        }
    } else if (a.onFloor && !b.onFloor) {
        if (a.crawl) {
            a.vx = b.vx / 2;
            b.vx = -b.vx / 2;
            a.vy = 2.5;
            b.vy = 2.5;
        } else {
            a.vx = b.vx;
            b.vx /= 2;
            a.vy = 2.5;
            a.danger = true;
        }
    } else if (!a.onFloor && b.onFloor) {
        if (b.crawl) {
            b.vx = a.vx / 2;
            a.vx = -a.vx / 2;
            b.vy = 2.5;
            a.vy = 2.5;
        } else {
            b.vx = a.vx;
            a.vx /= 2;
            b.vy = 2.5;
            b.danger = true;
        }
    } else {
        const tmp = a.vx;
        a.vx = b.vx;
        b.vx = tmp;
        a.danger = true;
        b.danger = true;
    }
    // 自然抗拒
    if (a.x < b.x) {
        if (!a.crawl) {
            a.vx -= 1;
        }
        if (!b.crawl) {
            b.vx += 1;
        }
    } else {
        if (!a.crawl) {
            a.vx += 1;
        }
        if (!b.crawl) {
            b.vx -= 1;
        }
    }
    // 阻止近期碰撞
    a.ignore[b.id] = 40;
    b.ignore[a.id] = 40;
    a.fireing = false;
    b.fireing = false;
    a.mining = false;
    b.mining = false;
    a.onLadder = false;
    b.onLadder = false;
    a.lastTouch = b.id;
    b.lastTouch = a.id;
}

export function createUser(name: string, ws?: libs.WebSocket) {
    const u = services.user.create(name, ws);
    const { x, y } = services.map.born();
    u.x = x;
    u.y = y + common.tileHeight / 2;
    return u;
}
