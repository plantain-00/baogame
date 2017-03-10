import * as services from "./services";
import * as common from "./common";
import * as core from "./core";

let userCount = 0;

export interface User {
    id: number;
    name: string;
    onFloor: number | false;
    onLadder: boolean;
    nearLadder: boolean | common.Ladder;
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
    carry: number;
    carryCount: number;
    fireing: number | boolean;
    mining: number | boolean;
    grenadeing: number;
    score: number;
    canDoubleJump: boolean;
    lastTouch: number | null;
    rollPoint: number;
    downDown: number;
    ladder: common.Ladder | undefined;
    itemPress: boolean;
    doubleJumping: boolean;
    flying: number;
    status: common.userStatus;
    npc: boolean;
    AI: string;
    itemDown: number;
    r: number;
    vr: number;
    leftPress: boolean;
    rightPress: boolean;
    upPress: boolean;
    downPress: boolean;
    leftDown: number;
    rightDown: number;
    upDown: number;
    flypackActive: boolean;
    killer: number | null;
    killedBy: core.KillReason | undefined;
    goleft: boolean;
    goright: boolean;
    facing: boolean;
    client: core.Client;
}

export function create(client: core.Client): User {
    return {
        id: userCount++,
        name: client.name,
        onFloor: false,
        onLadder: false,
        nearLadder: false,
        dead: false,
        rolling: false,
        crawl: false,
        x: Math.random() * (core.currentGame.props.w - 300) + 150,
        y: 380,
        vx: 0,
        vy: 0,
        dieing: false,
        faceing: 1,
        danger: false,
        ignore: [],
        carry: 0,
        carryCount: 0,
        fireing: 0,
        mining: 0,
        grenadeing: 0,
        score: 0,
        canDoubleJump: false,
        lastTouch: null,
        rollPoint: 0,
        downDown: 0,
        ladder: undefined,
        itemPress: false,
        doubleJumping: false,
        flying: 0,
        status: "standing",
        npc: false,
        AI: "",
        itemDown: 0,
        r: 0,
        vr: 0,
        leftPress: false,
        rightPress: false,
        upPress: false,
        downPress: false,
        leftDown: 0,
        rightDown: 0,
        upDown: 0,
        flypackActive: false,
        killer: null,
        killedBy: undefined,
        goleft: false,
        goright: false,
        facing: false,
        client,
    };
}
export function throwGrenade(user: User) {
    const g = services.grenade.create(user);
    const vx = user.faceing * (15 + user.grenadeing) / 5;
    let vy = user.grenadeing / 3;

    if (user.crawl) {
        vy = 0;
    }

    g.x = user.x - user.faceing * 20;
    g.y = user.y + core.currentGame.props.userHeight;
    g.vx = user.vx + vx;
    g.vy = user.vy + vy;

    core.currentGame.entitys.push(g);
}
export function getStatus(user: User): common.userStatus {
    user.crawl = false;
    if (user.dieing) { return "dieing"; }
    if ((user.vy <= 0 || user.onLadder) && services.game.checkMine(user)) {
        return "dieing";
    }
    if (user.onLadder && user.vx === 0 && user.vy === 0) {
        return "climbing";
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
                    return "rolling2";
                }
            }
            if (user.danger) {
                if (Math.abs(user.vx) < .2) {
                    user.danger = false;
                    return "standing";
                } else {
                    return "rolling";
                }
            }
            if (typeof user.mining === "number" && user.mining > 0) {
                user.mining--;
                if (user.mining === 0) {
                    if (services.game.addMine(user)) {
                        user.carryCount--;
                    }
                } else {
                    return "mining";
                }
            }
            if ((user.upDown || user.downDown) && user.nearLadder) {
                user.onLadder = true;
                user.onFloor = false;
                user.vx = 0;
                user.ladder = user.nearLadder;
                user.x = user.ladder.x * common.constant.tileWidth;
                return "climbing";
            } else if (user.downDown) {
                user.crawl = true;
                if (Math.abs(user.vx) < .2) {
                    return "crawling";
                } else {
                    user.rolling = true;
                    user.rollPoint = 20;
                    if (user.vx > 0) { user.vx += 2; }
                    if (user.vx < 0) { user.vx -= 2; }
                    return "rolling2";
                }
            } else if (user.itemPress && user.vx === 0 && user.carry === common.items.mine.id && user.carryCount > 0) {
                user.mining = 20;
                return "mining";
            } else {
                user.lastTouch = null;
                if (user.carry === common.items.doublejump.id) {
                    user.canDoubleJump = true;
                }
                return "standing";
            }
        } else {
            return "falling";
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
    if (user.carry === common.items.power.id || user.carry === common.items.hide.id || user.carry === common.items.bomb.id) {
        user.carryCount--;
        if (user.carryCount <= 0) {
            if (user.carry === common.items.bomb.id) {
                services.game.explode(user.x + user.faceing * 20, user.y + core.currentGame.props.userHeight / 2, user, 120);
            }
            user.carry = 0;
            user.carryCount = 0;
        }
    }
    user.status = getStatus(user);

    if (user.npc && user.AI) {
        services.playerAI(user);
    }
    if (user.status === "falling" || user.status === "standing" || user.status === "climbing") {
        // 开枪
        if (typeof user.fireing === "number" && user.fireing > 0) {
            user.fireing--;
            if (user.fireing === 5) {
                user.carryCount--;
                if (user.carryCount === 0) {
                    user.carry = 0;
                }
                services.game.checkShot(user);
            }
        } else if (user.itemPress && user.carry === common.items.gun.id && user.carryCount > 0) {
            user.fireing = 25;
        }
    } else {
        user.fireing = 0;
    }

    if (user.status === "falling" || user.status === "standing" || user.status === "climbing" || user.status === "crawling") {
        // grenade
        if (user.grenadeing > 0 && user.itemDown) {
            user.grenadeing++;
            user.grenadeing = Math.min(25, user.grenadeing);
        } else if (user.grenadeing > 0 && !user.itemDown) {
            throwGrenade(user);
            user.grenadeing = 0;
            user.carryCount--;
            if (user.carryCount === 0) {
                user.carry = 0;
            }
        } else if (user.grenadeing === 0 && user.itemPress && user.carry === common.items.grenade.id && user.carryCount > 0) {
            user.grenadeing = 1;
        }
    } else {
        user.grenadeing = 0;
    }

    if (user.status === "dieing") {
        user.vx *= .98;
        user.vy -= .2;
        user.vy = Math.max(-9, user.vy);
        user.r += user.vr;
        user.vr *= .96;
    }
    if (user.status === "climbing") {
        if (user.upDown && !user.downDown && user.y < user.ladder!.y2 * common.constant.tileHeight - core.currentGame.props.userHeight) {
            user.y += 3;
        } else if (user.downDown && !user.upDown && user.y > user.ladder!.y1 * common.constant.tileHeight + 3) {
            user.y -= 3;
        }
        if (user.leftPress) {
            if (user.faceing !== -1) {
                user.faceing = -1;
            } else {
                user.vx = -2;
                user.onLadder = false;
            }
        } else if (user.rightPress) {
            if (user.faceing !== 1) {
                user.faceing = 1;
            } else {
                user.vx = 2;
                user.onLadder = false;
            }
        }
    } else if (user.status === "standing") {
        if (user.leftDown && !user.rightDown) {
            if (user.vx > 0) {
                if (user.carry === common.items.power.id) {
                    user.vx = -.4;
                } else {
                    user.vx = -1;
                }
            } else {
                if (user.carry === common.items.power.id) {
                    user.vx -= .08;
                } else {
                    user.vx -= .2;
                }
            }
            user.faceing = -1;
            user.vx = Math.max(user.vx, -4, -user.leftDown / 20);
        } else if (!user.leftDown && user.rightDown) {
            if (user.vx < 0) {
                if (user.carry === common.items.power.id) {
                    user.vx = .4;
                } else {
                    user.vx = 1;
                }
            } else {
                if (user.carry === common.items.power.id) {
                    user.vx += .08;
                } else {
                    user.vx += .2;
                }
            }
            user.faceing = 1;
            user.vx = Math.min(user.vx, 4, user.rightDown / 20);
        } else {
            user.vx = 0;
        }
        if (user.upDown > 60 && !user.downDown) {
            user.vy = 5;
            user.flypackActive = false;
        } else {
            user.vy = 0;
        }
    } else if (user.status === "rolling2") {
        user.vx *= .96;
    } else if (user.status === "rolling") {
        user.vx *= .9;
    } else if (user.status === "falling") {
        if (user.upPress && user.canDoubleJump) {
            user.doubleJumping = true;
            user.canDoubleJump = false;
            user.vy = 5;
        }
        if (user.upPress && user.carry === common.items.flypack.id) {
            user.flypackActive = true;
        }
        if (user.upDown && user.carry === common.items.flypack.id && user.carryCount > 0 && user.flypackActive) {
            user.vy += .3;
            user.flying += 1;
            user.carryCount--;
        }
        if (user.leftPress && user.faceing === 1) {
            user.faceing = -1;
        }
        if (user.rightPress && user.faceing === -1) {
            user.faceing = 1;
        }
        if (user.leftDown && user.carry === common.items.flypack.id && user.carryCount > 0) {
            user.vx -= .15;
            user.flying += 2;
            user.carryCount -= .2;
        }
        if (user.rightDown && user.carry === common.items.flypack.id && user.carryCount > 0) {
            user.vx += .15;
            user.flying += 4;
            user.carryCount -= .2;
        }
        user.vy -= .2;
        user.vy = Math.max(-9, user.vy);
        user.vy = Math.min(10, user.vy);
        user.vx = Math.max(-8, user.vx);
        user.vx = Math.min(8, user.vx);
        if (user.vy === -9) {
            user.danger = true;
        }
    } else if (user.status === "crawling") {
        user.vx = 0;
    }

    // final process
    user.x += user.vx;
    if (user.x <= 0) { user.vx = Math.abs(user.vx); }
    if (user.x >= core.currentGame.props.w) { user.vx = -Math.abs(user.vx); }
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
export function scoreing(user: User) {
    user.score++;
    user.client.kill++;
    if (user.score > user.client.highestKill) {
        user.client.highestKill = user.score;
    }
    if (core.currentMap.onKilled) {
        core.currentMap.onKilled(user);
    }
}
export function killed(user: User, action: core.KillReason, byUser?: User) {
    if (user.dieing) { return; }
    if (byUser) {
        user.killer = byUser.id;
    }

    user.killedBy = action;
    user.client.death++;

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

    if (core.currentMap.onKilled) {
        core.currentMap.onKilled(user);
    }
    let killer: User | undefined;
    if (user.killer && user.killer !== user.id) {
        killer = services.game.getUser(user.killer);
        if (killer) {
            scoreing(killer);
        }
    }

    let message: string | undefined;
    if (killer) {
        if (action === "drug") {
            message = "<b>" + killer.name + "</b>让<b>" + user.name + "</b>品尝到了毒药的滋味";
        } else if (action === "mine") {
            if (user.killer === user.id) {
                message = "<b>" + killer.name + "</b>用自己的身体检验了地雷的可靠性，结果很成功";
            } else {
                message = "<b>" + killer.name + "</b>的地雷让<b>" + user.name + "</b>的菊花一紧";
            }
        } else if (action === "gun") {
            message = "<b>" + killer.name + "</b>开枪了，<b>" + user.name + "</b>应声倒地";
        } else if (action === "power") {
            message = "<b>" + killer.name + "</b>把<b>" + user.name + "</b>扔进了泥潭";
        } else if (action === "bomb") {
            message = "<b>" + user.name + "</b>没能从爆炸中逃生";
        } else {
            message = "<b>" + killer.name + "</b>把<b>" + user.name + "</b>扔进了泥潭";
        }
    } else {
        if (action === "drug") {
            message = "<b>" + user.name + "</b>尝了一口毒药";
        } else {
            message = "<b>" + user.name + "</b>完成了华丽的一跃";
        }
    }

    services.game.announce({
        kind: "userDead",
        userDead: {
            user: getData(user),
            killer: killer ? getData(killer) : undefined,
            message,
        },
    });
}
export function getData(user: User): common.User {
    return {
        carry: user.carry,
        carryCount: user.carryCount,
        nearLadder: user.nearLadder as boolean,
        faceing: user.faceing,
        fireing: user.fireing as number,
        grenadeing: user.grenadeing,
        danger: user.danger,
        status: user.status,
        name: user.name,
        id: user.id,
        x: user.x,
        y: user.y,
        vy: user.vy,
        score: user.score,
        dead: user.dead,
        npc: user.npc,
        doubleJumping: user.doubleJumping,
        flying: user.flying,
    };
}
