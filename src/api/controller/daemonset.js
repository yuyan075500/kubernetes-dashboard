import request from '@/utils/request'

// 获取DaemonSet列表
export function getDaemonSetList(params) {
  return request({
    url: '/api/v1/kubernetes/daemonSet',
    method: 'get',
    params
  })
}
