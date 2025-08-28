import request from '@/utils/request'

// 获取Deployment列表
export function getDeploymentList(params) {
  return request({
    url: '/api/v1/kubernetes/deployments',
    method: 'get',
    params
  })
}

// 获取Deployment YAML
export function getDeploymentYAML(value) {
  return request({
    url: '/api/v1/kubernetes/deployment/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
