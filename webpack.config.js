const webpack = require('webpack')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// https://webpack.js.org/guides/production/

/** @type {import('webpack').Configuration} */
const config = {
  entry: path.resolve(__dirname, './index.js'),
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: './[name].js',
    publicPath: './',
    hotUpdateChunkFilename: 'hot/hot-update.[name].js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  resolve: {
    alias: {
      'browserfs$': 'browserfs/dist/browserfs.mjs',
      'bfsGlobal': 'browserfs',
      'fs': require.resolve('./shims/fs.js'),
      'path': require.resolve('./shims/path.js'),
      'processGlobal': require.resolve('./shims/process.js'),
      'bufferGlobal': require.resolve('./shims/bufferGlobal.js'),

      // these below were taken from huge webpack config (project uses server in browser)
      express: false,
      jose: false
    },
    fallback: {
      jose: false,
      zlib: require.resolve('browserify-zlib'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      assert: require.resolve('assert/'),
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      constants: require.resolve('constants-browserify'),
      os: require.resolve('os-browserify/browser'),
      http: require.resolve('http-browserify'),
      https: require.resolve('https-browserify'),
      timers: require.resolve('timers-browserify'),
      child_process: false,
      tls: false,
    },
    exportsFields: [
      'ignore'
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ BrowserFS: 'bfsGlobal', process: 'processGlobal', Buffer: 'bufferGlobal' }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      minify: false,
      chunks: 'all',
    })
  ]
}

module.exports = config
