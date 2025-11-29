import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getProfile } from '../services/dataService'

const SEOHead = ({ title, description, image, type = 'website' }) => {
  const location = useLocation()
  const profile = getProfile()
  const siteUrl = window.location.origin
  const currentUrl = `${siteUrl}${location.pathname}`

  useEffect(() => {
    // 更新 title
    document.title = title ? `${title} - ${profile.name || '个人博客'}` : profile.name || '个人博客'

    // 更新或创建 meta 标签
    const updateMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // 基本 SEO
    updateMeta('description', description || profile.tagline || '个人博客')
    updateMeta('keywords', '个人博客,文章,日常记录')
    updateMeta('author', profile.name || '')

    // Open Graph
    updateMeta('og:title', title || profile.name || '个人博客', true)
    updateMeta('og:description', description || profile.tagline || '个人博客', true)
    updateMeta('og:image', image || `${siteUrl}/vite.svg`, true)
    updateMeta('og:url', currentUrl, true)
    updateMeta('og:type', type, true)
    updateMeta('og:site_name', profile.name || '个人博客', true)

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', title || profile.name || '个人博客')
    updateMeta('twitter:description', description || profile.tagline || '个人博客')
    updateMeta('twitter:image', image || `${siteUrl}/vite.svg`)

    // 结构化数据 (JSON-LD)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: profile.name || '个人博客',
      description: profile.tagline || '个人博客',
      url: siteUrl,
      author: {
        '@type': 'Person',
        name: profile.name || '',
      },
    }

    let script = document.querySelector('script[type="application/ld+json"]')
    if (!script) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData)
  }, [title, description, image, type, location, profile, siteUrl, currentUrl])

  return null
}

export default SEOHead

