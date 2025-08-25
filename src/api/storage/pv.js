import request from '@/utils/request'

// 获取PersistentVolume列表
export function getPersistentVolumeList(params) {
  return request({
    url: '/api/v1/kubernetes/persistentVolume',
    method: 'get',
    params
  })
}
