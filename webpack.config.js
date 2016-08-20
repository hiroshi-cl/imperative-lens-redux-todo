var webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', "./src/index.tsx"],
  output: {
    filename: "./dist/bundle.js"
  },

  devtool: "source-map",

  resolve: {
    extensions: ["", ".ts", ".tsx", ".js"]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [
      { test: /\.tsx?$/, loader: "babel?presets[]=es2015!ts" }
    ]
  }
};