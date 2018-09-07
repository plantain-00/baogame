const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

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
  resolve: isDev ? {
    extensions: ['.ts', '.tsx', '.js']
  } : undefined,
  module: isDev ? {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  } : undefined,
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
