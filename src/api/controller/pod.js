import request from '@/utils/request'

// 获取名称空间列表
export function getPodList(params) {
  return request({
    url: '/api/v1/kubernetes/pod',
    method: 'get',
    params
  })
}
