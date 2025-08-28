import request from '@/utils/request'

// 获取PersistentVolumeClaim列表
export function getPersistentVolumeClaimList(params) {
  return request({
    url: '/api/v1/kubernetes/persistentVolumeClaims',
    method: 'get',
    params
  })
}

// 获取PersistentVolumeClaim YAML
export function getPersistentVolumeClaimYAML(value) {
  return request({
    url: '/api/v1/kubernetes/persistentVolumeClaim/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
