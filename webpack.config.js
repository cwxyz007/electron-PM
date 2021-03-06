const path = require('path')

const electronRenderer = {
  target: 'electron-renderer',
  entry: {
    app: path.join(__dirname, 'app', 'src', 'entry.js'),
    vendors: path.join(__dirname, 'app', 'src', 'vendors.js'),
  },

  mode: process.env.NODE_ENV,

  output: {
    path: path.resolve(__dirname, 'app/build'),
    filename: '[name].js',
  },

  resolve: {
    extensions: ['.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['react'],
          compact: false,
        },
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        }],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
}

module.exports = [electronRenderer]
