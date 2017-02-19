import * as common from "../back/common";

let ws: WebSocket | undefined;

function processData(str: string) {
    const $s = str.indexOf("$");
    if ($s === -1) {
        return { name: str, value: undefined };
    } else {
        return { name: str.substring(0, $s), value: JSON.parse(str.substring($s + 1)) };
    }
}

export function connect(roomID: number | undefined, onsuccess: () => void, onmessage: (protocol: common.OutProtocol) => void) {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    ws = new WebSocket(`${protocol}//${location.host}/ws/?roomID=${roomID || 1}`);
    ws.onopen = () => {
        onsuccess();
    };
    ws.onmessage = evt => {
        if (evt.data instanceof Blob) {
            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
                const x = new Uint8Array(reader.result);
                const {name, value} = processData(x.toString());
                onmessage({ name, data: value } as any);
            });
            reader.readAsArrayBuffer(evt.data);
        } else {
            const {name, value} = processData(evt.data);
            onmessage({ name, data: value } as any);
        }
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
