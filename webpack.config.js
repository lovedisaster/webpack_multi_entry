const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const webpack = require("webpack");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const HappyPack = require('happypack');


let isProd = process.argv.indexOf('-p') !== -1;
let happyThreadPool = HappyPack.ThreadPool({ size: 5 });
let plugins = [
  new ExtractTextPlugin("[name].styles.css"),
];
if (isProd) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}
else {
  plugins = plugins.concat([
    new LiveReloadPlugin({port: 4001, hostname: 'localhost'}),
    new HappyPack({
      id: 'scripts',
      threadPool: happyThreadPool,
      loaders: [
        'babel-loader'
      ]
    })
  ]);
}

module.exports = {
  context: path.resolve('src/assets'),
  entry: {
    home : './home.js',
    details : './details.js',
    search : './search.js',
    checkout : './checkout.js',
    shop : './shop.js'
  },
  output: {
    path: path.resolve("public/build/"),
    publicPath: "/build/",
    pathForExpress: "/build/",
    filename: "[name].bundle.js"
  },
  watch: !isProd,
  plugins: plugins,

  devServer: {
    contentBase: 'public/html'
  },

  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.css$|\.scss$/,
        exlude: /node_modules/,
        loader: ExtractTextPlugin.extract("style-loader", ["css-loader?sourceMap", "postcss-loader", "sass-loader"])
      },
      {
        test: /\.js$/,
        loader: isProd ? 'babel-loader' : 'happypack/loader?id=scripts',
        exlude: /node_modules/
      },
      {
        test: /\.svg$/i,
        loader: "svg-url-loader"
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000'
      },
      {
        test: /.*\.(gif|jpe?g)$/i,
        loaders: [
          'file',
        ]
      },
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
    ]
  }
};