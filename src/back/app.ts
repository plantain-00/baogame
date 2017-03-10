import * as libs from "./libs";
import * as common from "./common";
import * as services from "./services";
import * as core from "./core";

const app = libs.express();
const server = libs.http.createServer(app);
const wss = new libs.WebSocketServer({ server });

const argv = libs.minimist(process.argv.slice(2));
const port = argv["p"] || 8030;
const host = argv["h"] || "localhost";

server.listen(port || 8030, () => {
    console.log(`Listening on ${host}:${port}`);
});

app.use(libs.express.static(libs.path.resolve(__dirname, "../static")));

// services.format.start();

core.init();

let concount = 0;

wss.on("connection", ws => {
    const ip = ws.upgradeReq.connection.remoteAddress;
    const client: core.Client = {
        id: concount++,
        p1: null,
        name: "无名小卒",
        joinTime: Date.now(),
        ip,
        kill: 0,
        death: 0,
        highestKill: 0,
        leaveTime: undefined,
        ws,
    };
    const bodiesData = core.game.bodies.map(body => services.user.getData(body));

    core.game.clients.push(client);

    ws.on("message", message => {
        // const protocol = services.format.decode(message);
        const protocol: common.Protocol = JSON.parse(message);

        if (protocol.kind === "init") {
            if (protocol.init.userName) {
                client.name = protocol.init.userName.replace(/[<>]/g, "").substring(0, 8);
            }
            const outProtocol: common.Protocol = {
                kind: "initSuccess",
                initSuccess: {
                    props: core.game.props,
                    map: core.mapData,
                    bodies: bodiesData,
                },
            };
            core.emit(ws, outProtocol);
        } else if (protocol.kind === "join") {
            let u = 0;
            for (const user of core.users) {
                if (!user.npc) {
                    u++;
                }
            }
            if (protocol.join.p1 && client.p1 && !client.p1.dieing && !client.p1.dead) { return; }
            client.name = protocol.join.userName.replace(/[<>]/g, "").substring(0, 8);
            const user = services.game.createUser(client);
            if (protocol.join.p1) {
                client.p1 = user;
            }
            core.emit(ws, { kind: "joinSuccess" });
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
        }
    });

    ws.on("close", () => {
        services.game.removeClient(client.id);
    });
});
