const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    'index': path.resolve(__dirname, './public/js/index.js'),
    'hall': path.resolve(__dirname, './public/js/hall.js'),
    'hallroom': path.resolve(__dirname, './public/js/hallroom.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 5000000, 
    maxAssetSize: 3000000
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: "sass-loader" // 将 Sass 编译成 CSS
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|svg|ttf|eot|jpg|gif)$/,
        use:[{
          loader: "url-loader",
          options: {
            name: '[name].[ext]',
            limit: 1024, // size <= 1kib
            outputPath: 'dist/images'
          }
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader', //用babel-loader处理
          options:{
            presets:[
              '@babel/preset-env' //使用这个预设，会根据浏览器来选择插件转化ES5
            ],
            plugins: [
              [
               '@babel/plugin-transform-runtime'
              ]
            ]
          } 
        }]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    })
  ]
}
