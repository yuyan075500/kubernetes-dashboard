import request from '@/utils/request'

// 获取名称空间列表
export function getNamespaceList(params) {
  return request({
    url: '/api/v1/kubernetes/namespace',
    method: 'get',
    params
  })
}
