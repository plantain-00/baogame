import * as libs from "./libs";
import * as common from "./common";

let protocolType: libs.protobuf.Type;

export function start() {
    (libs.protobuf.load("./static/protocol.proto") as Promise<libs.protobuf.Root>).then(root => {
        protocolType = root.lookup("protocolPackage.Protocol") as libs.protobuf.Type;
    }, error => {
        console.log(error);
    });
}

export function encode(protocol: common.Protocol): Uint8Array {
    return protocolType.encode(protocol).finish();
}

export function decode(protocol: ArrayBuffer): common.Protocol {
    return protocolType.decode(new Buffer(protocol)).toObject() as common.Protocol;
}
