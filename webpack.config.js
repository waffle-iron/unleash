const path = require('path');
const ConfigPlugin = require('config-webpack-plugin');

module.exports = {
  entry: './app/App.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['eslint'],
        include: path.join(__dirname, 'app')
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.(png|jpg|)$/,
        loader: 'url-loader?limit=200000'
      }
    ]
  },
  plugins: [
    new ConfigPlugin('./config')
  ]
};
