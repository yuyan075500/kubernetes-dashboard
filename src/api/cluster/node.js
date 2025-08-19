import request from '@/utils/request'

// 获取名称空间列表
export function getNodeList(params) {
  return request({
    url: '/api/v1/kubernetes/node',
    method: 'get',
    params
  })
}
