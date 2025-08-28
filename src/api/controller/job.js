import request from '@/utils/request'

// 获取Job列表
export function getJobList(params) {
  return request({
    url: '/api/v1/kubernetes/jobs',
    method: 'get',
    params
  })
}

// 获取Job YAML
export function getJobYAML(value) {
  return request({
    url: '/api/v1/kubernetes/job/' + value.metadata.name + '?namespace=' + value.metadata.namespace,
    method: 'get'
  })
}
