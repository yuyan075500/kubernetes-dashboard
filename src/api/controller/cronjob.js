import request from '@/utils/request'

// 获取CronJob列表
export function getCronJobList(params) {
  return request({
    url: '/api/v1/kubernetes/cronJob',
    method: 'get',
    params
  })
}
