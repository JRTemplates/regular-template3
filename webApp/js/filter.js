/**
 * 通用过滤器
 * hzxiongxu
 */
const filterObj = {
  // 格式化时间
  dateFormat: function(date, format) {
    if (!date) {
      return ''
    }
    if (typeof date === 'string') {
      date = date.replace(new RegExp(/-/gm), '/')
    }
    date = new Date(date)
    if (date.toString() === 'Invalid Date') {
      return date
    }
    format = format || 'YYYY-MM-dd hh:mm:ss'
    var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3) // 季度
    }
    if (/(Y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    if (/(S+)/.test(format)) {
      let ms = date.getMilliseconds() + ''
      let l1 = ms.length
      let l2 = RegExp.$1.length
      format = format.replace(
        RegExp.$1,
        l1 >= l2 ? ms.substr(3 - l2) : ms + '000'.substr(l1 - l2)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ?
            o[k] :
            ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return format
  },
  // 数字格式化为带逗号的钱,保留2位小数
  moneyFormat: function(m, u = '元') {
    if (!m) {
      return 0.0
    }
    return (+m).toFixed(2).replace(/\B(?=(\d{3})+\b)/g, ',') + u
  },
  // 枚举的数组字典转换
  dicTrans: function(key, type) {
    if (!window.enmus[type] || !Array.isArray(window.enmus[type])) {
      return key
    }
    for (const value of window.enmus[type]) {
      if (value.id === key) {
        return value.name
      }
    }
    return key
  },
  // 格式转换20170508转成2017-05-28
  strToDate: function(str) {
    if (!str || str.length !== 8) {
      return str
    }
    str = str + ''
    return str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2)
  }
}
export default filterObj
