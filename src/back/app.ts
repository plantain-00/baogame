import * as libs from "./libs";
import * as common from "./common";
import * as services from "./services";

const app = libs.express();
const server = libs.http.createServer(app);
const wss = new libs.WebSocketServer({ server });

const adminCode = process.env.BAO_DEFAULT_ROOM_ADMIN_CODE || "admin";

const argv = libs.minimist(process.argv.slice(2));
const port = argv["p"] || 8030;
const host = argv["h"] || "localhost";

server.listen(port || 8030, () => {
    console.log(`Listening on ${host}:${port}`);
});

app.use(libs.express.static(libs.path.resolve(__dirname, "../static")));

// services.format.start();

// 游戏地址
app.get("/createRoom", (req, res) => {
    const name = req.query.name || "new room";
    const code = req.query.code;
    const room = services.createGame(name, code);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(room.id.toString());
});

// 获取房间列表
app.get("/roomsData", (req, res) => {
    res.json(services.getGameData());
});

services.createGame("大乱斗", adminCode);

const banedip: { [ip: string]: boolean } = {};
let concount = 0;

wss.on("connection", ws => {
    const location = libs.url.parse(ws.upgradeReq.url!, true);
    const roomId = +location.query.roomId || 1;
    const game = services.games.find(r => r.id === roomId);
    if (!game) {
        ws.close();
        return;
    }

    const ip = ws.upgradeReq.connection.remoteAddress;
    const client: services.Client = {
        id: concount++,
        p1: null,
        admin: false,
        name: "无名小卒",
        joinTime: Date.now(),
        ip,
        kill: 0,
        death: 0,
        highestKill: 0,
        banned: banedip[ip],
        leaveTime: undefined,
        ws,
    };
    const bodiesData = game.bodies.map(body => body.getData());

    game.clients.push(client);

    ws.on("message", message => {
        // const protocol = services.format.decode(message);
        const protocol: common.Protocol = JSON.parse(message);

        if (protocol.kind === "init") {
            if (protocol.init.userName) {
                client.name = protocol.init.userName.replace(/[<>]/g, "").substring(0, 8);
            }
            services.emit(ws, {
                kind: "initSuccess",
                initSuccess: {
                    props: game.props,
                    map: game.map.getData(),
                    bodies: bodiesData,
                },
            });
        } else if (protocol.kind === "adminInit") {
            if (protocol.adminInit.code === game.adminCode) {
                client.admin = true;
            } else {
                services.emit(ws, { kind: "adminInitFail" });
                ws.close();
            }
        } else if (protocol.kind === "join") {
            if (client.banned) {
                services.emit(ws, {
                    kind: "joinFail",
                    joinFail: {
                        message: "you are banned",
                    },
                });
                return;
            }
            let u = 0;
            for (const user of game.users) {
                if (!user.npc) {
                    u++;
                }
            }
            if (u >= game.props.maxUser) {
                services.emit(ws, {
                    kind: "joinFail",
                    joinFail: {
                        message: "加入失败，服务器已满",
                    },
                });
                return;
            }
            if (protocol.join.p1 && client.p1 && !client.p1.dieing && !client.p1.dead) { return; }
            client.name = protocol.join.userName.replace(/[<>]/g, "").substring(0, 8);
            const u2 = game.createUser(client);
            if (protocol.join.p1) {
                client.p1 = u2;
            }
            services.emit(ws, { kind: "joinSuccess" });
        } else if (protocol.kind === "control") {
            if (client.p1 && protocol.control) {
                client.p1.leftDown = protocol.control.leftDown;
                client.p1.rightDown = protocol.control.rightDown;
                client.p1.upDown = protocol.control.upDown;
                client.p1.downDown = protocol.control.downDown;
                client.p1.itemDown = protocol.control.itemDown;
                client.p1.leftPress = protocol.control.leftPress;
                client.p1.rightPress = protocol.control.rightPress;
                client.p1.upPress = protocol.control.upPress;
                client.p1.downPress = protocol.control.downPress;
                client.p1.itemPress = protocol.control.itemPress;
            }
        } else if (protocol.kind === "createItem") {
            if (client.admin) {
                const item = game.createItem(protocol.createItem.type);
                item.x = Math.random() * common.constant.tileWidth;
                item.y = Math.random() * common.constant.tileHeight;
            }
        } else if (protocol.kind === "ban") {
            if (client.admin) {
                const target = game.getClient(protocol.ban.clientId);
                if (target) {
                    target.banned = true;
                    banedip[target.ip] = true;
                }
            }
        } else if (protocol.kind === "unban") {
            if (client.admin) {
                const target = game.getClient(protocol.unban.clientId);
                if (target) {
                    target.banned = false;
                    banedip[target.ip] = false;
                }
            }
        }
    });

    ws.on("close", () => {
        game.removeClient(client.id);
    });
});
