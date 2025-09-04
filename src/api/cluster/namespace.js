import request from '@/utils/request'

// 新增名称空间
export function addNamespace(data) {
  return request({
    url: '/api/v1/kubernetes/namespace',
    method: 'post',
    data
  })
}

// 删除名称空间
export function deleteNamespace(data) {
  return request({
    url: '/api/v1/kubernetes/namespace/' + data.metadata.name,
    method: 'delete'
  })
}

// 获取名称空间列表
export function getNamespaceList(params) {
  return request({
    url: '/api/v1/kubernetes/namespaces',
    method: 'get',
    params
  })
}

// 获取名称空间列表（所有）
export function getNamespaceListAll() {
  return request({
    url: '/api/v1/kubernetes/namespace/all',
    method: 'get'
  })
}

// 获取名称空间YAML
export function getNamespaceYAML(value) {
  return request({
    url: '/api/v1/kubernetes/namespace/' + value.metadata.name,
    method: 'get'
  })
}
