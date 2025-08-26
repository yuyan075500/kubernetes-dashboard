import request from '@/utils/request'

// 获取StorageClass列表
export function getStorageClassList(params) {
  return request({
    url: '/api/v1/kubernetes/storageClasses',
    method: 'get',
    params
  })
}
