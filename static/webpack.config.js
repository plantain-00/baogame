const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: './static/dist/front/index'
  },
  output: {
    path: path.join(__dirname, 'scripts/'),
    filename: '[name].bundle.js',
    publicPath: 'scripts/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
}
