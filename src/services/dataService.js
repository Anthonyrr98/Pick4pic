// 数据管理服务 - 使用 IndexedDB 和 localStorage 双重保存
import {
  profile as defaultProfile,
  timelineEntries as defaultTimeline,
  articles as defaultArticles,
  diaryPosts as defaultDiaryPosts,
  introNotes as defaultIntroNotes,
  aboutMilestones as defaultAboutMilestones,
  peaceNotes as defaultPeaceNotes,
  tools as defaultTools,
  socialLinks as defaultSocialLinks,
} from '../data/content'
import { saveToDB, loadFromDB, exportToFile, importFromFile } from './storageService'

const STORAGE_KEYS = {
  PROFILE: 'blog_profile',
  TIMELINE: 'blog_timeline',
  ARTICLES: 'blog_articles',
  DIARY_POSTS: 'blog_diary_posts',
  INTRO_NOTES: 'blog_intro_notes',
  ABOUT_MILESTONES: 'blog_about_milestones',
  PEACE_NOTES: 'blog_peace_notes',
  TOOLS: 'blog_tools',
  SOCIAL_LINKS: 'blog_social_links',
  ARTICLE_VERSIONS: 'blog_article_versions',
  BACKUP_REMINDER: 'blog_backup_reminder',
}

// 初始化数据（如果存储中没有数据，使用默认数据）
const initData = async () => {
  const profile = await loadFromDB(STORAGE_KEYS.PROFILE, defaultProfile)
  if (JSON.stringify(profile) === JSON.stringify(defaultProfile)) {
    await saveToDB(STORAGE_KEYS.PROFILE, defaultProfile)
  }

  const timeline = await loadFromDB(STORAGE_KEYS.TIMELINE, defaultTimeline)
  if (JSON.stringify(timeline) === JSON.stringify(defaultTimeline)) {
    await saveToDB(STORAGE_KEYS.TIMELINE, defaultTimeline)
  }

  const articles = await loadFromDB(STORAGE_KEYS.ARTICLES, defaultArticles)
  if (JSON.stringify(articles) === JSON.stringify(defaultArticles)) {
    await saveToDB(STORAGE_KEYS.ARTICLES, defaultArticles)
  }

  const diaryPosts = await loadFromDB(STORAGE_KEYS.DIARY_POSTS, defaultDiaryPosts)
  if (JSON.stringify(diaryPosts) === JSON.stringify(defaultDiaryPosts)) {
    await saveToDB(STORAGE_KEYS.DIARY_POSTS, defaultDiaryPosts)
  }

  const introNotes = await loadFromDB(STORAGE_KEYS.INTRO_NOTES, defaultIntroNotes)
  if (JSON.stringify(introNotes) === JSON.stringify(defaultIntroNotes)) {
    await saveToDB(STORAGE_KEYS.INTRO_NOTES, defaultIntroNotes)
  }

  const aboutMilestones = await loadFromDB(STORAGE_KEYS.ABOUT_MILESTONES, defaultAboutMilestones)
  if (JSON.stringify(aboutMilestones) === JSON.stringify(defaultAboutMilestones)) {
    await saveToDB(STORAGE_KEYS.ABOUT_MILESTONES, defaultAboutMilestones)
  }

  const peaceNotes = await loadFromDB(STORAGE_KEYS.PEACE_NOTES, defaultPeaceNotes)
  if (JSON.stringify(peaceNotes) === JSON.stringify(defaultPeaceNotes)) {
    await saveToDB(STORAGE_KEYS.PEACE_NOTES, defaultPeaceNotes)
  }

  const tools = await loadFromDB(STORAGE_KEYS.TOOLS, defaultTools)
  if (JSON.stringify(tools) === JSON.stringify(defaultTools)) {
    await saveToDB(STORAGE_KEYS.TOOLS, defaultTools)
  }

  const socialLinks = await loadFromDB(STORAGE_KEYS.SOCIAL_LINKS, defaultSocialLinks)
  if (JSON.stringify(socialLinks) === JSON.stringify(defaultSocialLinks)) {
    await saveToDB(STORAGE_KEYS.SOCIAL_LINKS, defaultSocialLinks)
  }
}

