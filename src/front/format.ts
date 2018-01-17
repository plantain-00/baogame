import * as protobuf from 'protobufjs/light'

import * as common from '../back/common'
import { staticProtocolProto } from './proto-variables'

const requestprotocolType = protobuf.Root.fromJSON(staticProtocolProto).lookup('RequestProtocol') as protobuf.Type
const responseprotocolType = protobuf.Root.fromJSON(staticProtocolProto).lookup('ResponseProtocol') as protobuf.Type

export function encode (protocol: common.RequestProtocol, debug: boolean): Uint8Array | string {
  return debug ? JSON.stringify(protocol) : requestprotocolType.encode(protocol).finish()
}

export function decode (data: string | ArrayBuffer): common.ResponseProtocol {
  if (typeof data === 'string') {
    return JSON.parse(data)
  }
  return responseprotocolType.toObject(responseprotocolType.decode(new Uint8Array(data))) as common.ResponseProtocol
}
