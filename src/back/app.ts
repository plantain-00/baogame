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

wss.on("connection", ws => {
    const outProtocol: common.Protocol = {
        kind: "initSuccess",
        initSuccess: {
            props: core.game.props,
            map: core.mapData,
        },
    };
    core.emit(ws, outProtocol);
    let user: services.user.User | undefined;

    ws.on("message", message => {
        // const protocol = services.format.decode(message);
        const protocol: common.Protocol = JSON.parse(message);

        if (protocol.kind === "join") {
            user = services.game.createUser(protocol.join.userName.replace(/[<>]/g, "").substring(0, 8), ws);
            core.users.push(user);
            core.emit(ws, { kind: "joinSuccess" });
        } else if (protocol.kind === "control") {
            if (user && protocol.control) {
                user.leftDown = protocol.control.leftDown;
                user.rightDown = protocol.control.rightDown;
                user.upDown = protocol.control.upDown;
                user.downDown = protocol.control.downDown;
                user.itemDown = protocol.control.itemDown;
                user.leftPress = protocol.control.leftPress;
                user.rightPress = protocol.control.rightPress;
                user.upPress = protocol.control.upPress;
                user.downPress = protocol.control.downPress;
                user.itemPress = protocol.control.itemPress;
            }
        }
    });

    ws.on("close", () => {
        if (user) {
            const index = core.users.findIndex(u => u.id === user!.id);
            if (index > -1) {
                core.users.splice(index, 1);
            }
        }
    });
});
