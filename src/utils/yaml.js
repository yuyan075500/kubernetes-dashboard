import yaml from 'js-yaml'

export function formatYAML(value) {
  try {
    // 把字符串转换为YAML对象
    const obj = yaml.load(value)
    // 再把YAML对象转换为格式化后的字符串
    return yaml.dump(obj, { indent: 2, lineWidth: -1 })
  } catch (e) {
    console.error(e)
    return value
  }
}
