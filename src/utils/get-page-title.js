import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  // 获取 URL 参数 cluster
  const urlParams = new URLSearchParams(window.location.search)
  const cluster = urlParams.get('cluster')

  // 如果有 cluster 参数，优先使用它作为标题
  if (cluster) {
    return `${cluster} - ${title}`
  }

  // 如果没有 cluster，使用 pageTitle
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }

  // 默认标题
  return `${title}`
}
