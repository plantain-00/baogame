import { executeScriptAsync, Program } from 'clean-scripts'
import { watch } from 'watch-then-execute'

const tsFiles = `"src/**/*.ts"`
const jsFiles = `"*.config.js" "static/**/*.config.js"`

const file2variableCommand = 'file2variable-cli --config static/file2variable.config.js'
const image2base64Command = 'image2base64-cli static/imgs/**/*.png static/imgs/*.png --es6 src/front/variables.ts --base static/imgs'
const tscBackCommand = 'tsc -p src/back/'
const tscFrontCommand = 'tsc -p src/front/'
const webpackCommand = 'webpack --config static/webpack.config.js'
const revstaticCommand = 'rev-static --config static/rev-static.config.ts'
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
    ts: `eslint --ext .js,.ts ${tsFiles} ${jsFiles}`,
    export: `no-unused-export ${tsFiles}`,
    commit: `commitlint --from=HEAD~1`,
    markdown: `markdownlint README.md`,
    typeCoverageBack: 'type-coverage -p src/back --strict',
    typeCoverageFront: 'type-coverage -p src/front --strict'
  },
  test: {
    start: new Program('clean-release --config clean-run.config.ts', 30000)
  },
  fix: `eslint --ext .js,.ts ${tsFiles} ${jsFiles} --fix`,
  watch: {
    schema: `${typesAsSchemaCommand} --watch`,
    back: `${tscBackCommand} --watch`,
    image: `${image2base64Command} --watch`,
    file: `${file2variableCommand} --watch`,
    webpack: `${webpackCommand} --watch`,
    css: () => watch(['static/index.css'], [], () => executeScriptAsync(cssCommand)),
    rev: `${revstaticCommand} --watch`
  }
}
