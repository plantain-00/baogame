import * as common from "../back/common";

let ws: WebSocket | undefined;

export function connect(roomID: number | undefined, onsuccess: () => void, onmessage: (protocol: common.OutProtocol) => void) {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    ws = new WebSocket(`${protocol}//${location.host}/ws/?roomID=${roomID || 1}`);
    ws.onopen = () => {
        onsuccess();
    };
    ws.onmessage = evt => {
        onmessage(JSON.parse(evt.data));
    };
    // ws.onclose = (evt) => {
    //     if (!ws) {
    //         setTimeout(() => {
    //             connect(roomID);
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
    ws.send(protocol.data ? protocol.name + "$" + JSON.stringify(protocol.data) : protocol.name);
}
