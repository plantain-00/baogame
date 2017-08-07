const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    index: './static/dist/front/index',
    vendor: './static/dist/front/vendor'
  },
  output: {
    path: path.join(__dirname, 'scripts/'),
    filename: '[name].bundle.js',
    publicPath: 'scripts/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      exclude: [
      ]
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['index', 'vendor']
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    }
  }
}
