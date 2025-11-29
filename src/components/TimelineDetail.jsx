import { useEffect } from 'react'
import './TimelineDetail.css'

const TimelineDetail = ({ entry, onClose }) => {
  useEffect(() => {
    // 阻止背景滚动
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!entry) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="timeline-detail-overlay" onClick={handleBackdropClick}>
      <div className="timeline-detail-modal">
        <button className="timeline-detail-close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        
        <div className="timeline-detail-header">
          <span className="timeline-detail-year">{entry.year}</span>
          <h2 className="timeline-detail-title">{entry.title}</h2>
        </div>

        {entry.image && (
          <div className="timeline-detail-image">
            <img src={entry.image} alt={entry.title} />
          </div>
        )}

        <div className="timeline-detail-content">
          <p className="timeline-detail-description">{entry.description}</p>
          
          {entry.content && entry.content.length > 0 && (
            <div className="timeline-detail-text">
              {entry.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {entry.gallery && entry.gallery.length > 0 && (
            <div className="timeline-detail-gallery">
              {entry.gallery.map((image, index) => (
                <img key={index} src={image} alt={`${entry.title} - ${index + 1}`} loading="lazy" />
              ))}
            </div>
          )}

          {entry.tags && entry.tags.length > 0 && (
            <div className="timeline-detail-tags">
              {entry.tags.map((tag, index) => (
                <span key={index} className="timeline-detail-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TimelineDetail

