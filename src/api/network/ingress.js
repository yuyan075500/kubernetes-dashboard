import request from '@/utils/request'

// 获取Ingress列表
export function getIngressList(params) {
  return request({
    url: '/api/v1/kubernetes/ingress',
    method: 'get',
    params
  })
}
