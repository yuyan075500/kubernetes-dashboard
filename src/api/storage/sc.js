import request from '@/utils/request'

// 获取StorageClass列表
export function getStorageClassList(params) {
  return request({
    url: '/api/v1/kubernetes/storageClasses',
    method: 'get',
    params
  })
}

// 获取StorageClass YAML
export function getStorageClassYAML(value) {
  return request({
    url: '/api/v1/kubernetes/storageClass/' + value.metadata.name,
    method: 'get'
  })
}
