import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  // 获取 URL 参数 cluster
  const urlParams = new URLSearchParams(window.location.search)
  const cluster = urlParams.get('cluster')

  const { pathname } = window.location
  if (pathname === '/kubernetes/cluster/terminal') {
    const PodName = urlParams.get('PodName')
    return `终端-${PodName} - ${title}`
  } else if (cluster) {
    return `${cluster} - ${title}`
  } else if (pageTitle) {
    return `${pageTitle} - ${title}`
  }

  // 默认标题
  return `${title}`
}
