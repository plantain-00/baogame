const { Service, executeScriptAsync, Program } = require('clean-scripts')
const { watch } = require('watch-then-execute')

const tsFiles = `"src/**/*.ts" "spec/**/*.ts" "static_spec/**/*.ts" "screenshots/**/*.ts"`
const jsFiles = `"*.config.js" "static/**/*.config.js" "static_spec/**/*.config.js"`

const file2variableCommand = 'file2variable-cli --config static/file2variable.config.js'
const image2base64Command = 'image2base64-cli static/imgs/**/*.png static/imgs/*.png --es6 src/front/variables.ts --base static/imgs'
const tscBackCommand = 'tsc -p src/back/'
const tscFrontCommand = 'tsc -p src/front/'
const webpackCommand = 'webpack --config static/webpack.config.js'
const revstaticCommand = 'rev-static --config static/rev-static.config.js'
const typesAsSchemaCommand = `types-as-schema "src/back/common.ts" --protobuf static/protocol.proto`
const cssCommand = [
  `postcss static/index.css -o static/index.postcss.css`,
  `cleancss "static/index.postcss.css" -o static/index.bundle.css`
]

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
          css: cssCommand,
          clean: `rimraf static/index-*.css`
        },
        revstaticCommand
      ]
    }
  ],
  lint: {
    ts: `tslint ${tsFiles}`,
    js: `standard ${jsFiles}`,
    export: `no-unused-export ${tsFiles}`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`,
    typeCoverageBack: 'type-coverage -p src/back --at-least 100',
    typeCoverageFront: 'type-coverage -p src/front --at-least 98'
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
    start: new Program('clean-release --config clean-run.config.js', 30000)
  },
  fix: {
    ts: `tslint --fix ${tsFiles}`,
    js: `standard --fix ${jsFiles}`
  },
  watch: {
    schema: `${typesAsSchemaCommand} --watch`,
    back: `${tscBackCommand} --watch`,
    image: `${image2base64Command} --watch`,
    file: `${file2variableCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    css: () => watch(['static/index.css'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revstaticCommand} --watch`
  },
  screenshot: [
    new Service(`node ./dist/app.js`),
    `tsc -p screenshots`,
    `node screenshots/index.js`
  ]
}
