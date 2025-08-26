import request from '@/utils/request'

// 获取Service列表
export function getServiceList(params) {
  return request({
    url: '/api/v1/kubernetes/services',
    method: 'get',
    params
  })
}
