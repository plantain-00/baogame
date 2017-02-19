let ws: WebSocket | undefined;

function processData(str: string) {
    const $s = str.indexOf("$");
    if ($s === -1) {
        return { name: str, value: undefined };
    } else {
        return { name: str.substring(0, $s), value: JSON.parse(str.substring($s + 1)) };
    }
}

export function connect(roomID: number | undefined, onsuccess: () => void, onmessage: (name: string, value: any) => void) {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    ws = new WebSocket(`${protocol}//${location.host}/ws/?roomID=${roomID || 1}`);
    ws.onopen = () => {
        onsuccess();
    };
    ws.onmessage = (evt) => {
        if (evt.data instanceof Blob) {
            const reader = new FileReader();
            reader.addEventListener("loadend", () => {
                const x = new Uint8Array(reader.result);
                const {name, value} = processData(x.toString());
                onmessage(name, value);
            });
            reader.readAsArrayBuffer(evt.data);
        } else {
            const {name, value} = processData(evt.data);
            onmessage(name, value);
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

export function emit(name: string, data?: any) {
    if (!ws) {
        return;
    }
    ws.send(data ? name + "$" + JSON.stringify(data) : name);
}
