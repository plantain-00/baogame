import * as libs from "./libs";
import * as common from "./common";

const app = libs.express();
const server = libs.http.createServer(app);
const wss = new libs.WebSocketServer({ server });
import * as services from "./services";

const opts: any = {};
for (const key of process.argv.splice(2)) {
    const keys = key.split("=");
    opts[keys[0]] = keys[1];
}

const adminCode = opts.code || "admin";

server.listen(opts.port || 8030, () => {
    console.log("Listening on " + server.address().port);
});

app.use(libs.express.static(libs.path.resolve(__dirname, "../static")));

// 游戏地址
app.get("/createRoom", (req, res) => {
    const type = req.query.type;
    const room = services.createGame(type, adminCode);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(room.id + "");
});

// 获取房间列表
app.get("/roomsData", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(JSON.stringify(services.getGameData()));
});

for (let i = 0; i < (opts.room || 1); i++) {
    services.createGame("大乱斗", adminCode);
}

const banedip: any = {};
let concount = 0;

wss.on("connection", ws => {
    const location = libs.url.parse(ws.upgradeReq.url!, true);
    const roomId = +location.query.roomID || 1;
    const game = services.games.find(r => r.id === roomId);
    if (!game) {
        ws.close();
        return;
    }

    const ip = ws.upgradeReq.connection.remoteAddress;
    const client: services.Client = {
        id: concount++,
        p1: null,
        p2: null,
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
    const bodiesData: any = [];
    for (const body of game.bodies) {
        bodiesData.push(body.getData());
    }

    game.clients.push(client);

    ws.on("message", message => {
        const $s = message.indexOf("$");
        let data: any;
        let name: string;
        if ($s === -1) {
            name = message;
            data = {};
        } else {
            name = message.substring(0, $s);
            data = JSON.parse(message.substring($s + 1));
        }

        if (name === "init") {
            if (data.code !== undefined) {
                if (data.code !== game.adminCode) {
                    services.emit(ws, "initFail");
                } else {
                    client.admin = true;
                }
            }
            if (data.userName) {
                client.name = data.userName.replace(/[<>]/g, "").substring(0, 8);
            }
            services.emit(ws, "init", {
                props: game.props,
                map: game.map.getData(),
                bodies: bodiesData,
            });
        } else if (name === "join") {
            if (client.banned) {
                services.emit(ws, "joinFail", "you are banned");
                return;
            }
            let u = 0;
            for (const user of game.users) {
                if (!user.npc) {
                    u++;
                }
            }
            if (u >= game.props.maxUser) {
                services.emit(ws, "joinFail", "加入失败，服务器已满");
                return;
            }
            if (data.p1 && client.p1 && !client.p1.dieing && !client.p1.dead) { return; }
            if (data.p2 && client.p2 && !client.p2.dieing && !client.p2.dead) { return; }
            client.name = data.userName.replace(/[<>]/g, "").substring(0, 8);
            const u2 = game.createUser(client);
            if (data.p1) {
                client.p1 = u2;
            } else {
                client.p2 = u2;
            }
            services.emit(ws, "joinSuccess", data.p1);
        } else if (name === "control") {
            if (client.p1 && data) {
                const p1 = services.Packs.controlPack.decode(data);
                client.p1.leftDown = p1.leftDown;
                client.p1.rightDown = p1.rightDown;
                client.p1.upDown = p1.upDown;
                client.p1.downDown = p1.downDown;
                client.p1.itemDown = p1.itemDown;

                client.p1.leftPress = p1.leftPress;
                client.p1.rightPress = p1.rightPress;
                client.p1.upPress = p1.upPress;
                client.p1.downPress = p1.downPress;
                client.p1.itemPress = p1.itemPress;
            }
        } else if (name === "createItem") {
            if (client.admin) {
                const item = game.createItem(data);
                item.x = Math.random() * common.constant.tileWidth;
                item.y = Math.random() * common.constant.tileHeight;
            }
        } else if (name === "ban") {
            if (client.admin) {
                const target = game.getClient(data);
                if (target) {
                    target.banned = true;
                    banedip[target.ip] = true;
                }
            }
        } else if (name === "unban") {
            if (client.admin) {
                const target = game.getClient(data);
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
