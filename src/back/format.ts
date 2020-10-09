import * as libs from './libs'
import * as common from './common'
import * as core from './core'

let requestProtocolType: libs.protobuf.Type
let responseProtocolType: libs.protobuf.Type

export function start() {
  (libs.protobuf.load('./static/protocol.proto') as Promise<libs.protobuf.Root>).then(root => {
    requestProtocolType = root.lookup('RequestProtocol') as libs.protobuf.Type
    responseProtocolType = root.lookup('ResponseProtocol') as libs.protobuf.Type
  }, error => {
    core.printInConsole(error)
  })
}

export function encode(protocol: common.ResponseProtocol, debug: boolean): string | Uint8Array {
  return debug ? JSON.stringify(protocol) : responseProtocolType.encode(protocol).finish()
}

export function decode(protocol: ArrayBuffer | string): common.RequestProtocol {
  if (typeof protocol === 'string') {
    return JSON.parse(protocol)
  }
  return requestProtocolType.toObject(requestProtocolType.decode(Buffer.from(protocol))) as common.RequestProtocol
}
