const childProcess = require('child_process')
const util = require('util')

const execAsync = util.promisify(childProcess.exec)

module.exports = {
  build: [
    'types-as-schema src/back/common.ts --protobuf static/protocol.proto',
    {
      back: [
        `rimraf dist/`,
        'tsc -p src/back/'
      ],
      front: [
        {
          js: [
            {
              image: 'image2base64-cli static/imgs/**/*.png static/imgs/*.png --es6 src/front/variables.ts --base static/imgs',
              file: 'file2variable-cli static/protocol.proto src/front/template.html -o src/front/proto-variables.ts --protobuf --html-minify'
            },
            'rimraf static/dist/',
            'tsc -p src/front/',
            'rimraf static/scripts/',
            'webpack --display-modules --config static/webpack.config.js'
          ],
          css: `cleancss -o static/index.bundle.css static/index.css`,
          clean: `rimraf static/index-*.css`
        },
        'rev-static --config static/rev-static.config.js'
      ]
    }
  ],
  lint: {
    ts: `tslint "src/**/*.ts"`,
    js: `standard "**/*.config.js"`,
    export: `no-unused-export "src/**/*.ts"`
  },
  test: {
    jasmine: [
      'tsc -p spec',
      'jasmine'
    ],
    karma: [
      'tsc -p static_spec',
      'karma start static_spec/karma.config.js'
    ],
    consistency: async () => {
      const { stdout } = await execAsync('git status -s')
      if (stdout) {
        console.log(stdout)
        throw new Error(`generated files doesn't match.`)
      }
    }
  },
  fix: {
    ts: `tslint --fix "src/**/*.ts"`,
    js: `standard --fix "**/*.config.js"`
  },
  release: `clean-release`,
  watch: {
    schema: `watch-then-execute "src/back/common.ts" --script "clean-scripts build[0]"`,
    back: `tsc -p src/back/ --watch`,
    image: `image2base64-cli static/imgs/**/*.png static/imgs/*.png --es6 src/front/variables.ts --base static/imgs --watch`,
    file: 'file2variable-cli static/protocol.proto src/front/template.html -o src/front/proto-variables.ts --protobuf --html-minify --watch',
    front: `tsc -p src/front/ --watch`,
    webpack: `webpack --config static/webpack.config.js --watch`,
    css: `watch-then-execute "static/index.css" --script "clean-scripts build[1].front[0].css"`,
    rev: `rev-static --config static/rev-static.config.js --watch`
  }
}
