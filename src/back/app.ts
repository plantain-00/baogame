import * as libs from "./libs";
import * as common from "./common";
import * as services from "./services";
import * as core from "./core";

const app = libs.express();
const server = libs.http.createServer(app);
const wss = new libs.WebSocketServer({ server });

const argv = libs.minimist(process.argv.slice(2));
const port = argv.p || 8030;
const host = argv.h || "localhost";
const debug: boolean = argv.debug;

server.listen(port || 8030, () => {
    // tslint:disable-next-line:no-console
    console.log(`Listening on ${host}:${port}${debug ? "(debug)" : "(production)"}`);
});

app.use(libs.express.static(libs.path.resolve(__dirname, "../static")));

services.format.start();

core.init(debug);

wss.on("connection", ws => {
    core.emit(ws, {
        kind: common.ProtocolKind.initSuccess,
        initSuccess: {
            map: core.mapData,
        },
    });

    let user: services.user.User | undefined;

    ws.on("message", message => {
        const protocol = services.format.decode(message);

        if (protocol.kind === common.ProtocolKind.join) {
            if (protocol.join && typeof protocol.join.userName === "string") {
                user = services.user.create(protocol.join.userName.trim().substring(0, 8), ws);
                core.users.push(user);

                core.emit(ws, { kind: common.ProtocolKind.joinSuccess, joinSuccess: { userId: user.id } });
            }
        } else if (protocol.kind === common.ProtocolKind.control) {
            if (user && protocol.control) {
                user.control = protocol.control;
            }
        }
    });
});
