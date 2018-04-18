module.exports = {
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
}
