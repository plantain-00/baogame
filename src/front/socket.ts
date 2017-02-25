import * as common from "../back/common";

let ws: WebSocket | undefined;

export function connect(roomId: number | undefined, onsuccess: () => void, onmessage: (protocol: common.OutProtocol) => void) {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    ws = new WebSocket(`${protocol}//${location.host}/ws/?roomId=${roomId || 1}`);
    ws.onopen = () => {
        onsuccess();
    };
    ws.onmessage = evt => {
        onmessage(JSON.parse(evt.data));
    };
    // ws.onclose = (evt) => {
    //     if (!ws) {
    //         setTimeout(() => {
    //             connect(roomId);
    //         }, 500);
    //     }
    // };
    ws.onerror = evt => {
        console.log("WebSocketError");
    };
}

export function emit(protocol: common.InProtocol) {
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
