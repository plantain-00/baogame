import * as libs from "./libs";
import * as common from "./common";

let protocolType: libs.protobuf.Type;

export function start() {
    (libs.protobuf.load("./static/protocol.proto") as Promise<libs.protobuf.Root>).then(root => {
        protocolType = root.lookup("protocolPackage.Protocol") as libs.protobuf.Type;
    }, error => {
        // tslint:disable-next-line:no-console
        console.log(error);
    });
}

export function encode(protocol: common.Protocol, debug: boolean): string | Uint8Array {
    return debug ? JSON.stringify(protocol) : protocolType.encode(protocol).finish();
}

export function decode(protocol: ArrayBuffer | string): common.Protocol {
    if (typeof protocol === "string") {
        return JSON.parse(protocol);
    }
    return protocolType.decode(new Buffer(protocol)).toJSON() as common.Protocol;
}
