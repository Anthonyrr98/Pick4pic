import { useState, useEffect } from 'react'
import { getComments, saveComments, addComment } from '../services/commentService'
import './CommentSection.css'

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState({ author: '', content: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setComments(getComments(articleId))
  }, [articleId])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment.author.trim() || !newComment.content.trim()) {
      alert('请填写昵称和评论内容')
      return
    }

    const comment = {
      id: `comment-${Date.now()}`,
      articleId,
      author: newComment.author.trim(),
      content: newComment.content.trim(),
      date: new Date().toLocaleString('zh-CN'),
      replies: [],
    }

    addComment(articleId, comment)
    setComments(getComments(articleId))
    setNewComment({ author: '', content: '' })
    setShowForm(false)
  }

  const handleReply = (commentId, replyContent, replyAuthor) => {
    if (!replyAuthor.trim() || !replyContent.trim()) {
      alert('请填写昵称和回复内容')
      return
    }

    const reply = {
      id: `reply-${Date.now()}`,
      author: replyAuthor.trim(),
      content: replyContent.trim(),
      date: new Date().toLocaleString('zh-CN'),
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...(comment.replies || []), reply] }
      }
      return comment
    })

    saveComments(articleId, updatedComments)
    setComments(updatedComments)
  }

  return (
    <div className="comment-section">
      <div className="comment-section__header">
        <h3>评论 ({comments.length})</h3>
        <button onClick={() => setShowForm(!showForm)} className="comment-section__toggle">
          {showForm ? '取消' : '写评论'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="comment-section__form">
          <div className="comment-section__form-group">
            <label>昵称</label>
            <input
              type="text"
              value={newComment.author}
              onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
              placeholder="你的昵称"
              required
            />
          </div>
          <div className="comment-section__form-group">
            <label>评论</label>
            <textarea
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              placeholder="写下你的想法..."
              rows="4"
              required
            />
          </div>
          <div className="comment-section__form-actions">
            <button type="submit" className="comment-section__submit">
              发布
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="comment-section__cancel">
              取消
            </button>
          </div>
        </form>
      )}

      <div className="comment-section__list">
        {comments.length === 0 ? (
          <p className="comment-section__empty">还没有评论，来第一个吧~</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>
    </div>
  )
}

const CommentItem = ({ comment, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replyAuthor, setReplyAuthor] = useState('')

  const handleReplySubmit = (e) => {
    e.preventDefault()
    onReply(comment.id, replyContent, replyAuthor)
    setReplyContent('')
    setReplyAuthor('')
    setShowReplyForm(false)
  }

  return (
    <div className="comment-item">
      <div className="comment-item__header">
        <span className="comment-item__author">{comment.author}</span>
        <span className="comment-item__date">{comment.date}</span>
      </div>
      <div className="comment-item__content">{comment.content}</div>
      <button
        onClick={() => setShowReplyForm(!showReplyForm)}
        className="comment-item__reply-btn"
      >
        回复
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="comment-item__reply-form">
          <input
            type="text"
            value={replyAuthor}
            onChange={(e) => setReplyAuthor(e.target.value)}
            placeholder="你的昵称"
            required
          />
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="写下回复..."
            rows="2"
            required
          />
          <div>
            <button type="submit">发送</button>
            <button type="button" onClick={() => setShowReplyForm(false)}>
              取消
            </button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-item__replies">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="comment-item__reply">
              <span className="comment-item__author">{reply.author}</span>
              <span className="comment-item__date">{reply.date}</span>
              <div className="comment-item__content">{reply.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection

