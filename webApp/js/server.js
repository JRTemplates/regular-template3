/**
 * fetch基类，主要是fetch方法
 * hzxiongxu
 */
import * as JR from 'jr-ui'
export default function(api, body, method) {
  let fetching
  if (method === 'post') {
    fetching = fetch(api, {
      method: 'post',
      credentials: 'include',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json'
      //   },
      headers: new Headers({
        'content-type': 'application/json',
        Accept: 'application/json'
      }),
      body: JSON.stringify(body)
    })
  } else {
    const toString = body ?
      Object.keys(body)
          .map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
          })
          .join('&') :
      ''
    fetching = fetch(`${api}?${toString}`, {
      method: 'get',
      credentials: 'include',
      //   headers: {
      //     'Accept': 'application/json'
      //   }
      headers: new Headers({ 'content-type': 'application/json' })
    })
  }
  // 结果码.200：成功 404：无数据 500：程序异常 401:未授权 402：登陆超时 403：未认证 422：数据校验失败
  return fetching.then(res => res.json()).then(res => {
    switch (('' + res.code).toUpperCase()) {
      // 成功
      case '200':
        return Promise.resolve(res)
      // 参数交易失败
      case '404':
        return Promise.resolve(res)
      // 无数据
      case '401':
        return Promise.resolve(res)
      // 未授权
      case '422':
        return Promise.resolve(res)
      case '403':
        return Promise.resolve(res)
      // 程序异常
      case '500':
        JR.JRNotify['error'](res.message || '程序异常')
        return Promise.reject(res)
      // 登录超时
      case '402':
        // 退出到openid
        window.location.href = '/login.htm'
        return Promise.reject(res)
      default:
        return Promise.resolve(res)
    }
  })
}
