/**
 * @author hzxiongxu
 * @description 数据mock
 */
var express = require('express')
var bodyParser = require('body-parser')

var fs = require('fs')
// var cookieParser = require('cookie-parser')
// var multer = require('multer')

var app = express()

var router = express.Router()
var pwd = process.cwd() + '/mock'
// app.use(bodyParser.text())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
// 处理数据的mock
const getBack = (req, res, next) => {
  let url = pwd + req.url.replace(/\.htm\S*/, '.js')
  if (url.indexOf('.js') === -1) {
    return
  }
  fs.stat(url, (err, stats) => {
    if (err) {
      res.send({
        code: '200',
        msg: 'mock路径(' + err.path + ')不存在,采用通用处理方式'
      })
      res.end()
    } else if (stats.isFile()) {
      require.cache[require.resolve(url)] &&
        delete require.cache[require.resolve(url)]
      let data = require(url)
      res.send(data)
      res.end()
    }
  })
}
router.use(getBack)
app.use(router)
module.exports = router
