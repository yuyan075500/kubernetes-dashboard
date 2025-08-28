import request from '@/utils/request'

// 获取Ingress列表
export function getIngressList(params) {
  return request({
    url: '/api/v1/kubernetes/ingresses',
    method: 'get',
    params
  })
}

// 获取Ingress YAML
export function getIngressYAML(value) {
  return request({
    url: '/api/v1/kubernetes/ingress/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
