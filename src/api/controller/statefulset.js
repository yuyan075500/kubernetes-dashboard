import request from '@/utils/request'

// 新增 StatefulSet
export function addStatefulSet(data) {
  return request({
    url: '/api/v1/kubernetes/statefulSet',
    method: 'post',
    data
  })
}

// 删除 StatefulSet
export function deleteStatefulSet(data) {
  return request({
    url: '/api/v1/kubernetes/statefulSet/batchDelete',
    method: 'delete',
    data
  })
}

// 修改 StatefulSet
export function updateStatefulSet(data) {
  return request({
    url: '/api/v1/kubernetes/statefulSet',
    method: 'put',
    data
  })
}

// 获取 StatefulSet 表
export function getStatefulSetList(params) {
  return request({
    url: '/api/v1/kubernetes/statefulSets',
    method: 'get',
    params
  })
}

// 获取 StatefulSet YAML
export function getStatefulSetYAML(value) {
  return request({
    url: '/api/v1/kubernetes/statefulSet/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
