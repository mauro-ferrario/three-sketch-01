const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Copy = require('copy-webpack-plugin');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pug = {
  test: /\.pug$/,
  use: ['html-loader?attrs=false', 'pug-html-loader']
};



const cssLoader = {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          // fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                'importLoaders': 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('precss'),
                    require('autoprefixer')
                  ];
                }
              },
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: [
                  // path.resolve(__dirname,"node_modules/routh/to/sass/path")
                ]
              }
            }
          ],
        })
      };

const htmlLoader = {
  test: /.(html)$/,
  use: {
    loader: 'file-loader?publicPath=../&name=[name].[ext]&limit=1000!extract-loader!html-loader&interpolate=true'
  }
}

const jsLoader = {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] },
        }],
      };

const fontLoader = {
  test: /.(svg|woff|woff2|ttf|eot|otf)$/,
  exclude: [/node_modules/],
  use: {
    loader: 'url-loader?publicPath=../&name=fonts/[hash].[ext]&limit=10000',
  }
}

const imageLoader = {
  test: /.(png|jpg|jpeg|gif)$/,
  exclude: [/node_modules/],
  use: {
    loader: 'url-loader?publicPath=../&name=./img/[name].[ext]&limit=10000',
  }
}

module.exports = {
  entry: "./index.js",
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist'
  },
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: "js/build.js",
  },
  module:{
    rules:[
      pug,
      cssLoader,
      jsLoader,
      fontLoader,
      imageLoader,
      //htmlLoader
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.pug',
      inject: false
    }),
    new Copy([
      { from: 'src/img', to: 'img' },
      { from: 'src/fonts', to: 'fonts' }
      // { from: 'src/video', to: 'video' } // In case of video folder
    ]),
    new ExtractTextPlugin({
      filename: 'css/style.css',
      disable: false,
      allChunks: true
    })
  ]
}