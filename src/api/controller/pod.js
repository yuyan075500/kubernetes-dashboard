import request from '@/utils/request'

// 删除 Pod
export function deletePods(data) {
  return request({
    url: '/api/v1/kubernetes/pod/batchDelete',
    method: 'delete',
    data
  })
}

// 获取 Pod 列表
export function getPodList(params) {
  return request({
    url: '/api/v1/kubernetes/pods',
    method: 'get',
    params
  })
}

// 获取 Pod YAML
export function getPodYAML(value) {
  return request({
    url: '/api/v1/kubernetes/pod/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
