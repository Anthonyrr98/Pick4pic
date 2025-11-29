// 版本历史管理服务
import { saveToDB, loadFromDB } from './storageService'

const STORAGE_KEY = 'blog_article_versions'
const MAX_VERSIONS_PER_ARTICLE = 10 // 每个文章最多保留10个版本

// 获取文章的所有版本
export const getArticleVersions = async (articleId) => {
  try {
    const allVersions = await loadFromDB(STORAGE_KEY, {})
    return allVersions[articleId] || []
  } catch (error) {
    console.error('Failed to load article versions:', error)
    return []
  }
}

// 保存文章版本
export const saveArticleVersion = async (article) => {
  try {
    const allVersions = await loadFromDB(STORAGE_KEY, {})
    const articleId = article.id
    
    if (!allVersions[articleId]) {
      allVersions[articleId] = []
    }
    
    // 创建版本记录
    const version = {
      id: `version-${Date.now()}`,
      articleId: articleId,
      data: { ...article },
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('zh-CN'),
    }
    
    // 添加到版本列表开头
    allVersions[articleId].unshift(version)
    
    // 限制版本数量
    if (allVersions[articleId].length > MAX_VERSIONS_PER_ARTICLE) {
      allVersions[articleId] = allVersions[articleId].slice(0, MAX_VERSIONS_PER_ARTICLE)
    }
    
    await saveToDB(STORAGE_KEY, allVersions)
    return version
  } catch (error) {
    console.error('Failed to save article version:', error)
    throw error
  }
}

// 恢复文章版本
export const restoreArticleVersion = async (articleId, versionId) => {
  try {
    const allVersions = await loadFromDB(STORAGE_KEY, {})
    const versions = allVersions[articleId] || []
    const version = versions.find(v => v.id === versionId)
    
    if (!version) {
      throw new Error('Version not found')
    }
    
    return version.data
  } catch (error) {
    console.error('Failed to restore article version:', error)
    throw error
  }
}

// 删除文章的所有版本
export const deleteArticleVersions = async (articleId) => {
  try {
    const allVersions = await loadFromDB(STORAGE_KEY, {})
    delete allVersions[articleId]
    await saveToDB(STORAGE_KEY, allVersions)
  } catch (error) {
    console.error('Failed to delete article versions:', error)
    throw error
  }
}

// 清理旧版本（保留最近N个版本）
export const cleanupOldVersions = async (keepCount = 5) => {
  try {
    const allVersions = await loadFromDB(STORAGE_KEY, {})
    for (const articleId in allVersions) {
      if (allVersions[articleId].length > keepCount) {
        allVersions[articleId] = allVersions[articleId].slice(0, keepCount)
      }
    }
    await saveToDB(STORAGE_KEY, allVersions)
  } catch (error) {
    console.error('Failed to cleanup old versions:', error)
    throw error
  }
}

