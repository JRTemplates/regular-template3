/**
 * 前端单页路由，基于hash
 * api:http://leeluolee.github.io/stateman/?API-zh=undefined&doc=API&lang=zh
 */
import * as stateman from 'stateman'
// import menuConfig from './config'
import * as Regular from 'regularjs'
import filter from 'js/filter'
import server from 'js/server'
import * as JR from 'jr-ui'
export default {
  template:
    '<jr-sidebar uniqueOpened={uniqueOpened} showRetract={false} top={ "15px"} menus={menus} ref="slider" />',
  data: {
    menus: []
  },
  config() {
    // 做下基础的容错
    window.enmus = {}
    // 因为身份不一样，菜单权限也不一样，所以，通过后端获取菜单数据
    this.getDic()
    this.routerObj = {}
    this.$watch('menuList', val => {
      if (val) {
        const menuList = val
        this.data.menus = this.processMenuList(menuList)
        // 初始化路由
        this.createRoute(this.data.menus)
        this.stateMan.state(this.routerObj).start()
        this.injectMenu()
      }
    })
  },
  /**
   * 处理后端返回的菜单配置的数据结构
   * @param {array} menuList 后端的菜单配置数据
   * @return {array} 处理后的菜单配置
   */
  processMenuList(menuList) {
    const result = []
    for (const item of menuList) {
      const parent = {}
      parent.title = item.permissionName
      parent.icon = item.icon
      parent.open = true
      if (item.hasOwnProperty('childMenuList')) {
        const children = []
        for (const child of item.childMenuList) {
          children.push({
            title: child.permissionName,
            url: child.action,
            module: child.permissionCode
          })
        }
        parent.children = children
      }
      result.push(parent)
    }
    return result
  },
  init() {
    this.$inject('#menu')
  },
  /**
   * menu加内容
   */
  injectMenu() {
    let hash = window.location.hash
    hash = hash.length > 0 ? hash.substr(1) : hash
    if (hash.indexOf('?') !== -1) {
      hash = hash.substr(0, hash.indexOf('?'))
    }
    if (!this.routerObj[hash]) {
      window.location.href = '#' + (this.m || 'product')
    }
    this.$update()
  },
  /**
   * 获取数据字典
   */
  getDic() {
    // 引用的时候需要去获取数据字典
    server('/admin/enums.htm')
      .then(data => {
        if (data.code === '200') {
          window.enmus = Object.assign({}, data.result)
          for (var key in window.enmus) {
            window.enmus[key] =
              window.enmus[key] === null ? [] : window.enmus[key]
          }
        } else {
          JR.JRNotify['error'](data.msg || '获取数据字典失败')
        }
      })
      .catch(e => {
        JR.JRNotify['error']('获取数据字典失败')
        console.log(e)
      })
  },
  stateMan: null,
  currentModule: null,
  dicData: [],
  /**
   * 创建路由
   */
  createRoute(list) {
    this.stateMan = new stateman()
    list.forEach(item => {
      if (item.children) {
        this.createRoute(item.children)
        return
      }
      var m = item.url.slice(1)
      if (item.currentSelected) {
        this.m = m
      }
      this.routerObj[m] = {
        enter: () => {
          if (!item.module) {
            return
          }
          var req = require.context('../page', true, /^\.\/.*\.js$/)
          var Module = Regular.extend(req(item.module).default).filter(filter)

          // var Module = Regular.extend(item.module.default)
          this.currentModule = new Module()
          this.changeView(item)
        },
        leave: () => {
          if (this.currentModule) {
            this.currentModule.$inject(false)
            this.currentModule.destroy()
          }
        },
        update: () => {
          console.log('update the view: ' + m)
        }
      }
    })
  },
  /**
   * 更改内容
   */
  changeView: function(item) {
    this.currentModule.data = Object.assign(
      {},
      this.currentModule.data,
      window.enmus
    )
    this.currentModule.$inject('#main')
    window.setTimeout(() => {
      this.$refs.slider && this.$refs.slider.selecteItem(item.url)
      this.$update()
    }, 0)
  }
}
