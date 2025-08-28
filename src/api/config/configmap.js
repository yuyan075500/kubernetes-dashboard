import request from '@/utils/request'

// 获取ConfigMap列表
export function getConfigMapList(params) {
  return request({
    url: '/api/v1/kubernetes/configMaps',
    method: 'get',
    params
  })
}

// 获取ConfigMap YAML
export function getConfigMapYAML(value) {
  return request({
    url: '/api/v1/kubernetes/configMap/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
