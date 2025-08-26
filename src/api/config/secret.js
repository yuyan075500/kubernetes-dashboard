import request from '@/utils/request'

// 获取Secret列表
export function getSecretList(params) {
  return request({
    url: '/api/v1/kubernetes/secrets',
    method: 'get',
    params
  })
}
