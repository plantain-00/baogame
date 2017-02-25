import * as protobuf from "protobufjs";

import * as common from "../back/common";

const protofile: string = require("raw-loader!../../protocol.proto");
const protocolType = (protobuf.parse(protofile)["root"] as protobuf.Root).lookup("protocolPackage.Protocol") as protobuf.Type;

export function encode(protocol: common.Protocol): Uint8Array {
    return protocolType.encode(protocol).finish();
}

export function decode(data: ArrayBuffer): common.Protocol {
    return protocolType.decode(new Uint8Array(data)).toObject() as common.Protocol;
}
