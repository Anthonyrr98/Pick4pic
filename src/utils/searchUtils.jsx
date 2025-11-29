// 搜索工具函数
import React from 'react'

// 在文本中搜索关键词（支持中文和英文）
export const searchInText = (text, query) => {
  if (!query || !text) return false
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  return lowerText.includes(lowerQuery)
}

// 搜索文章（增强版 - 支持全文搜索）
export const searchArticles = (articles, query) => {
  if (!query) return articles

  const lowerQuery = query.toLowerCase()
  return articles.filter((article) => {
    // 搜索标题
    if (searchInText(article.title, query)) return true
    // 搜索摘要
    if (searchInText(article.summary, query)) return true
    // 搜索标签
    if (searchInText(article.tag, query)) return true
    // 搜索日期
    if (searchInText(article.date, query)) return true
    // 搜索内容（支持数组和字符串）
    if (article.content) {
      if (Array.isArray(article.content)) {
        if (article.content.some((p) => searchInText(p, query))) return true
      } else if (typeof article.content === 'string') {
        if (searchInText(article.content, query)) return true
      }
    }
    // 搜索代码
    if (article.code && searchInText(article.code, query)) return true
    // 搜索链接标题
    if (article.links && Array.isArray(article.links)) {
      if (article.links.some((link) => 
        searchInText(link.title || '', query) || searchInText(link.url || '', query)
      )) return true
    }
    return false
  })
}

// 搜索日常记录
export const searchDiaryPosts = (posts, query) => {
  if (!query) return posts

  return posts.filter((post) => {
    return (
      searchInText(post.title, query) ||
      searchInText(post.date, query) ||
      (post.content && post.content.some((line) => searchInText(line, query)))
    )
  })
}

// 搜索时间线
export const searchTimeline = (timeline, query) => {
  if (!query) return timeline

  return timeline.filter((entry) => {
    return (
      searchInText(entry.title, query) ||
      searchInText(entry.description, query) ||
      searchInText(String(entry.year), query) ||
      (entry.content && entry.content.some((p) => searchInText(p, query)))
    )
  })
}

// 高亮搜索结果（返回HTML字符串，不返回JSX）
export const highlightText = (text, query) => {
  if (!query || !text) return text

  // 转义特殊字符
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

// 高亮搜索结果（返回React元素）
export const highlightTextJSX = (text, query) => {
  if (!query || !text) return text

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return <mark key={index} className="search-highlight">{part}</mark>
    }
    return part
  })
}

