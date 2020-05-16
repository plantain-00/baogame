import { ConfigData } from 'clean-release'

export default {
  include: [
    'dist/*.js',
    'static/protocol.proto',
    'package.json',
    'yarn.lock'
  ],
  exclude: [
  ],
  postScript: [
    'cd "[dir]" && yarn --production && node dist/app.js'
  ]
} as ConfigData
