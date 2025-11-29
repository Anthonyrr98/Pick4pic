import './YearMonthFilter.css'

const YearMonthFilter = ({ categories, selectedCategory, onSelectCategory }) => {
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

  return (
    <div className="year-month-filter">
      <div className="year-month-filter__container">
        <button
          className={`year-month-filter__all ${!selectedCategory ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          <span className="year-month-filter__all-text">全部</span>
        </button>
        
        {years.map((year) => (
          <div key={year} className="year-month-filter__year-group">
            <h3 className="year-month-filter__year-title">{year}年</h3>
            <div className="year-month-filter__grid">
              {groupedByYear[year].map((category) => (
                <button
                  key={category.key}
                  className={`year-month-filter__card ${selectedCategory === category.key ? 'active' : ''}`}
                  onClick={() => onSelectCategory(category.key)}
                >
                  <span className="year-month-filter__month">{category.display.replace(year + '年', '')}</span>
                  <span className="year-month-filter__count">{category.count}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default YearMonthFilter

