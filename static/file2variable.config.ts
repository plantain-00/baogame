import { Configuration } from 'file2variable-cli'

const config: Configuration = {
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
        type: 'vue3',
      }
    }
    if (file.endsWith('.proto')) {
      return { type: 'protobuf' }
    }
    return { type: 'text' }
  },
  out: 'src/front/proto-variables.ts'
}

export default config
