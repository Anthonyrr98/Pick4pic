import { useEffect, useState } from 'react'
import MarkdownViewer from './MarkdownViewer'
import CommentSection from './CommentSection'
import './ArticleDetail.css'

const CodeCopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        padding: '0.25rem 0.5rem',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.75rem',
        zIndex: 10,
      }}
    >
      {copied ? '已复制!' : '复制'}
    </button>
  )
}

const ArticleDetail = ({ article, onClose }) => {
  useEffect(() => {
    // 阻止背景滚动
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!article) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="article-detail-overlay" onClick={handleBackdropClick}>
      <div className="article-detail-modal">
        <button className="article-detail-close" onClick={onClose} aria-label="关闭">
          ×
        </button>
        
        <div className="article-detail-header">
          <div className="article-detail-meta">
            <span className="article-detail-date">{article.date}</span>
            <span className="article-detail-rating">{'★'.repeat(article.rating || 5)}</span>
          </div>
          <h1 className="article-detail-title">{article.title}</h1>
          {article.tag && (
            <span className="article-detail-tag">{article.tag}</span>
          )}
        </div>

        {article.image && (
          <div className="article-detail-image">
            <img 
              src={article.image} 
              alt={article.title} 
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        )}

        <div className="article-detail-content">
          <p className="article-detail-summary">{article.summary}</p>
          
          {article.content && article.content.length > 0 && (
            <div className="article-detail-text">
              {article.markdown ? (
                <MarkdownViewer content={article.content.join('\n\n')} />
              ) : (
                article.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              )}
            </div>
          )}

          {article.gallery && article.gallery.length > 0 && (
            <div className="article-detail-gallery">
              {article.gallery.map((image, index) => (
                <img key={index} src={image} alt={`${article.title} - ${index + 1}`} loading="lazy" />
              ))}
            </div>
          )}

          {article.code && (
            <div className="article-detail-code" style={{ position: 'relative' }}>
              <CodeCopyButton code={article.code} />
              <pre><code>{article.code}</code></pre>
            </div>
          )}

          {article.links && article.links.length > 0 && (
            <div className="article-detail-links">
              <h3>相关链接</h3>
              <ul>
                {article.links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.title || link.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <CommentSection articleId={article.id} />
        </div>
      </div>
    </div>
  )
}

export default ArticleDetail

