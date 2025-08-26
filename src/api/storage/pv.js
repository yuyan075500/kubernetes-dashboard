import request from '@/utils/request'

// 获取PersistentVolume列表
export function getPersistentVolumeList(params) {
  return request({
    url: '/api/v1/kubernetes/persistentVolumes',
    method: 'get',
    params
  })
}
