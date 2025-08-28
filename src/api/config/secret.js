import request from '@/utils/request'

// 获取Secret列表
export function getSecretList(params) {
  return request({
    url: '/api/v1/kubernetes/secrets',
    method: 'get',
    params
  })
}

// 获取Secret YAML
export function getSecretYAML(value) {
  return request({
    url: '/api/v1/kubernetes/secret/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
