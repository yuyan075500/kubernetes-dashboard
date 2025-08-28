import request from '@/utils/request'

// 获取CronJob列表
export function getCronJobList(params) {
  return request({
    url: '/api/v1/kubernetes/cronJobs',
    method: 'get',
    params
  })
}

// 获取CronJob YAML
export function getCronJobYAML(value) {
  return request({
    url: '/api/v1/kubernetes/cronJob/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}

