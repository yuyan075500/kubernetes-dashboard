import request from '@/utils/request'

// 获取名称空间列表
export function getStatefulSetList(params) {
  return request({
    url: '/api/v1/kubernetes/statefulSet',
    method: 'get',
    params
  })
}
