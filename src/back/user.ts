import * as services from "./services";
import * as common from "./common";

let userCount = 0;
export class User {
    id: number;
    name: string;
    onFloor: number | false = false;
    onLadder = false;
    nearLadder: boolean | common.Ladder = false;
    dead = false;
    rolling = false;
    crawl = false;
    x: number;
    y = 380;
    vx = 0;
    vy = 0;
    dieing = false;
    faceing = 1;
    danger = false;
    ignore: any[] = [];
    carry: number;
    carryCount = 0;
    fireing: number | boolean = 0;
    mining: number | boolean = 0;
    grenadeing = 0;
    score = 0;
    canDoubleJump = false;
    lastTouch: number | null = null;
    rollPoint: number;
    downDown: number;
    ladder: common.Ladder;
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
    killedBy: services.KillReason;
    goleft: boolean;
    goright: boolean;
    facing: boolean;
    constructor(public game: services.Game, public client: services.Client) {
        this.id = userCount++;
        this.name = client.name;
        this.x = Math.random() * (game.props.w - 300) + 150;
    }
    throwGrenade() {
        const g = services.grenade.create(this);
        const vx = this.faceing * (15 + this.grenadeing) / 5;
        let vy = this.grenadeing / 3;

        if (this.crawl) {
            vy = 0;
        }

        g.x = this.x - this.faceing * 20;
        g.y = this.y + this.game.props.userHeight;
        g.vx = this.vx + vx;
        g.vy = this.vy + vy;

        this.game.entitys.push(g);
    }
    getStatus(): common.userStatus {
        this.crawl = false;
        if (this.dieing) { return "dieing"; }
        if ((this.vy <= 0 || this.onLadder) && this.game.checkMine(this)) {
            return "dieing";
        }
        if (this.onLadder && this.vx === 0 && this.vy === 0) {
            return "climbing";
        } else {
            const onFloor = this.game.map.onFloor(this.x, this.y);
            this.onFloor = onFloor;
            this.nearLadder = this.game.map.nearLadder(this);
            if (onFloor && this.vy <= 0) {
                if (this.rolling) {
                    this.rollPoint--;
                    if (this.rollPoint <= 0) {
                        this.vx = 0;
                        this.rolling = false;
                    } else {
                        this.crawl = true;
                        return "rolling2";
                    }
                }
                if (this.danger) {
                    if (Math.abs(this.vx) < .2) {
                        this.danger = false;
                        return "standing";
                    } else {
                        return "rolling";
                    }
                }
                if (typeof this.mining === "number" && this.mining > 0) {
                    this.mining--;
                    if (this.mining === 0) {
                        if (this.game.addMine(this)) {
                            this.carryCount--;
                        }
                    } else {
                        return "mining";
                    }
                }
                if ((this.upDown || this.downDown) && this.nearLadder) {
                    this.onLadder = true;
                    this.onFloor = false;
                    this.vx = 0;
                    this.ladder = this.nearLadder;
                    this.x = this.ladder.x * common.constant.tileWidth;
                    return "climbing";
                } else if (this.downDown) {
                    this.crawl = true;
                    if (Math.abs(this.vx) < .2) {
                        return "crawling";
                    } else {
                        this.rolling = true;
                        this.rollPoint = 20;
                        if (this.vx > 0) { this.vx += 2; }
                        if (this.vx < 0) { this.vx -= 2; }
                        return "rolling2";
                    }
                } else if (this.itemPress && this.vx === 0 && this.carry === common.items.mine.id && this.carryCount > 0) {
                    this.mining = 20;
                    return "mining";
                } else {
                    this.lastTouch = null;
                    if (this.carry === common.items.doublejump.id) {
                        this.canDoubleJump = true;
                    }
                    return "standing";
                }
            } else {
                return "falling";
            }
        }
    }
    update() {
        this.doubleJumping = false;
        this.flying = 0;

        for (const key in this.ignore) {
            this.ignore[key]--;
        }
        // 时限
        if (this.carry === common.items.power.id || this.carry === common.items.hide.id || this.carry === common.items.bomb.id) {
            this.carryCount--;
            if (this.carryCount <= 0) {
                if (this.carry === common.items.bomb.id) {
                    this.game.explode(this.x + this.faceing * 20, this.y + this.game.props.userHeight / 2, this, 120);
                }
                this.carry = 0;
                this.carryCount = 0;
            }
        }
        this.status = this.getStatus();

        if (this.npc && this.AI) {
            services.playerAI(this);
        }
        if (this.status === "falling" || this.status === "standing" || this.status === "climbing") {
            // 开枪
            if (typeof this.fireing === "number" && this.fireing > 0) {
                this.fireing--;
                if (this.fireing === 5) {
                    this.carryCount--;
                    if (this.carryCount === 0) {
                        this.carry = 0;
                    }
                    this.game.checkShot(this);
                }
            } else if (this.itemPress && this.carry === common.items.gun.id && this.carryCount > 0) {
                this.fireing = 25;
            }
        } else {
            this.fireing = 0;
        }

        if (this.status === "falling" || this.status === "standing" || this.status === "climbing" || this.status === "crawling") {
            // grenade
            if (this.grenadeing > 0 && this.itemDown) {
                this.grenadeing++;
                this.grenadeing = Math.min(25, this.grenadeing);
            } else if (this.grenadeing > 0 && !this.itemDown) {
                this.throwGrenade();
                this.grenadeing = 0;
                this.carryCount--;
                if (this.carryCount === 0) {
                    this.carry = 0;
                }
            } else if (this.grenadeing === 0 && this.itemPress && this.carry === common.items.grenade.id && this.carryCount > 0) {
                this.grenadeing = 1;
            }
        } else {
            this.grenadeing = 0;
        }

        if (this.status === "dieing") {
            this.vx *= .98;
            this.vy -= .2;
            this.vy = Math.max(-9, this.vy);
            this.r += this.vr;
            this.vr *= .96;
        }
        if (this.status === "climbing") {
            if (this.upDown && !this.downDown && this.y < this.ladder.y2 * common.constant.tileHeight - this.game.props.userHeight) {
                this.y += 3;
            } else if (this.downDown && !this.upDown && this.y > this.ladder.y1 * common.constant.tileHeight + 3) {
                this.y -= 3;
            }
            if (this.leftPress) {
                if (this.faceing !== -1) {
                    this.faceing = -1;
                } else {
                    this.vx = -2;
                    this.onLadder = false;
                }
            } else if (this.rightPress) {
                if (this.faceing !== 1) {
                    this.faceing = 1;
                } else {
                    this.vx = 2;
                    this.onLadder = false;
                }
            }
        } else if (this.status === "standing") {
            if (this.leftDown && !this.rightDown) {
                if (this.vx > 0) {
                    if (this.carry === common.items.power.id) {
                        this.vx = -.4;
                    } else {
                        this.vx = -1;
                    }
                } else {
                    if (this.carry === common.items.power.id) {
                        this.vx -= .08;
                    } else {
                        this.vx -= .2;
                    }
                }
                this.faceing = -1;
                this.vx = Math.max(this.vx, -4, -this.leftDown / 20);
            } else if (!this.leftDown && this.rightDown) {
                if (this.vx < 0) {
                    if (this.carry === common.items.power.id) {
                        this.vx = .4;
                    } else {
                        this.vx = 1;
                    }
                } else {
                    if (this.carry === common.items.power.id) {
                        this.vx += .08;
                    } else {
                        this.vx += .2;
                    }
                }
                this.faceing = 1;
                this.vx = Math.min(this.vx, 4, this.rightDown / 20);
            } else {
                this.vx = 0;
            }
            if (this.upDown > 60 && !this.downDown) {
                this.vy = 5;
                this.flypackActive = false;
            } else {
                this.vy = 0;
            }
        } else if (this.status === "rolling2") {
            this.vx *= .96;
        } else if (this.status === "rolling") {
            this.vx *= .9;
        } else if (this.status === "falling") {
            if (this.upPress && this.canDoubleJump) {
                this.doubleJumping = true;
                this.canDoubleJump = false;
                this.vy = 5;
            }
            if (this.upPress && this.carry === common.items.flypack.id) {
                this.flypackActive = true;
            }
            if (this.upDown && this.carry === common.items.flypack.id && this.carryCount > 0 && this.flypackActive) {
                this.vy += .3;
                this.flying += 1;
                this.carryCount--;
            }
            if (this.leftPress && this.faceing === 1) {
                this.faceing = -1;
            }
            if (this.rightPress && this.faceing === -1) {
                this.faceing = 1;
            }
            if (this.leftDown && this.carry === common.items.flypack.id && this.carryCount > 0) {
                this.vx -= .15;
                this.flying += 2;
                this.carryCount -= .2;
            }
            if (this.rightDown && this.carry === common.items.flypack.id && this.carryCount > 0) {
                this.vx += .15;
                this.flying += 4;
                this.carryCount -= .2;
            }
            this.vy -= .2;
            this.vy = Math.max(-9, this.vy);
            this.vy = Math.min(10, this.vy);
            this.vx = Math.max(-8, this.vx);
            this.vx = Math.min(8, this.vx);
            if (this.vy === -9) {
                this.danger = true;
            }
        } else if (this.status === "crawling") {
            this.vx = 0;
        }

        // final process
        this.x += this.vx;
        if (this.x <= 0) { this.vx = Math.abs(this.vx); }
        if (this.x >= this.game.props.w) { this.vx = -Math.abs(this.vx); }
        if (this.y < 0) {
            this.dead = true;
            if (!this.dieing) {
                this.killed("fall");
            }
        } else {
            if (this.vy > 0) {
                this.y += Math.floor(this.vy);
            } else {
                for (let i = 0; i < -this.vy; i++) {
                    this.y--;
                    if (!this.dieing && this.game.map.onFloor(this.x, this.y)) {
                        this.vy = 0;
                        break;
                    }
                }
            }
        }
    }
    scoreing() {
        this.score++;
        this.client.kill++;
        if (this.score > this.client.highestKill) {
            this.client.highestKill = this.score;
        }
        if (this.game.map.onKilled) {
            this.game.map.onKilled(this.game, this);
        }
    }
    killed(action: services.KillReason, byUser?: services.User) {
        if (this.dieing) { return; }
        if (byUser) {
            this.killer = byUser.id;
        }

        this.killedBy = action;
        this.client.death++;

        if (action === "power") {
            this.vy = 10;
        } else if (action === "drug") {
            this.vy = 3;
            this.killer = this.lastTouch;
        } else if (action === "gun") {
            this.vy = 1;
        } else if (action === "mine") {
            this.vy = 10;
        } else if (action === "bomb") {
            // todo
        } else {
            this.killer = this.lastTouch;
        }

        if (this.game.map.onKilled) {
            this.game.map.onKilled(this.game, this);
        }
        let killer: services.User | undefined;
        if (this.killer && this.killer !== this.id) {
            killer = this.game.getUser(this.killer);
            if (killer) {
                killer.scoreing();
            }
        }

        let message: string | undefined;
        if (killer) {
            if (action === "drug") {
                message = "<b>" + killer.name + "</b>让<b>" + this.name + "</b>品尝到了毒药的滋味";
            } else if (action === "mine") {
                if (this.killer === this.id) {
                    message = "<b>" + killer.name + "</b>用自己的身体检验了地雷的可靠性，结果很成功";
                } else {
                    message = "<b>" + killer.name + "</b>的地雷让<b>" + this.name + "</b>的菊花一紧";
                }
            } else if (action === "gun") {
                message = "<b>" + killer.name + "</b>开枪了，<b>" + this.name + "</b>应声倒地";
            } else if (action === "power") {
                message = "<b>" + killer.name + "</b>把<b>" + this.name + "</b>扔进了泥潭";
            } else if (action === "bomb") {
                message = "<b>" + this.name + "</b>没能从爆炸中逃生";
            } else {
                message = "<b>" + killer.name + "</b>把<b>" + this.name + "</b>扔进了泥潭";
            }
        } else {
            if (action === "drug") {
                message = "<b>" + this.name + "</b>尝了一口毒药";
            } else {
                message = "<b>" + this.name + "</b>完成了华丽的一跃";
            }
        }

        this.game.announce({
            kind: "userDead",
            userDead: {
                user: this.getData(),
                killer: killer ? killer.getData() : undefined,
                message,
            },
        });
    }
    getData(): common.User {
        return {
            carry: this.carry,
            carryCount: this.carryCount,
            nearLadder: this.nearLadder as boolean,
            faceing: this.faceing,
            fireing: this.fireing as number,
            grenadeing: this.grenadeing,
            danger: this.danger,
            status: this.status,
            name: this.name,
            id: this.id,
            x: this.x,
            y: this.y,
            vy: this.vy,
            score: this.score,
            dead: this.dead,
            npc: this.npc,
            doubleJumping: this.doubleJumping,
            flying: this.flying,
        };
    }
}
