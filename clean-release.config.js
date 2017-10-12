module.exports = {
  include: [
    'dist/*.js',
    'static/protocol.proto',
    'static/scripts/*.bundle-*.js',
    'static/index.html',
    'LICENSE',
    'package.json',
    'yarn.lock',
    'README.md'
  ],
  exclude: [
  ],
  releaseRepository: 'https://github.com/plantain-00/baogame-release.git',
  postScript: [
    'cd [dir] && rm -rf .git',
    'cp Dockerfile [dir]',
    'cd [dir] && docker build -t plantain/baogame . && docker push plantain/baogame'
  ]
}
