module.exports = {
  build: [
    `rimraf dist/ static/dist/ static/scripts/ static/index-*.css`,
    `cleancss -o static/index.bundle.css static/index.css`,
    'types-as-schema src/back/common.ts --protobuf static/protocol.proto',
    'file2variable-cli static/protocol.proto src/front/template.html -o src/front/proto-variables.ts --protobuf --html-minify',
    'image2base64-cli static/imgs/**/*.png static/imgs/*.png --es6 src/front/variables.ts --base static/imgs',
    'tsc -p src/back/',
    'tsc -p src/front/',
    'webpack --config static/webpack.config.js',
    'rev-static --config static/rev-static.config.js'
  ],
  lint: [
    `tslint "src/**/*.ts"`,
    `standard "**/*.config.js"`
  ],
  test: [
    'tsc -p spec',
    'jasmine',
    'tsc -p static_spec',
    'karma start static_spec/karma.config.js'
  ],
  fix: [
    `standard --fix "**/*.config.js"`
  ],
  release: [
    `clean-release`
  ]
}
