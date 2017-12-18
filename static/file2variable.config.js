module.exports = {
  files: [
    'static/protocol.proto',
    'src/front/template.html'
  ],
  /**
   * @argument {string} file
   */
  handler: file => {
    if (file.endsWith('template.html')) {
      return {
        type: 'vue',
        name: 'App',
        path: './index'
      }
    }
    if (file.endsWith('.proto')) {
      return { type: 'protobuf' }
    }
    return { type: 'text' }
  },
  out: 'src/front/proto-variables.ts'
}
