import { useState } from 'react'
import './YearMonthFilterCompact.css'

const YearMonthFilterCompact = ({ categories, selectedCategory, onSelectCategory }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // 按年份分组
  const groupedByYear = categories.reduce((acc, category) => {
    const year = category.key.split('-')[0]
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(category)
    return acc
  }, {})

  const years = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a))
  
  // 获取当前选中的显示文本
  const selectedText = selectedCategory
    ? categories.find(c => c.key === selectedCategory)?.display || '选择月份'
    : '全部'

  return (
    <div className="year-month-filter-compact">
      <div className="year-month-filter-compact__header">
        <button
          className={`year-month-filter-compact__toggle ${!selectedCategory ? 'active' : ''}`}
          onClick={() => {
            onSelectCategory(null)
            setIsExpanded(false)
          }}
        >
          全部
        </button>
        <div className="year-month-filter-compact__dropdown">
          <button
            className="year-month-filter-compact__trigger"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>{selectedText}</span>
            <span className="year-month-filter-compact__arrow">{isExpanded ? '▲' : '▼'}</span>
          </button>
          {isExpanded && (
            <div className="year-month-filter-compact__menu">
              {years.map((year) => (
                <div key={year} className="year-month-filter-compact__year-section">
                  <div className="year-month-filter-compact__year-label">{year}年</div>
                  <div className="year-month-filter-compact__months">
                    {groupedByYear[year].map((category) => (
                      <button
                        key={category.key}
                        className={`year-month-filter-compact__month-item ${selectedCategory === category.key ? 'active' : ''}`}
                        onClick={() => {
                          onSelectCategory(category.key)
                          setIsExpanded(false)
                        }}
                      >
                        {category.display.replace(year + '年', '')}
                        <span className="year-month-filter-compact__month-count">({category.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YearMonthFilterCompact

