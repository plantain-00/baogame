module.exports = {
  inputFiles: [
    'static/scripts/*.bundle-*.js',
    'static/index.css',
    'static/*.ejs.html'
  ],
  excludeFiles: [],
  revisedFiles: [
    'static/scripts/*.bundle-*.js'
  ],
  outputFiles: file => file.replace('.ejs', ''),
  json: false,
  ejsOptions: {
    rmWhitespace: true
  },
  sha: 256,
  customNewFileName: (filePath, fileString, md5String, baseName, extensionName) => baseName + '-' + md5String + extensionName,
  base: 'static',
  fileSize: 'static/file-size.json'
}
