import request from '@/utils/request'

// 新增 DaemonSet
export function addDaemonSet(data) {
  return request({
    url: '/api/v1/kubernetes/daemonSet',
    method: 'post',
    data
  })
}

// 删除 DaemonSet
export function deleteDaemonSets(data) {
  return request({
    url: '/api/v1/kubernetes/daemonSet/batchDelete',
    method: 'delete',
    data
  })
}

// 修改 DaemonSet
export function updateDaemonSet(data) {
  return request({
    url: '/api/v1/kubernetes/daemonSet',
    method: 'put',
    data
  })
}

// 获取 DaemonSet 列表
export function getDaemonSetList(params) {
  return request({
    url: '/api/v1/kubernetes/daemonSets',
    method: 'get',
    params
  })
}

// 获取DaemonSet YAML
export function getDaemonSetYAML(value) {
  return request({
    url: '/api/v1/kubernetes/daemonSet/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
