import { useEffect, useState } from 'react'
import Timeline from '../components/Timeline'
import PageHero from '../components/PageHero'
import ArticleDetail from '../components/ArticleDetail'
import SEOHead from '../components/SEOHead'
import {
  getProfile,
  getTimeline,
  getIntroNotes,
  getSocialLinks,
  getArticles,
} from '../services/dataService'

const HomePage = () => {
  const [profile, setProfile] = useState(getProfile())
  const [timelineEntries, setTimelineEntries] = useState(getTimeline())
  const [introNotes, setIntroNotes] = useState(getIntroNotes())
  const [socialLinks, setSocialLinks] = useState(getSocialLinks())
  const [articles, setArticles] = useState(getArticles())
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    // 监听 localStorage 变化（简单实现，实际可以使用事件或状态管理）
    const interval = setInterval(() => {
      setProfile(getProfile())
      setTimelineEntries(getTimeline())
      setIntroNotes(getIntroNotes())
      setSocialLinks(getSocialLinks())
      setArticles(getArticles())
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page">
      <SEOHead
        title={profile.name}
        description={profile.tagline}
        image={articles[0]?.image}
      />
      <PageHero title={profile.name} subtitle={profile.motto} />
      <p className="page-intro">{profile.tagline}</p>

      <section className="section-card">
        <div className="section-head">
          <h2>时间线</h2>
          <span>过去与现在的交集</span>
        </div>
        <Timeline entries={timelineEntries} />
      </section>

      <section className="section-card">
        <div className="section-head">
          <h2>介绍</h2>
          <span>调味剂一样的生活片段</span>
        </div>
        <ul className="intro-list">
          {introNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="section-card">
        <div className="section-head">
          <h2>精选文章</h2>
          <span>最近在关注的主题</span>
        </div>
        <div className="article-grid">
          {articles.filter(a => (a.status || 'published') === 'published').slice(0, 3).map((article) => (
            <article
              key={article.id}
              className="article-card"
              onClick={() => setSelectedArticle(article)}
            >
              <img src={article.image} alt={article.title} loading="lazy" />
              <div>
                <p className="article-card__meta">{article.date}</p>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <p className="article-card__tag">{article.tag}</p>
              </div>
              <div className="article-card__hover-indicator">点击查看详情 →</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-head">
          <h2>我的社交平台</h2>
          <span>关注我就能收到最新消息</span>
        </div>
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url}>
              <span>{link.icon}</span>
              {link.name}
            </a>
          ))}
        </div>
      </section>

      {selectedArticle && (
        <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}

export default HomePage

