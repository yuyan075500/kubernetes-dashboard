import request from '@/utils/request'

// 获取名称空间列表
export function getDaemonSetList(params) {
  return request({
    url: '/api/v1/kubernetes/daemonSet',
    method: 'get',
    params
  })
}
