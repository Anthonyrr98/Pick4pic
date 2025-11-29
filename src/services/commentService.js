// 评论服务 - 使用 localStorage 保存评论
import { saveToDB, loadFromDB } from './storageService'

const COMMENTS_PREFIX = 'blog_comments_'

// 获取文章的评论
export const getComments = (articleId) => {
  try {
    const comments = loadFromDB(`${COMMENTS_PREFIX}${articleId}`, [])
    return Array.isArray(comments) ? comments : []
  } catch {
    return []
  }
}

// 保存评论
export const saveComments = async (articleId, comments) => {
  await saveToDB(`${COMMENTS_PREFIX}${articleId}`, comments)
}

// 添加评论
export const addComment = async (articleId, comment) => {
  const comments = getComments(articleId)
  await saveComments(articleId, [...comments, comment])
}

// 删除评论
export const deleteComment = async (articleId, commentId) => {
  const comments = getComments(articleId)
  await saveComments(articleId, comments.filter((c) => c.id !== commentId))
}

