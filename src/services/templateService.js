// 文章模板服务
import { saveToDB, loadFromDB } from './storageService'

const STORAGE_KEY = 'blog_article_templates'

// 默认模板
const defaultTemplates = [
  {
    id: 'template-tech',
    name: '技术文章',
    description: '适合写技术分享文章',
    template: {
      title: '',
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) + ' · 技术',
      summary: '',
      image: '',
      rating: 5,
      tag: '技术',
      status: 'draft',
      content: [
        '## 背景',
        '',
        '## 问题',
        '',
        '## 解决方案',
        '',
        '## 总结',
        '',
      ],
      gallery: [],
      code: '',
      links: [],
      markdown: true,
    },
  },
  {
    id: 'template-life',
    name: '生活随笔',
    description: '适合写生活感悟',
    template: {
      title: '',
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) + ' · 生活',
      summary: '',
      image: '',
      rating: 5,
      tag: '生活',
      status: 'draft',
      content: [
        '今天...',
        '',
        '感受...',
        '',
      ],
      gallery: [],
      code: '',
      links: [],
      markdown: false,
    },
  },
  {
    id: 'template-review',
    name: '读书/观影笔记',
    description: '适合写读书或观影笔记',
    template: {
      title: '',
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) + ' · 笔记',
      summary: '',
      image: '',
      rating: 5,
      tag: '笔记',
      status: 'draft',
      content: [
        '## 基本信息',
        '',
        '## 主要内容',
        '',
        '## 个人感受',
        '',
        '## 推荐指数',
        '',
      ],
      gallery: [],
      code: '',
      links: [],
      markdown: true,
    },
  },
]

// 获取所有模板
export const getTemplates = async () => {
  try {
    const templates = await loadFromDB(STORAGE_KEY, defaultTemplates)
    return templates
  } catch (error) {
    console.error('Failed to load templates:', error)
    return defaultTemplates
  }
}

// 保存模板
export const saveTemplate = async (template) => {
  try {
    const templates = await getTemplates()
    const existingIndex = templates.findIndex(t => t.id === template.id)
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template
    } else {
      templates.push(template)
    }
    
    await saveToDB(STORAGE_KEY, templates)
    return template
  } catch (error) {
    console.error('Failed to save template:', error)
    throw error
  }
}

// 删除模板
export const deleteTemplate = async (templateId) => {
  try {
    const templates = await getTemplates()
    const filtered = templates.filter(t => t.id !== templateId)
    await saveToDB(STORAGE_KEY, filtered)
  } catch (error) {
    console.error('Failed to delete template:', error)
    throw error
  }
}

// 使用模板创建文章
export const createArticleFromTemplate = (templateId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const templates = await getTemplates()
      const template = templates.find(t => t.id === templateId)
      
      if (!template) {
        reject(new Error('Template not found'))
        return
      }
      
      // 深拷贝模板并添加ID
      const article = {
        ...JSON.parse(JSON.stringify(template.template)),
        id: `article-${Date.now()}`,
      }
      
      resolve(article)
    } catch (error) {
      reject(error)
    }
  })
}

