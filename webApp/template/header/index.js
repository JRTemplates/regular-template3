// import  html from 'index.html'
import './index.scss'
import * as JR from 'jr-ui'
import * as html from './index.html'
export default {
  template: html,
  data: {
    userName: ''
  },
  init() {
    this.supr()
    this.$inject('#header')
    this.$update()
  },
  exit() {
    JR.Modal.confirm('确认退出吗?').$on('ok', () => {
      window.location.href = '/logout.htm'
    })
  }
}
