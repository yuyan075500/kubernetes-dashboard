import request from '@/utils/request'

// 获取名称空间列表
export function getDeploymentList(params) {
  return request({
    url: '/api/v1/kubernetes/deployment',
    method: 'get',
    params
  })
}
