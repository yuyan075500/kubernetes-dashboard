import request from '@/utils/request'

// 获取Endpoint列表
export function getEndpointList(params) {
  return request({
    url: '/api/v1/kubernetes/endpoints',
    method: 'get',
    params
  })
}
