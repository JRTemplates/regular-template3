/**
 * 处理端口占用问题
 */
const net = require('net')
const utils = {
  portIsOccupied: (port, fn) => {
    // 创建服务并监听该端口
    const server = net.createServer().listen(port)
    server.on('listening', () => {
      // 执行这块代码说明端口未被占用
      server.close() // 关闭服务
      console.log('端口【' + port + '】 可使用，继续开启程序') // 控制台输出信息
      fn && fn(port)
    })
    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        // 端口已经被使用
        console.log('端口【' + port + '】 被占用,尝试端口【' + (Number(port) + 1) + '】.')
        port = Number(port) + 1
        utils.portIsOccupied(port, fn)
      }
    })
  }
}
module.exports = utils
