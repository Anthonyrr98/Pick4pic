// 标签工具函数

// 从文章中提取所有标签
export const extractTagsFromArticles = (articles) => {
  const tagMap = {}
  
  articles.forEach((article) => {
    if (article.tag) {
      const tags = article.tag.split(/[，,、]/).map(t => t.trim()).filter(t => t)
      tags.forEach((tag) => {
        if (!tagMap[tag]) {
          tagMap[tag] = 0
        }
        tagMap[tag]++
      })
    }
  })

  return Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

// 按标签筛选文章
export const filterArticlesByTags = (articles, selectedTags) => {
  if (!selectedTags || selectedTags.length === 0) {
    return articles
  }

  return articles.filter((article) => {
    if (!article.tag) return false
    const articleTags = article.tag.split(/[，,、]/).map(t => t.trim())
    return selectedTags.some((tag) => articleTags.includes(tag))
  })
}

