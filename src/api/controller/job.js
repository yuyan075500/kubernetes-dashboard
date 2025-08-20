import request from '@/utils/request'

// 获取名称空间列表
export function getJobList(params) {
  return request({
    url: '/api/v1/kubernetes/job',
    method: 'get',
    params
  })
}
