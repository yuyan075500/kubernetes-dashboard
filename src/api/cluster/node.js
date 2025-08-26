import request from '@/utils/request'

// 获取节点列表
export function getNodeList(params) {
  return request({
    url: '/api/v1/kubernetes/nodes',
    method: 'get',
    params
  })
}
