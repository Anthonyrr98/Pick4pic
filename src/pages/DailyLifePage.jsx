import { useEffect, useState, useMemo } from 'react'
import PageHero from '../components/PageHero'
import YearMonthFilterCompact from '../components/YearMonthFilterCompact'
import DiaryDetail from '../components/DiaryDetail'
import SearchBar from '../components/SearchBar'
import SEOHead from '../components/SEOHead'
import { useLanguage } from '../contexts/LanguageContext'
import { getDiaryPosts } from '../services/dataService'
import { groupByYearMonth, getYearMonthCategories } from '../utils/dateUtils'
import { searchDiaryPosts } from '../utils/searchUtils'

const DailyLifePage = () => {
  const [diaryPosts, setDiaryPosts] = useState(getDiaryPosts())
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [, t] = useLanguage()

  useEffect(() => {
    const interval = setInterval(() => {
      setDiaryPosts(getDiaryPosts())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // 获取分类列表
  const categories = useMemo(() => getYearMonthCategories(diaryPosts, 'date'), [diaryPosts])

  // 按分类分组
  const groupedPosts = useMemo(() => groupByYearMonth(diaryPosts, 'date'), [diaryPosts])

  // 筛选后的记录（分类 + 搜索）
  const filteredPosts = useMemo(() => {
    let result = diaryPosts

    // 先按分类筛选
    if (selectedCategory) {
      const group = groupedPosts.find((g) => g.key === selectedCategory)
      result = group ? group.items : []
    }

    // 再按搜索关键词筛选
    if (searchQuery) {
      result = searchDiaryPosts(result, searchQuery)
    }

    return result
  }, [selectedCategory, searchQuery, diaryPosts, groupedPosts])

  const getCoverImage = (post) => {
    if (post.coverImage) return post.coverImage
    if (post.gallery && post.gallery.length > 0) return post.gallery[0]
    if (post.image) return post.image
    return null
  }

  const mapPostsToPhotos = (posts) => {
    return posts.flatMap((post) => {
      const gallery = post.gallery && post.gallery.length > 0 ? post.gallery : []
      if (gallery.length > 0) {
        return gallery.map((photo, index) => ({
          id: `${post.id}-photo-${index}`,
          photoUrl: photo,
          post,
        }))
      }

      const cover = getCoverImage(post)
      if (cover) {
        return [{
          id: `${post.id}-cover`,
          photoUrl: cover,
          post,
        }]
      }

      return [{
        id: `${post.id}-placeholder`,
        photoUrl: null,
        post,
        placeholderText: post.title?.slice(0, 1) || '日',
      }]
    })
  }

  const renderPhotoGrid = (posts) => {
    const photoEntries = mapPostsToPhotos(posts)

    if (!photoEntries || photoEntries.length === 0) {
      return (
        <div className="diary-empty">
          {t('noResults')}
        </div>
      )
    }

    return (
      <div className="diary-photo-grid">
        {photoEntries.map((entry) => (
          <article
            key={entry.id}
            className={`diary-photo-card ${entry.photoUrl ? '' : 'diary-photo-card--placeholder'}`}
            onClick={() => setSelectedPost(entry.post)}
          >
            {entry.photoUrl ? (
              <>
                <img src={entry.photoUrl} alt={entry.post.title} loading="lazy" />
                <div className="diary-photo-card__overlay">
                  <span>{entry.post.date}</span>
                  <h3>{entry.post.title}</h3>
                </div>
              </>
            ) : (
              <div className="diary-photo-card__placeholder">
                <span>{entry.placeholderText}</span>
                <p>{entry.post.title}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className="page">
      <SEOHead
        title={t('dailyLife')}
        description="这大概就是我的生活吧"
        type="blog"
      />
      <PageHero title={t('dailyLife')} subtitle="这大概就是我的生活吧" />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <SearchBar onSearch={setSearchQuery} placeholder={t('searchDiary')} />
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
          {t('found')} {filteredPosts.length} {t('recordsFound')}
        </div>
      )}

      {selectedCategory || searchQuery ? (
        renderPhotoGrid(filteredPosts)
      ) : (
        <div className="diary-grouped">
          {groupedPosts.map((group) => (
            <div key={group.key} className="diary-group">
              <h2 className="diary-group__title">{group.display}</h2>
              {renderPhotoGrid(group.items)}
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <DiaryDetail post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}

export default DailyLifePage

