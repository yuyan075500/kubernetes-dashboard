import request from '@/utils/request'

// 获取Endpoint列表
export function getEndpointList(params) {
  return request({
    url: '/api/v1/kubernetes/endpoints',
    method: 'get',
    params
  })
}

// 获取Endpoint YAML
export function getEndpointYAML(value) {
  return request({
    url: '/api/v1/kubernetes/endpoint/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
