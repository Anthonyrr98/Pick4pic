import { useEffect, useState, useMemo } from 'react'
import PageHero from '../components/PageHero'
import ArticleDetail from '../components/ArticleDetail'
import YearMonthFilterCompact from '../components/YearMonthFilterCompact'
import SearchBar from '../components/SearchBar'
import TagFilter from '../components/TagFilter'
import SEOHead from '../components/SEOHead'
import { useLanguage } from '../contexts/LanguageContext'
import { getArticles } from '../services/dataService'
import { groupByYearMonth, getYearMonthCategories } from '../utils/dateUtils'
import { searchArticles, highlightTextJSX } from '../utils/searchUtils'
import { extractTagsFromArticles, filterArticlesByTags } from '../utils/tagUtils'

const ArticlesPage = () => {
  const [articles, setArticles] = useState(getArticles().filter(a => (a.status || 'published') === 'published'))
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [, t] = useLanguage()

  useEffect(() => {
    const interval = setInterval(() => {
      setArticles(getArticles().filter(a => (a.status || 'published') === 'published'))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // 获取分类列表
  const categories = useMemo(() => getYearMonthCategories(articles, 'date'), [articles])

  // 获取标签列表
  const tags = useMemo(() => extractTagsFromArticles(articles), [articles])

  // 切换标签选择
  const handleToggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    )
  }

  // 按分类分组
  const groupedArticles = useMemo(() => groupByYearMonth(articles, 'date'), [articles])

  // 筛选后的文章（分类 + 搜索 + 标签）
  const filteredArticles = useMemo(() => {
    let result = articles

    // 先按分类筛选
    if (selectedCategory) {
      const group = groupedArticles.find((g) => g.key === selectedCategory)
      result = group ? group.items : []
    }

    // 再按标签筛选
    if (selectedTags.length > 0) {
      result = filterArticlesByTags(result, selectedTags)
    }

    // 最后按搜索关键词筛选
    if (searchQuery) {
      result = searchArticles(result, searchQuery)
    }

    return result
  }, [selectedCategory, selectedTags, searchQuery, articles, groupedArticles])

  return (
    <div className="page">
      <SEOHead
        title={t('articles')}
        description="分享最近写下的内容"
        type="blog"
      />
      <PageHero title={t('articles')} subtitle="分享最近写下的内容" />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <SearchBar onSearch={setSearchQuery} placeholder={t('searchArticles')} />
        {categories.length > 0 && (
          <YearMonthFilterCompact
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}
      </div>

      {searchQuery && (
        <div style={{ marginBottom: '1rem', color: '#666' }}>
          {t('found')} {filteredArticles.length} {t('articlesFound')}
        </div>
      )}

      {selectedCategory || searchQuery ? (
        // 显示筛选后的文章
        <div className="article-grid">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <article
                key={article.id}
                className="article-card article-card--stacked"
                onClick={() => setSelectedArticle(article)}
              >
                <img src={article.image} alt={article.title} loading="lazy" />
                <div>
                  <p className="article-card__meta">{article.date}</p>
                  <h2>{searchQuery ? highlightTextJSX(article.title, searchQuery) : article.title}</h2>
                  <p>{searchQuery ? highlightTextJSX(article.summary, searchQuery) : article.summary}</p>
                  <div className="article-card__footer">
                    <span>{searchQuery ? highlightTextJSX(article.tag, searchQuery) : article.tag}</span>
                    <span>{'★'.repeat(article.rating)}</span>
                  </div>
                </div>
                <div className="article-card__hover-indicator">点击查看详情 →</div>
              </article>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#999' }}>
              {t('noResults')}
            </div>
          )}
        </div>
      ) : (
        // 按分类分组显示
        <div className="articles-grouped">
          {groupedArticles.map((group) => (
            <div key={group.key} className="articles-group">
              <h2 className="articles-group__title">{group.display}</h2>
              <div className="article-grid">
                {group.items.map((article) => (
                  <article
                    key={article.id}
                    className="article-card article-card--stacked"
                    onClick={() => setSelectedArticle(article)}
                  >
                    <img src={article.image} alt={article.title} loading="lazy" />
                    <div>
                      <p className="article-card__meta">{article.date}</p>
                      <h2>{searchQuery ? highlightTextJSX(article.title, searchQuery) : article.title}</h2>
                      <p>{searchQuery ? highlightTextJSX(article.summary, searchQuery) : article.summary}</p>
                      <div className="article-card__footer">
                        <span>{searchQuery ? highlightTextJSX(article.tag, searchQuery) : article.tag}</span>
                        <span>{'★'.repeat(article.rating)}</span>
                      </div>
                    </div>
                    <div className="article-card__hover-indicator">点击查看详情 →</div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedArticle && (
        <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}

export default ArticlesPage

