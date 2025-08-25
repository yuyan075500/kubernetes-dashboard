import request from '@/utils/request'

// 获取Pod列表
export function getPodList(params) {
  return request({
    url: '/api/v1/kubernetes/pod',
    method: 'get',
    params
  })
}
