/**
 * @author hzxiongxu
 * @description  自定义server加上mock功能
 */
var express = require('express')
var webpack = require('webpack')
var opn = require('open')
var webpackConfig = require('../webpack.config')
var hotMiddleware = require('webpack-hot-middleware')
// var chalk = require('chalk')
// var current = process.env.npm_lifecycle_event
var utils = require('./utils')

// var compiler = webpack(webpackConfig, function(err, stats) {
//   if (err) throw err
//   process.stdout.write(stats.toString({
//     colors: true,
//     modules: false,
//     children: false,
//     chunks: false,
//     progress:false,
//     chunkModules: false
//   }) + '\n\n')
//   console.log(chalk.cyan('  Build complete.\n'))

// })
var compiler = webpack(webpackConfig)
var proxyMiddleware = require('http-proxy-middleware')
var app = express()
var mock = require('../mock')
var proxyTable = require('./proxyConfig')

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath
  // stats: {
  //   colors: true,
  // },
  // quiet: true
})

// handle fallback for HTML5 history API
// 这个插件是用来解决单页面应用，点击刷新按钮和通过其他search值定位页面的404错误，未指定的时候会默认只想index.html
app.use(require('connect-history-api-fallback')())
app.use(devMiddleware)
// app.use(hotMiddleware(compiler, {heartbeat: 2000}))
app.use(hotMiddleware(compiler))
app.use(express.static(__dirname + '/webapp'))
// 数据mock
app.use(mock)

// 强制刷新页面 webpack3会报错
compiler.plugin('compilation', function(compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

Object.keys(proxyTable).forEach(function(context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

var port = '8888'
utils.portIsOccupied(port, function(port) {
  // 随便取的
  devMiddleware.waitUntilValid(function() {
    console.log('> Listening at ' + uri + '\n')
  })
  setTimeout(function() {
    opn(uri)
  }, 1000)
  var uri = 'http://localhost:' + port + '/dist/index.html'
  module.exports = app.listen(port)
})
