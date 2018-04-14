import menu from './template/menu/index'
import header from './template/header/index'
import * as JR from 'jr-ui'
import * as Regular from 'regularjs'
import './scss/index.scss'
import server from 'js/server'
// 全局注册ui组件库
JR.install(Regular)

const menuComponent = new (Regular.extend(menu))()
const headerComponent = new (Regular.extend(header))()
// 获取用户信息和菜单
server(
  '/currentLoginUser.htm'
)
.then(data => {
  if (data.code === '200') {
    const menuList = data.result.menuList
    const userName = data.result.userName
    menuComponent.data.menuList = menuList
    menuComponent.$update()
    headerComponent.data.userName = userName
    headerComponent.$update()
  }
})
.catch(e => {
  JR.JRNotify['error'](e.msg)
})
