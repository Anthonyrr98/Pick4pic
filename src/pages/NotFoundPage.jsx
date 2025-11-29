// 404 页面
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import './NotFoundPage.css'

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <PageHero title="404" subtitle="页面未找到" />
      <div className="not-found-content">
        <div className="not-found-illustration">
          <div className="not-found-number">404</div>
          <p className="not-found-message">
            抱歉，您访问的页面不存在
          </p>
        </div>
        <div className="not-found-actions">
          <Link to="/" className="not-found-button not-found-button--primary">
            返回首页
          </Link>
          <Link to="/articles" className="not-found-button not-found-button--secondary">
            查看文章
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

