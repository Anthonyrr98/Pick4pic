import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  zh: {
    home: '主页',
    articles: '文章',
    dailyLife: '日常生活',
    about: '关于我',
    peace: '平平无奇',
    tools: '工具',
    search: '搜索文章和记录...',
    searchArticles: '搜索文章...',
    searchDiary: '搜索日常记录...',
    all: '全部',
    selectYear: '选择年份',
    clickToView: '点击查看详情 →',
    noResults: '没有找到相关内容',
    found: '找到',
    articlesFound: '篇文章',
    recordsFound: '条记录',
    comments: '评论',
    writeComment: '写评论',
    cancel: '取消',
    submit: '发布',
    reply: '回复',
    noComments: '还没有评论，来第一个吧~',
    name: '昵称',
    content: '评论',
    placeholder: '写下你的想法...',
    rss: 'RSS 订阅',
    rssDownloaded: 'RSS 文件已自动下载',
    redownloadRSS: '重新下载 RSS',
  },
  en: {
    home: 'Home',
    articles: 'Articles',
    dailyLife: 'Daily Life',
    about: 'About',
    peace: 'Peace',
    tools: 'Tools',
    search: 'Search articles and records...',
    searchArticles: 'Search articles...',
    searchDiary: 'Search daily records...',
    all: 'All',
    selectYear: 'Select Year',
    clickToView: 'Click to view details →',
    noResults: 'No results found',
    found: 'Found',
    articlesFound: 'articles',
    recordsFound: 'records',
    comments: 'Comments',
    writeComment: 'Write Comment',
    cancel: 'Cancel',
    submit: 'Submit',
    reply: 'Reply',
    noComments: 'No comments yet, be the first!',
    name: 'Name',
    content: 'Comment',
    placeholder: 'Write your thoughts...',
    rss: 'RSS Feed',
    rssDownloaded: 'RSS file downloaded automatically',
    redownloadRSS: 'Redownload RSS',
  },
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || 'zh'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => {
    return translations[language]?.[key] || key
  }

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'))
  }

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return [context.language, context.t, context.toggleLanguage]
}

