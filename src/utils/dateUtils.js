// 日期工具函数

// 从日期字符串中提取年份和月份
// 支持格式：'2023年5月3日 · 研究' 或 '2025年4月27号'
export const extractYearMonth = (dateString) => {
  if (!dateString) return null

  // 匹配年份和月份
  const match = dateString.match(/(\d{4})年(\d{1,2})月/)
  if (match) {
    const year = parseInt(match[1])
    const month = parseInt(match[2])
    return { year, month }
  }
  return null
}

// 获取年份-月份字符串，格式：'2023年5月'
export const getYearMonthString = (dateString) => {
  const ym = extractYearMonth(dateString)
  if (ym) {
    return `${ym.year}年${ym.month}月`
  }
  return '未分类'
}

// 获取年份-月份键，格式：'2023-05'（用于排序和分组）
export const getYearMonthKey = (dateString) => {
  const ym = extractYearMonth(dateString)
  if (ym) {
    return `${ym.year}-${String(ym.month).padStart(2, '0')}`
  }
  return '0000-00'
}

// 按年份-月份分组数据
export const groupByYearMonth = (items, dateField = 'date') => {
  const groups = {}
  
  items.forEach((item) => {
    const dateStr = item[dateField]
    const key = getYearMonthKey(dateStr)
    const displayStr = getYearMonthString(dateStr)
    
    if (!groups[key]) {
      groups[key] = {
        key,
        display: displayStr,
        year: extractYearMonth(dateStr)?.year || 0,
        month: extractYearMonth(dateStr)?.month || 0,
        items: [],
      }
    }
    groups[key].items.push(item)
  })
  
  // 转换为数组并按时间倒序排序
  return Object.values(groups).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })
}

// 获取所有可用的年份-月份分类
export const getYearMonthCategories = (items, dateField = 'date') => {
  const grouped = groupByYearMonth(items, dateField)
  return grouped.map((group) => ({
    key: group.key,
    display: group.display,
    count: group.items.length,
  }))
}

