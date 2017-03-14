import * as common from "../back/common";
import { Reconnector } from "reconnection/browser";

let ws: WebSocket | undefined;

export function connect(onmessage: (protocol: common.Protocol) => void) {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const reconnector = new Reconnector(() => {
        ws = new WebSocket(`${protocol}//${location.host}/ws/`);
        ws.onmessage = evt => {
            onmessage(JSON.parse(evt.data));
        };
        ws.onclose = () => {
            reconnector.reconnect();
        };
        ws.onopen = () => {
            reconnector.reset();
        };
    });
}

export function emit(protocol: common.Protocol) {
    if (!ws) {
        return;
    }
    ws.send(JSON.stringify(protocol));
}

export function getUrlParameter(name: string) {
    const search = location.search && location.search[0] === "?" ? location.search.substring(1) : location.search;
    const parameters = search.split("&");
    for (const parameter of parameters) {
        const index = parameter.indexOf("=");
        if (index === 0) {
            continue;
        } else if (index > 0) {
            const key = parameter.substring(0, index);
            if (key === name) {
                return parameter.substring(index + 1);
            }
        } else {
            if (parameter === name) {
                return "";
            }
        }
    }
    return "";
}
