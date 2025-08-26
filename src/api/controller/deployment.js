import request from '@/utils/request'

// 获取Deployment列表
export function getDeploymentList(params) {
  return request({
    url: '/api/v1/kubernetes/deployments',
    method: 'get',
    params
  })
}
