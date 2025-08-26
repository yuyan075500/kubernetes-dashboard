import request from '@/utils/request'

// 获取StatefulSet表
export function getStatefulSetList(params) {
  return request({
    url: '/api/v1/kubernetes/statefulSets',
    method: 'get',
    params
  })
}
