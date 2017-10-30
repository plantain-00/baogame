const { Service, execAsync } = require('clean-scripts')

const tsFiles = `"src/**/*.ts" "spec/**/*.ts" "static_spec/**/*.ts" "screenshots/**/*.ts"`
const jsFiles = `"*.config.js" "static/**/*.config.js" "static_spec/**/*.config.js"`

const file2variableCommand = 'file2variable-cli static/protocol.proto src/front/template.html -o src/front/proto-variables.ts --protobuf --html-minify'
const image2base64Command = 'image2base64-cli static/imgs/**/*.png static/imgs/*.png --es6 src/front/variables.ts --base static/imgs'
const tscBackCommand = 'tsc -p src/back/'
const tscFrontCommand = 'tsc -p src/front/'
const webpackCommand = 'webpack --display-modules --config static/webpack.config.js'
const revstaticCommand = 'rev-static --config static/rev-static.config.js'
const typesAsSchemaCommand = `types-as-schema "src/back/common.ts" --protobuf static/protocol.proto`

module.exports = {
  build: [
    typesAsSchemaCommand,
    {
      back: [
        `rimraf dist/`,
        tscBackCommand
      ],
      front: [
        {
          js: [
            {
              image: image2base64Command,
              file: file2variableCommand
            },
            'rimraf static/dist/',
            tscFrontCommand,
            'rimraf static/scripts/',
            webpackCommand
          ],
          css: [
            `postcss static/index.css -o static/index.postcss.css`,
            `cleancss "static/index.postcss.css" -o static/index.bundle.css`
          ],
          clean: `rimraf static/index-*.css`
        },
        revstaticCommand
      ]
    }
  ],
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    export: `no-unused-export ${tsFiles}`
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
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`
  },
  release: `clean-release`,
  watch: {
    schema: `${typesAsSchemaCommand} --watch`,
    back: `${tscBackCommand} --watch`,
    image: `${image2base64Command} --watch`,
    file: `${file2variableCommand} --watch`,
    front: `${tscFrontCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    css: `watch-then-execute "static/index.css" --script "clean-scripts build[1].front[0].css"`,
    rev: `${revstaticCommand} --watch`
  },
  screenshot: [
    new Service(`node ./dist/app.js`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
