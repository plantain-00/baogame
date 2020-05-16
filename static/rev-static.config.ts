export default {
  inputFiles: [
    'static/scripts/*.bundle.js',
    'static/index.bundle.css',
    'static/*.ejs.html'
  ],
  excludeFiles: [],
  revisedFiles: [
  ],
  inlinedFiles: [
    'static/index.bundle.css'
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
