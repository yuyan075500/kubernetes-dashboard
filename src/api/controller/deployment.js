import request from '@/utils/request'

// 新增 Deployment
export function addDeployment(data) {
  return request({
    url: '/api/v1/kubernetes/deployment',
    method: 'post',
    data
  })
}

// 删除 Deployment
export function deleteDeployments(data) {
  return request({
    url: '/api/v1/kubernetes/deployment/batchDelete',
    method: 'delete',
    data
  })
}

// 获取 Deployment 列表
export function getDeploymentList(params) {
  return request({
    url: '/api/v1/kubernetes/deployments',
    method: 'get',
    params
  })
}

// 获取 Deployment YAML
export function getDeploymentYAML(value) {
  return request({
    url: '/api/v1/kubernetes/deployment/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