// 初始化（异步）
initData()

// 获取数据（同步版本，从缓存读取）
const dataCache = {}

// 初始化缓存
const initCache = async () => {
  dataCache.profile = await loadFromDB(STORAGE_KEYS.PROFILE, defaultProfile)
  dataCache.timeline = await loadFromDB(STORAGE_KEYS.TIMELINE, defaultTimeline)
  dataCache.articles = await loadFromDB(STORAGE_KEYS.ARTICLES, defaultArticles)
  dataCache.diaryPosts = await loadFromDB(STORAGE_KEYS.DIARY_POSTS, defaultDiaryPosts)
  dataCache.introNotes = await loadFromDB(STORAGE_KEYS.INTRO_NOTES, defaultIntroNotes)
  dataCache.aboutMilestones = await loadFromDB(STORAGE_KEYS.ABOUT_MILESTONES, defaultAboutMilestones)
  dataCache.peaceNotes = await loadFromDB(STORAGE_KEYS.PEACE_NOTES, defaultPeaceNotes)
  dataCache.tools = await loadFromDB(STORAGE_KEYS.TOOLS, defaultTools)
  dataCache.socialLinks = await loadFromDB(STORAGE_KEYS.SOCIAL_LINKS, defaultSocialLinks)
}

// 初始化缓存
initCache()

// 获取数据（同步版本，优先从缓存读取）
export const getProfile = () => {
  if (dataCache.profile) return dataCache.profile
  // 降级到同步读取
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE)
    return stored ? JSON.parse(stored) : defaultProfile
  } catch {
    return defaultProfile
  }
}

export const getTimeline = () => {
  if (dataCache.timeline) return dataCache.timeline
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMELINE)
    return stored ? JSON.parse(stored) : defaultTimeline
  } catch {
    return defaultTimeline
  }
}

export const getArticles = () => {
  if (dataCache.articles) return dataCache.articles
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES)
    return stored ? JSON.parse(stored) : defaultArticles
  } catch {
    return defaultArticles
  }
}

export const getDiaryPosts = () => {
  if (dataCache.diaryPosts) return dataCache.diaryPosts
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DIARY_POSTS)
    return stored ? JSON.parse(stored) : defaultDiaryPosts
  } catch {
    return defaultDiaryPosts
  }
}

export const getIntroNotes = () => {
  if (dataCache.introNotes) return dataCache.introNotes
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.INTRO_NOTES)
    return stored ? JSON.parse(stored) : defaultIntroNotes
  } catch {
    return defaultIntroNotes
  }
}

export const getAboutMilestones = () => {
  if (dataCache.aboutMilestones) return dataCache.aboutMilestones
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ABOUT_MILESTONES)
    return stored ? JSON.parse(stored) : defaultAboutMilestones
  } catch {
    return defaultAboutMilestones
  }
}

export const getPeaceNotes = () => {
  if (dataCache.peaceNotes) return dataCache.peaceNotes
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PEACE_NOTES)
    return stored ? JSON.parse(stored) : defaultPeaceNotes
  } catch {
    return defaultPeaceNotes
  }
}

export const getTools = () => {
  if (dataCache.tools) return dataCache.tools
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOOLS)
    return stored ? JSON.parse(stored) : defaultTools
  } catch {
    return defaultTools
  }
}

export const getSocialLinks = () => {
  if (dataCache.socialLinks) return dataCache.socialLinks
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SOCIAL_LINKS)
    return stored ? JSON.parse(stored) : defaultSocialLinks
  } catch {
    return defaultSocialLinks
  }
}

