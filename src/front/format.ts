import * as protobuf from "protobufjs/light";

import * as common from "../back/common";
import { staticProtocolProto } from "./proto-variables";

const protocolType = protobuf.Root.fromJSON(staticProtocolProto).lookup("protocolPackage.Protocol") as protobuf.Type;

export function encode(protocol: common.Protocol, debug: boolean): Uint8Array | string {
    return debug ? JSON.stringify(protocol) : protocolType.encode(protocol).finish();
}

export function decode(data: string | ArrayBuffer): common.Protocol {
    if (typeof data === "string") {
        return JSON.parse(data);
    }
    return protocolType.decode(new Uint8Array(data)).toObject() as common.Protocol;
}
