import { useEffect } from 'react'
import './DiaryDetail.css'

const DiaryDetail = ({ post, onClose }) => {
  useEffect(() => {
    // 阻止背景滚动
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!post) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="diary-detail-overlay" onClick={handleBackdropClick}>
      <div className="diary-detail-modal">
        <button className="diary-detail-close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        
        <div className="diary-detail-header">
          <p className="diary-detail-date">{post.date}</p>
          <h1 className="diary-detail-title">{post.title}</h1>
        </div>

        <div className="diary-detail-content">
          {post.content && post.content.length > 0 && (
            <div className="diary-detail-text">
              {post.content.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}

          {post.gallery && post.gallery.length > 0 && (
            <div className="diary-detail-gallery">
              {post.gallery.map((image, index) => (
                <img key={index} src={image} alt={`${post.title} - ${index + 1}`} loading="lazy" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DiaryDetail

