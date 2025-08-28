import request from '@/utils/request'

// 获取DaemonSet列表
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