// 保存数据（异步保存到 IndexedDB）
export const saveProfile = async (profile) => {
  dataCache.profile = profile
  await saveToDB(STORAGE_KEYS.PROFILE, profile)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const saveTimeline = async (timeline) => {
  dataCache.timeline = timeline
  await saveToDB(STORAGE_KEYS.TIMELINE, timeline)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(timeline))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const saveArticles = async (articles) => {
  dataCache.articles = articles
  await saveToDB(STORAGE_KEYS.ARTICLES, articles)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const saveDiaryPosts = async (posts) => {
  dataCache.diaryPosts = posts
  await saveToDB(STORAGE_KEYS.DIARY_POSTS, posts)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.DIARY_POSTS, JSON.stringify(posts))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const saveIntroNotes = async (notes) => {
  dataCache.introNotes = notes
  await saveToDB(STORAGE_KEYS.INTRO_NOTES, notes)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.INTRO_NOTES, JSON.stringify(notes))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const saveAboutMilestones = async (milestones) => {
  dataCache.aboutMilestones = milestones
  await saveToDB(STORAGE_KEYS.ABOUT_MILESTONES, milestones)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.ABOUT_MILESTONES, JSON.stringify(milestones))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const savePeaceNotes = async (notes) => {
  dataCache.peaceNotes = notes
  await saveToDB(STORAGE_KEYS.PEACE_NOTES, notes)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.PEACE_NOTES, JSON.stringify(notes))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const saveTools = async (tools) => {
  dataCache.tools = tools
  await saveToDB(STORAGE_KEYS.TOOLS, tools)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

export const saveSocialLinks = async (links) => {
  dataCache.socialLinks = links
  await saveToDB(STORAGE_KEYS.SOCIAL_LINKS, links)
  // 同时保存到 localStorage 确保刷新后能读取
  try {
    localStorage.setItem(STORAGE_KEYS.SOCIAL_LINKS, JSON.stringify(links))
  } catch (e) {
    console.warn('Failed to save to localStorage:', e)
  }
}

// 刷新缓存（从数据库重新加载）
export const refreshCache = async () => {
  await initCache()
  // 确保缓存中的数据也同步到 localStorage，以便刷新后能立即读取
  if (dataCache.articles) {
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(dataCache.articles))
    } catch (e) {
      console.warn('Failed to sync articles to localStorage:', e)
    }
  }
  if (dataCache.timeline) {
    try {
      localStorage.setItem(STORAGE_KEYS.TIMELINE, JSON.stringify(dataCache.timeline))
    } catch (e) {
      console.warn('Failed to sync timeline to localStorage:', e)
    }
  }
  if (dataCache.diaryPosts) {
    try {
      localStorage.setItem(STORAGE_KEYS.DIARY_POSTS, JSON.stringify(dataCache.diaryPosts))
    } catch (e) {
      console.warn('Failed to sync diaryPosts to localStorage:', e)
    }
  }
}

// 导出所有数据（用于备份）
export const exportAllData = () => {
  return {
    profile: getProfile(),
    timeline: getTimeline(),
    articles: getArticles(),
    diaryPosts: getDiaryPosts(),
    introNotes: getIntroNotes(),
    aboutMilestones: getAboutMilestones(),
    peaceNotes: getPeaceNotes(),
    tools: getTools(),
    socialLinks: getSocialLinks(),
  }
}

// 导出到文件
export const exportAllDataToFile = async () => {
  const data = exportAllData()
  await exportToFile(data)
}

// 导入数据（用于恢复）
export const importAllData = async (data) => {
  if (data.profile) await saveProfile(data.profile)
  if (data.timeline) await saveTimeline(data.timeline)
  if (data.articles) await saveArticles(data.articles)
  if (data.diaryPosts) await saveDiaryPosts(data.diaryPosts)
  if (data.introNotes) await saveIntroNotes(data.introNotes)
  if (data.aboutMilestones) await saveAboutMilestones(data.aboutMilestones)
  if (data.peaceNotes) await savePeaceNotes(data.peaceNotes)
  if (data.tools) await saveTools(data.tools)
  if (data.socialLinks) await saveSocialLinks(data.socialLinks)
  await refreshCache()
}

// 从文件导入
export const importAllDataFromFile = async (file) => {
  const data = await importFromFile(file)
  await importAllData(data)
}

