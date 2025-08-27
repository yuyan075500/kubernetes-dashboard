import request from '@/utils/request'

// 获取节点列表
export function getNodeList(params) {
  return request({
    url: '/api/v1/kubernetes/nodes',
    method: 'get',
    params
  })
}

// 获取节点YAML
export function getNodeYAML(value) {
  return request({
    url: '/api/v1/kubernetes/node/' + value.metadata.name,
    method: 'get'
  })
}
