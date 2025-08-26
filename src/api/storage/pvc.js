import request from '@/utils/request'

// 获取PersistentVolumeClaim列表
export function getPersistentVolumeClaimList(params) {
  return request({
    url: '/api/v1/kubernetes/persistentVolumeClaims',
    method: 'get',
    params
  })
}
