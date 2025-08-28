import yaml from 'js-yaml'

// 一级字段排序规则
const rootOrder = ['kind', 'apiVersion', 'metadata', 'data', 'type', 'spec', 'status']

// metadata 内二级字段排序规则
const metadataOrder = ['name', 'namespace', 'uid', 'generation', 'creationTimestamp', 'labels', 'annotations']

// 通用的对象排序函数
function sortObject(obj, order) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj
  }

  const sorted = {}

  // 先按照规则顺序放置
  order.forEach((key) => {
    if (Object.hasOwn(obj, key)) {
      sorted[key] = sortObject(
        obj[key],
        key === 'metadata' ? metadataOrder : []
      )
    }
  })

  // 再把剩余的字段附加上去
  Object.keys(obj).forEach((key) => {
    if (!order.includes(key)) {
      sorted[key] = sortObject(obj[key], key === 'metadata' ? metadataOrder : [])
    }
  })

  return sorted
}

export function formatYAML(value) {
  try {
    const obj = yaml.load(value)

    // 对根节点排序
    const sortedObj = sortObject(obj, rootOrder)

    // 转成 YAML
    return yaml.dump(sortedObj, { indent: 2, lineWidth: -1 })
  } catch (e) {
    console.error(e)
    return value
  }
}
