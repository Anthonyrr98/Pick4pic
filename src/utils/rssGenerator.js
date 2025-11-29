// RSS 生成器
import { getArticles } from '../services/dataService'

export const generateRSS = () => {
  const articles = getArticles()
  const siteUrl = window.location.origin
  const currentDate = new Date().toUTCString()

  const rssItems = articles
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20) // 最新20篇文章
    .map((article) => {
      const articleUrl = `${siteUrl}/articles#${article.id}`
      const description = article.summary || ''
      const content = article.content
        ? Array.isArray(article.content)
          ? article.content.join('\n\n')
          : article.content
        : ''

      return `
    <item>
      <title><![CDATA[${escapeXML(article.title)}]]></title>
      <link>${articleUrl}</link>
      <guid>${articleUrl}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${escapeXML(description)}]]></description>
      <content:encoded><![CDATA[${escapeXML(content)}]]></content:encoded>
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>个人博客</title>
    <link>${siteUrl}</link>
    <description>个人博客文章订阅</description>
    <language>zh-CN</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    ${rssItems}
  </channel>
</rss>`

  return rss
}

const escapeXML = (str) => {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const downloadRSS = () => {
  const rss = generateRSS()
  const blob = new Blob([rss], { type: 'application/rss+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'rss.xml'
  a.click()
  URL.revokeObjectURL(url)
}

