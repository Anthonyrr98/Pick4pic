// 发布频率图表组件
import { useMemo } from 'react'
import './PublishFrequencyChart.css'

const PublishFrequencyChart = ({ articles, diaryPosts }) => {
  const chartData = useMemo(() => {
    const data = {}
    
    // 统计文章发布频率
    articles.forEach(article => {
      if ((article.status || 'published') === 'published') {
        const date = new Date(article.date)
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        data[month] = (data[month] || 0) + 1
      }
    })
    
    // 统计日记发布频率
    diaryPosts.forEach(post => {
      const date = new Date(post.date)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      data[month] = (data[month] || 0) + 1
    })
    
    // 转换为数组并排序
    return Object.entries(data)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12) // 只显示最近12个月
  }, [articles, diaryPosts])

  const maxCount = Math.max(...chartData.map(d => d.count), 1)

  return (
    <div className="publish-frequency-chart">
      <h3>发布频率（最近12个月）</h3>
      <div className="chart-container">
        {chartData.length > 0 ? (
          chartData.map((item, index) => (
            <div key={index} className="chart-bar-wrapper">
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{
                    height: `${(item.count / maxCount) * 100}%`,
                  }}
                  title={`${item.month}: ${item.count}篇`}
                >
                  <span className="chart-bar-value">{item.count}</span>
                </div>
              </div>
              <div className="chart-label">{item.month.split('-')[1]}月</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            暂无数据
          </p>
        )}
      </div>
    </div>
  )
}

export default PublishFrequencyChart

