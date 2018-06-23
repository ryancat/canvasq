const path = require('path')

module.exports = {
  entry: {
    'canvasq': path.resolve(__dirname, 'src/canvasq.js')
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'canvasq',
    libraryTarget: 'umd'
  },

  mode: 'development'
}