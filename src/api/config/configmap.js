import request from '@/utils/request'

// 获取ConfigMap列表
export function getConfigMapList(params) {
  return request({
    url: '/api/v1/kubernetes/configMap',
    method: 'get',
    params
  })
}
