import { useEffect } from 'react'
import { generateRSS, downloadRSS } from '../utils/rssGenerator'

const RSSPage = () => {
  useEffect(() => {
    // 自动下载 RSS
    downloadRSS()
  }, [])

  return (
    <div className="page">
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h1>RSS 订阅</h1>
        <p>RSS 文件已自动下载</p>
        <button onClick={downloadRSS} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#1e3a34', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          重新下载 RSS
        </button>
      </div>
    </div>
  )
}

export default RSSPage

