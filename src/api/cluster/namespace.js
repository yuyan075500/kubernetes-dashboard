import request from '@/utils/request'

// 获取名称空间列表
export function getNamespaceList(params) {
  return request({
    url: '/api/v1/kubernetes/namespace',
    method: 'get',
    params
  })
}

// 获取名称空间列表（所有）
export function getNamespaceListAll(params) {
  return request({
    url: '/api/v1/kubernetes/namespace/all',
    method: 'get',
    params
  })
}
