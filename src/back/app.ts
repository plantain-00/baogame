import * as libs from './libs'
import * as common from './common'
import * as services from './services'
import * as core from './core'

const app = libs.express()

const argv = libs.minimist(process.argv.slice(2))
const port = argv.p || 8030
const host = argv.h || 'localhost'
const debug: boolean = argv.debug

const server = app.listen(port || 8030, () => {
  core.printInConsole(`Listening on ${host}:${port}${debug ? '(debug)' : '(production)'}`)
})
const wss = new libs.WebSocket.Server({ server })

app.use(libs.express.static(libs.path.resolve(__dirname, '../static')))

services.format.start()

core.init(debug)

wss.on('connection', ws => {
  core.emit(ws, {
    kind: common.ResponseProtocolKind.initSuccess,
    initSuccess: {
      map: core.mapData
    }
  })

  let user: services.user.User | undefined

  ws.on('message', (message: ArrayBuffer) => {
    const protocol = services.format.decode(message)

    if (protocol.kind === common.RequestProtocolKind.join) {
      if (protocol.join && typeof protocol.join.userName === 'string') {
        user = services.user.create(protocol.join.userName.trim().substring(0, 8), ws)
        core.users.push(user)

        core.emit(ws, { kind: common.ResponseProtocolKind.joinSuccess, joinSuccess: { userId: user.id } })
      }
    } else if (protocol.kind === common.RequestProtocolKind.control) {
      if (user && protocol.control) {
        user.control = protocol.control
      }
    }
  })
})

process.on('SIGINT', () => {
  process.exit()
})

process.on('SIGTERM', () => {
  process.exit()
})
