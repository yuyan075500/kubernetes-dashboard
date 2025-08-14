import request from '@/utils/request'

// 获取当前登录的用户信息
export function getInfo() {
  return request({
    url: '/api/v1/user/info',
    method: 'get'
  })
}

// 用户注销
export function logout() {
  return request({
    url: '/api/auth/login',
    method: 'post'
  })
}
