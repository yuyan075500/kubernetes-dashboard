import request from '@/utils/request'

// 获取Service列表
export function getServiceList(params) {
  return request({
    url: '/api/v1/kubernetes/services',
    method: 'get',
    params
  })
}

// 获取Service YAML
export function getServiceYAML(value) {
  return request({
    url: '/api/v1/kubernetes/service/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
