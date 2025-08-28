import request from '@/utils/request'

// 获取StatefulSet表
export function getStatefulSetList(params) {
  return request({
    url: '/api/v1/kubernetes/statefulSets',
    method: 'get',
    params
  })
}

// 获取StatefulSet YAML
export function getStatefulSetYAML(value) {
  return request({
    url: '/api/v1/kubernetes/statefulSet/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
