import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { getYearMonthString } from '../../utils/dateUtils'
import ImageUpload from '../../components/ImageUpload'
import {
  getProfile,
  getTimeline,
  getArticles,
  getDiaryPosts,
  getIntroNotes,
  getAboutMilestones,
  getPeaceNotes,
  getTools,
  getSocialLinks,
  saveProfile,
  saveTimeline,
  saveArticles,
  saveDiaryPosts,
  saveIntroNotes,
  saveAboutMilestones,
  savePeaceNotes,
  saveTools,
  saveSocialLinks,
  exportAllData,
  exportAllDataToFile,
  importAllData,
  importAllDataFromFile,
  refreshCache,
} from '../../services/dataService'
import { getStorageInfo } from '../../services/storageService'
import { saveArticleVersion, getArticleVersions, restoreArticleVersion } from '../../services/versionService'
import { getTemplates, createArticleFromTemplate } from '../../services/templateService'
import PublishFrequencyChart from '../../components/PublishFrequencyChart'
import MarkdownViewer from '../../components/MarkdownViewer'
import './Admin.css'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('articles')
  const [storageInfo, setStorageInfo] = useState(null)
  const [data, setData] = useState({
    profile: getProfile(),
    timeline: getTimeline(),
    articles: getArticles(),
    diaryPosts: getDiaryPosts(),
    introNotes: getIntroNotes(),
    aboutMilestones: getAboutMilestones(),
    peaceNotes: getPeaceNotes(),
    tools: getTools(),
    socialLinks: getSocialLinks(),
  })

  useEffect(() => {
    // 获取存储信息
    getStorageInfo().then(setStorageInfo)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const refreshData = () => {
    setData({
      profile: getProfile(),
      timeline: getTimeline(),
      articles: getArticles(),
      diaryPosts: getDiaryPosts(),
      introNotes: getIntroNotes(),
      aboutMilestones: getAboutMilestones(),
      peaceNotes: getPeaceNotes(),
      tools: getTools(),
      socialLinks: getSocialLinks(),
    })
  }

  const handleExport = async () => {
    try {
      await exportAllDataToFile()
      alert('数据已导出到本地文件！')
    } catch (error) {
      alert('导出失败：' + error.message)
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        await importAllDataFromFile(file)
        await refreshCache()
        refreshData()
        alert('数据导入成功！')
      } catch (error) {
        alert('导入失败：' + error.message)
      }
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>后台管理</h1>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#666' }}>
            数据保存在本地浏览器存储（IndexedDB + localStorage），不会上传到服务器
            {storageInfo && (
              <span style={{ marginLeft: '1rem' }}>
                存储使用: {storageInfo.usagePercent}%
              </span>
            )}
          </p>
        </div>
        <div className="admin-header__actions">
          <button onClick={handleExport} className="admin-btn admin-btn--secondary">
            导出到文件
          </button>
          <label className="admin-btn admin-btn--secondary">
            从文件导入
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button onClick={handleLogout} className="admin-btn admin-btn--danger">
            退出登录
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'articles' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setActiveTab('articles')}
        >
          文章
        </button>
        <button
          className={activeTab === 'timeline' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setActiveTab('timeline')}
        >
          时间线
        </button>
        <button
          className={activeTab === 'diary' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setActiveTab('diary')}
        >
          日常生活
        </button>
        <button
          className={activeTab === 'profile' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setActiveTab('profile')}
        >
          个人信息
        </button>
        <button
          className={activeTab === 'settings' ? 'admin-tab active' : 'admin-tab'}
          onClick={() => setActiveTab('settings')}
        >
          其他设置
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'articles' && (
          <>
            <ArticlesManager
              articles={data.articles}
              onUpdate={async (articles) => {
                await saveArticles(articles)
                await refreshCache()
                refreshData()
              }}
            />
            <PublishFrequencyChart articles={data.articles} diaryPosts={data.diaryPosts} />
          </>
        )}
        {activeTab === 'timeline' && (
          <TimelineManager
            timeline={data.timeline}
            onUpdate={async (timeline) => {
              await saveTimeline(timeline)
              await refreshCache()
              refreshData()
            }}
          />
        )}
        {activeTab === 'diary' && (
          <DiaryManager
            posts={data.diaryPosts}
            onUpdate={async (posts) => {
              await saveDiaryPosts(posts)
              await refreshCache()
              refreshData()
            }}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileManager
            profile={data.profile}
            socialLinks={data.socialLinks}
            onUpdateProfile={async (profile) => {
              await saveProfile(profile)
              await refreshCache()
              refreshData()
            }}
            onUpdateSocialLinks={async (links) => {
              await saveSocialLinks(links)
              await refreshCache()
              refreshData()
            }}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsManager
            introNotes={data.introNotes}
            aboutMilestones={data.aboutMilestones}
            peaceNotes={data.peaceNotes}
            tools={data.tools}
            onUpdateIntroNotes={async (notes) => {
              await saveIntroNotes(notes)
              await refreshCache()
              refreshData()
            }}
            onUpdateAboutMilestones={async (milestones) => {
              await saveAboutMilestones(milestones)
              await refreshCache()
              refreshData()
            }}
            onUpdatePeaceNotes={async (notes) => {
              await savePeaceNotes(notes)
              await refreshCache()
              refreshData()
            }}
            onUpdateTools={async (tools) => {
              await saveTools(tools)
              await refreshCache()
              refreshData()
            }}
          />
        )}
      </div>
    </div>
  )
}

// 文章管理组件
const ArticlesManager = ({ articles, onUpdate }) => {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})
  const [selectedArticles, setSelectedArticles] = useState(new Set())
  const [viewMode, setViewMode] = useState('all') // all, published, draft, private
  const [showVersions, setShowVersions] = useState(null) // articleId
  const [versions, setVersions] = useState([])
  const [batchTag, setBatchTag] = useState('')
  const [showTemplates, setShowTemplates] = useState(false)
  const [templates, setTemplates] = useState([])
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    getTemplates().then(setTemplates)
  }, [])

  const handleAdd = () => {
    const newArticle = {
      id: `article-${Date.now()}`,
      title: '',
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) + ' · 未分类',
      summary: '',
      image: '',
      rating: 5,
      tag: '',
      status: 'draft', // 新建默认为草稿
      content: [''],
      gallery: [''],
      code: '',
      links: [{ title: '', url: '' }],
    }
    setEditingId(newArticle.id)
    setFormData(newArticle)
  }

  const handleUseTemplate = async (templateId) => {
    try {
      const article = await createArticleFromTemplate(templateId)
      setEditingId(article.id)
      setFormData(article)
      setShowTemplates(false)
    } catch (error) {
      alert('使用模板失败：' + error.message)
    }
  }

  const handleEdit = (article) => {
    setEditingId(article.id)
    setFormData({ ...article })
  }

  const handleSave = async () => {
    if (editingId) {
      // 验证必填字段
      if (!formData.title || !formData.title.trim()) {
        alert('请输入文章标题')
        return
      }
      
      // 确保数据完整性
      const articleToSave = {
        ...formData,
        id: editingId,
        title: formData.title.trim(),
        date: formData.date || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) + ' · 未分类',
        summary: formData.summary || '',
        image: formData.image || '',
        rating: formData.rating || 5,
        tag: formData.tag || '',
        status: formData.status || 'draft', // 默认草稿
        content: Array.isArray(formData.content) ? formData.content.filter(c => c && c.trim()) : (formData.content ? [formData.content] : ['']),
        gallery: Array.isArray(formData.gallery) ? formData.gallery.filter(g => g && g.trim()) : (formData.gallery ? [formData.gallery] : []),
        code: formData.code || '',
        links: Array.isArray(formData.links) ? formData.links.filter(l => l && (l.url || l.title)) : (formData.links ? [formData.links] : []),
      }
      
      // 检查是新增还是编辑
      const existingIndex = articles.findIndex((a) => a.id === editingId)
      const isEdit = existingIndex >= 0
      
      // 如果是编辑，保存版本历史
      if (isEdit) {
        try {
          const oldArticle = articles[existingIndex]
          await saveArticleVersion(oldArticle)
        } catch (error) {
          console.warn('Failed to save version history:', error)
        }
      }
      
      let updated
      if (isEdit) {
        // 编辑现有文章
        updated = [...articles]
        updated[existingIndex] = articleToSave
      } else {
        // 新增文章
        updated = [...articles, articleToSave]
      }
      
      try {
        await onUpdate(updated)
        setEditingId(null)
        setFormData({})
        alert('保存成功！')
      } catch (error) {
        alert('保存失败：' + error.message)
        console.error('Save error:', error)
      }
    }
  }
  
  // 批量删除
  const handleBatchDelete = () => {
    if (selectedArticles.size === 0) {
      alert('请先选择要删除的文章')
      return
    }
    if (confirm(`确定要删除选中的 ${selectedArticles.size} 篇文章吗？`)) {
      onUpdate(articles.filter(a => !selectedArticles.has(a.id)))
      setSelectedArticles(new Set())
    }
  }
  
  // 批量编辑标签
  const handleBatchEditTags = () => {
    if (selectedArticles.size === 0) {
      alert('请先选择要编辑的文章')
      return
    }
    if (!batchTag.trim()) {
      alert('请输入标签')
      return
    }
    const updated = articles.map(article => {
      if (selectedArticles.has(article.id)) {
        return { ...article, tag: batchTag.trim() }
      }
      return article
    })
    onUpdate(updated)
    setSelectedArticles(new Set())
    setBatchTag('')
    alert('标签已批量更新！')
  }
  
  // 切换选择
  const toggleSelect = (articleId) => {
    const newSelected = new Set(selectedArticles)
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId)
    } else {
      newSelected.add(articleId)
    }
    setSelectedArticles(newSelected)
  }
  
  // 全选/取消全选
  const toggleSelectAll = () => {
    const filtered = getFilteredArticles()
    if (selectedArticles.size === filtered.length) {
      setSelectedArticles(new Set())
    } else {
      setSelectedArticles(new Set(filtered.map(a => a.id)))
    }
  }
  
  // 查看版本历史
  const handleViewVersions = async (articleId) => {
    try {
      const articleVersions = await getArticleVersions(articleId)
      setVersions(articleVersions)
      setShowVersions(articleId)
    } catch (error) {
      alert('加载版本历史失败：' + error.message)
    }
  }
  
  // 恢复版本
  const handleRestoreVersion = async (articleId, versionId) => {
    if (!confirm('确定要恢复这个版本吗？当前版本将被覆盖。')) {
      return
    }
    try {
      const versionData = await restoreArticleVersion(articleId, versionId)
      const updated = articles.map(a => a.id === articleId ? { ...versionData, id: articleId } : a)
      await onUpdate(updated)
      setShowVersions(null)
      setVersions([])
      alert('版本已恢复！')
    } catch (error) {
      alert('恢复版本失败：' + error.message)
    }
  }
  
  // 获取筛选后的文章
  const getFilteredArticles = () => {
    if (viewMode === 'all') return articles
    return articles.filter(a => (a.status || 'published') === viewMode)
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这篇文章吗？')) {
      onUpdate(articles.filter((a) => a.id !== id))
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({})
  }

  const filteredArticles = getFilteredArticles()
  
  return (
    <div className="admin-manager">
      <div className="admin-manager__header">
        <h2>文章管理 ({articles.length})</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleAdd} className="admin-btn admin-btn--primary">
            添加文章
          </button>
          <button onClick={() => setShowTemplates(true)} className="admin-btn admin-btn--secondary">
            使用模板
          </button>
          {editingId && (
            <button onClick={() => setShowPreview(!showPreview)} className="admin-btn admin-btn--secondary">
              {showPreview ? '隐藏预览' : '预览'}
            </button>
          )}
        </div>
      </div>

      {/* 模板选择弹窗 */}
      {showTemplates && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowTemplates(false)}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%',
          }} onClick={(e) => e.stopPropagation()}>
            <h3>选择模板</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleUseTemplate(template.id)}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f7f3ec'
                    e.currentTarget.style.borderColor = '#6d9482'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.borderColor = '#ddd'
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem' }}>{template.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>{template.description}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowTemplates(false)}
              className="admin-btn admin-btn--secondary"
              style={{ marginTop: '1rem' }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 文章预览 */}
      {showPreview && editingId && formData.title && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowPreview(false)}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '90%',
          }} onClick={(e) => e.stopPropagation()}>
            <h2>{formData.title}</h2>
            <p>{formData.summary}</p>
            {formData.content && (
              <div>
                {formData.markdown ? (
                  <MarkdownViewer content={Array.isArray(formData.content) ? formData.content.join('\n\n') : formData.content} />
                ) : (
                  Array.isArray(formData.content) ? (
                    formData.content.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))
                  ) : (
                    <p>{formData.content}</p>
                  )
                )}
              </div>
            )}
            <button
              onClick={() => setShowPreview(false)}
              className="admin-btn admin-btn--secondary"
              style={{ marginTop: '1rem' }}
            >
              关闭预览
            </button>
          </div>
        </div>
      )}
      
      {/* 视图切换和批量操作 */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`admin-btn admin-btn--small ${viewMode === 'all' ? 'admin-btn--primary' : ''}`}
            onClick={() => setViewMode('all')}
          >
            全部 ({articles.length})
          </button>
          <button 
            className={`admin-btn admin-btn--small ${viewMode === 'published' ? 'admin-btn--primary' : ''}`}
            onClick={() => setViewMode('published')}
          >
            已发布 ({articles.filter(a => (a.status || 'published') === 'published').length})
          </button>
          <button 
            className={`admin-btn admin-btn--small ${viewMode === 'draft' ? 'admin-btn--primary' : ''}`}
            onClick={() => setViewMode('draft')}
          >
            草稿 ({articles.filter(a => (a.status || 'published') === 'draft').length})
          </button>
          <button 
            className={`admin-btn admin-btn--small ${viewMode === 'private' ? 'admin-btn--primary' : ''}`}
            onClick={() => setViewMode('private')}
          >
            私密 ({articles.filter(a => (a.status || 'published') === 'private').length})
          </button>
        </div>
        
        {selectedArticles.size > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>已选择 {selectedArticles.size} 篇</span>
            <input
              type="text"
              placeholder="批量设置标签"
              value={batchTag}
              onChange={(e) => setBatchTag(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
            <button onClick={handleBatchEditTags} className="admin-btn admin-btn--small">
              批量设置标签
            </button>
            <button onClick={handleBatchDelete} className="admin-btn admin-btn--small admin-btn--danger">
              批量删除
            </button>
            <button onClick={() => setSelectedArticles(new Set())} className="admin-btn admin-btn--small">
              取消选择
            </button>
          </div>
        )}
      </div>
      
      {/* 版本历史弹窗 */}
      {showVersions && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => { setShowVersions(null); setVersions([]) }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%',
          }} onClick={(e) => e.stopPropagation()}>
            <h3>版本历史</h3>
            {versions.length === 0 ? (
              <p>暂无版本历史</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {versions.map((version) => (
                  <div key={version.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{version.date}</span>
                      <button
                        onClick={() => handleRestoreVersion(version.articleId, version.id)}
                        className="admin-btn admin-btn--small"
                      >
                        恢复此版本
                      </button>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>{version.data.title}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => { setShowVersions(null); setVersions([]) }}
              className="admin-btn admin-btn--secondary"
              style={{ marginTop: '1rem' }}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {editingId && (
        <div className="admin-form-card">
          <h3>{articles.find((a) => a.id === editingId) ? '编辑文章' : '新建文章'}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>标题</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>日期和分类</label>
              <input
                type="text"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="2023年5月3日 · 编程"
              />
            </div>
            <div className="admin-form-group">
              <label>摘要</label>
              <textarea
                value={formData.summary || ''}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows="3"
              />
            </div>
            <div className="admin-form-group">
              <label>图片</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <ImageUpload
                  onUpload={(base64) => setFormData({ ...formData, image: base64 })}
                />
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="或输入图片URL"
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label>评分 (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              />
            </div>
            <div className="admin-form-group">
              <label>标签</label>
              <input
                type="text"
                value={formData.tag || ''}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>状态</label>
              <select
                value={formData.status || 'draft'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="admin-status-select__input"
              >
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="private">私密</option>
              </select>
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>详细内容（每行一段）</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'normal' }}>
                  <input
                    type="checkbox"
                    checked={formData.markdown || false}
                    onChange={(e) => setFormData({ ...formData, markdown: e.target.checked })}
                  />
                  <span>Markdown格式</span>
                </label>
              </div>
              {formData.markdown ? (
                <textarea
                  value={Array.isArray(formData.content) ? formData.content.join('\n\n') : (formData.content || '')}
                  onChange={(e) => {
                    const content = e.target.value.split('\n\n').filter(c => c.trim())
                    setFormData({ ...formData, content: content.length > 0 ? content : [''] })
                  }}
                  rows="15"
                  style={{ 
                    width: '100%',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    padding: '0.75rem',
                    border: '1px solid #d9d1c3',
                    borderRadius: '8px',
                  }}
                  placeholder="输入Markdown内容..."
                />
              ) : (
                <>
                  {(formData.content || ['']).map((line, index) => (
                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <textarea
                        value={line}
                        onChange={(e) => {
                          const newContent = [...(formData.content || [])]
                          newContent[index] = e.target.value
                          setFormData({ ...formData, content: newContent })
                        }}
                        rows="3"
                        style={{ flex: 1 }}
                        placeholder="输入详细内容段落"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newContent = (formData.content || []).filter((_, i) => i !== index)
                          setFormData({ ...formData, content: newContent.length ? newContent : [''] })
                        }}
                        className="admin-btn admin-btn--small admin-btn--danger"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, content: [...(formData.content || []), ''] })
                    }}
                    className="admin-btn admin-btn--small"
                  >
                    添加段落
                  </button>
                </>
              )}
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>图片画廊URL（每行一个）</label>
              {(formData.gallery || ['']).map((url, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      const newGallery = [...(formData.gallery || [])]
                      newGallery[index] = e.target.value
                      setFormData({ ...formData, gallery: newGallery })
                    }}
                    style={{ flex: 1 }}
                    placeholder="图片URL"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newGallery = (formData.gallery || []).filter((_, i) => i !== index)
                      setFormData({ ...formData, gallery: newGallery.length ? newGallery : [''] })
                    }}
                    className="admin-btn admin-btn--small admin-btn--danger"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, gallery: [...(formData.gallery || []), ''] })
                }}
                className="admin-btn admin-btn--small"
              >
                添加图片
              </button>
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>代码片段</label>
              <textarea
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                rows="8"
                placeholder="输入代码片段（可选）"
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>相关链接</label>
              {(formData.links || [{ title: '', url: '' }]).map((link, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={link.title || ''}
                    onChange={(e) => {
                      const newLinks = [...(formData.links || [])]
                      newLinks[index] = { ...newLinks[index], title: e.target.value }
                      setFormData({ ...formData, links: newLinks })
                    }}
                    placeholder="链接标题"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => {
                      const newLinks = [...(formData.links || [])]
                      newLinks[index] = { ...newLinks[index], url: e.target.value }
                      setFormData({ ...formData, links: newLinks })
                    }}
                    placeholder="链接URL"
                    style={{ flex: 2 }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newLinks = (formData.links || []).filter((_, i) => i !== index)
                      setFormData({ ...formData, links: newLinks.length ? newLinks : [{ title: '', url: '' }] })
                    }}
                    className="admin-btn admin-btn--small admin-btn--danger"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, links: [...(formData.links || []), { title: '', url: '' }] })
                }}
                className="admin-btn admin-btn--small"
              >
                添加链接
              </button>
            </div>
          </div>
          <div className="admin-form-actions">
            <button onClick={handleSave} className="admin-btn admin-btn--primary">
              保存
            </button>
            <button onClick={handleCancel} className="admin-btn admin-btn--secondary">
              取消
            </button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {filteredArticles.length > 0 && (
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                onChange={toggleSelectAll}
              />
              <span>全选</span>
            </label>
          </div>
        )}
        {filteredArticles
          .sort((a, b) => {
            const aKey = getYearMonthString(a.date)
            const bKey = getYearMonthString(b.date)
            return bKey.localeCompare(aKey)
          })
          .map((article) => {
            const status = article.status || 'published'
            const statusLabels = {
              published: '已发布',
              draft: '草稿',
              private: '私密',
            }
            const statusColors = {
              published: '#6d9482',
              draft: '#ffa500',
              private: '#999',
            }
            
            return (
              <div key={article.id} className="admin-list-item" style={{
                borderLeft: selectedArticles.has(article.id) ? '3px solid #6d9482' : '3px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedArticles.has(article.id)}
                    onChange={() => toggleSelect(article.id)}
                  />
                  <div className="admin-list-item__content" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0 }}>{article.title}</h3>
                      <span style={{ fontSize: '0.85rem', color: '#6d9482', background: '#f7f3ec', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                        {getYearMonthString(article.date)}
                      </span>
                      <span style={{
                        fontSize: '0.85rem',
                        color: statusColors[status],
                        background: status === 'draft' ? '#fff3e0' : status === 'private' ? '#f5f5f5' : '#e8f3ef',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                      }}>
                        {statusLabels[status]}
                      </span>
                    </div>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>{article.date}</p>
                    <p className="admin-list-item__meta">{article.summary}</p>
                  </div>
                </div>
                <div className="admin-list-item__actions">
                  <button onClick={() => handleEdit(article)} className="admin-btn admin-btn--small">
                    编辑
                  </button>
                  <button onClick={() => handleViewVersions(article.id)} className="admin-btn admin-btn--small">
                    版本历史
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="admin-btn admin-btn--small admin-btn--danger">
                    删除
                  </button>
                </div>
              </div>
            )
          })}
        {filteredArticles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            暂无文章
          </div>
        )}
      </div>
    </div>
  )
}

// 时间线管理组件
const TimelineManager = ({ timeline, onUpdate }) => {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})

  const handleAdd = () => {
    const newEntry = {
      id: `timeline-${Date.now()}`,
      year: new Date().getFullYear(),
      title: '',
      description: '',
      image: '',
      content: [''],
      gallery: [''],
      tags: [''],
    }
    setEditingId(newEntry.id)
    setFormData(newEntry)
  }

  const handleEdit = (entry) => {
    setEditingId(entry.id || `${entry.year}-${entry.title}`)
    setFormData({ ...entry, id: entry.id || `${entry.year}-${entry.title}` })
  }

  const handleSave = async () => {
    if (editingId) {
      // 验证必填字段
      if (!formData.title || !formData.title.trim()) {
        alert('请输入标题')
        return
      }
      if (!formData.year) {
        alert('请输入年份')
        return
      }
      
      const entryToSave = {
        ...formData,
        id: editingId,
        title: formData.title.trim(),
        year: parseInt(formData.year) || new Date().getFullYear(),
        description: formData.description || '',
        image: formData.image || '',
        content: Array.isArray(formData.content) ? formData.content.filter(c => c && c.trim()) : (formData.content ? [formData.content] : []),
        gallery: Array.isArray(formData.gallery) ? formData.gallery.filter(g => g && g.trim()) : (formData.gallery ? [formData.gallery] : []),
        tags: Array.isArray(formData.tags) ? formData.tags : (formData.tags ? [formData.tags] : []),
      }
      
      const existingIndex = timeline.findIndex((t) => {
        const tId = t.id || `${t.year}-${t.title}`
        return tId === editingId
      })
      
      let updated
      if (existingIndex >= 0) {
        updated = [...timeline]
        updated[existingIndex] = entryToSave
      } else {
        updated = [...timeline, entryToSave]
      }
      
      try {
        await onUpdate(updated.sort((a, b) => a.year - b.year))
        setEditingId(null)
        setFormData({})
        alert('保存成功！')
      } catch (error) {
        alert('保存失败：' + error.message)
        console.error('Save error:', error)
      }
      setFormData({})
    }
  }

  const handleDelete = (entry) => {
    if (confirm('确定要删除这个时间线条目吗？')) {
      onUpdate(timeline.filter((t) => {
        const tId = t.id || `${t.year}-${t.title}`
        const eId = entry.id || `${entry.year}-${entry.title}`
        return tId !== eId
      }))
    }
  }

  return (
    <div className="admin-manager">
      <div className="admin-manager__header">
        <h2>时间线管理 ({timeline.length})</h2>
        <button onClick={handleAdd} className="admin-btn admin-btn--primary">
          添加条目
        </button>
      </div>

      {editingId && (
        <div className="admin-form-card">
          <h3>编辑时间线</h3>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>年份</label>
              <input
                type="number"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              />
            </div>
            <div className="admin-form-group">
              <label>标题</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>描述</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className="admin-form-group">
              <label>图片URL</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>详细内容（每行一段）</label>
              {(formData.content || ['']).map((line, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <textarea
                    value={line}
                    onChange={(e) => {
                      const newContent = [...(formData.content || [])]
                      newContent[index] = e.target.value
                      setFormData({ ...formData, content: newContent })
                    }}
                    rows="2"
                    style={{ flex: 1 }}
                    placeholder="输入详细内容段落"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newContent = (formData.content || []).filter((_, i) => i !== index)
                      setFormData({ ...formData, content: newContent.length ? newContent : [''] })
                    }}
                    className="admin-btn admin-btn--small admin-btn--danger"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, content: [...(formData.content || []), ''] })
                }}
                className="admin-btn admin-btn--small"
              >
                添加段落
              </button>
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>图片画廊URL（每行一个）</label>
              {(formData.gallery || ['']).map((url, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      const newGallery = [...(formData.gallery || [])]
                      newGallery[index] = e.target.value
                      setFormData({ ...formData, gallery: newGallery })
                    }}
                    style={{ flex: 1 }}
                    placeholder="图片URL"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newGallery = (formData.gallery || []).filter((_, i) => i !== index)
                      setFormData({ ...formData, gallery: newGallery.length ? newGallery : [''] })
                    }}
                    className="admin-btn admin-btn--small admin-btn--danger"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...formData, gallery: [...(formData.gallery || []), ''] })
                }}
                className="admin-btn admin-btn--small"
              >
                添加图片
              </button>
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>标签（用逗号分隔）</label>
              <input
                type="text"
                value={(formData.tags || []).join(', ')}
                onChange={(e) => {
                  const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  setFormData({ ...formData, tags })
                }}
                placeholder="例如：成长, 回忆, 旅行"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button onClick={handleSave} className="admin-btn admin-btn--primary">
              保存
            </button>
            <button onClick={() => { setEditingId(null); setFormData({}) }} className="admin-btn admin-btn--secondary">
              取消
            </button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {timeline.map((entry) => (
          <div key={entry.id || `${entry.year}-${entry.title}`} className="admin-list-item">
            <div className="admin-list-item__content">
              <h3>{entry.year} - {entry.title}</h3>
              <p>{entry.description}</p>
            </div>
            <div className="admin-list-item__actions">
              <button onClick={() => handleEdit(entry)} className="admin-btn admin-btn--small">
                编辑
              </button>
              <button onClick={() => handleDelete(entry)} className="admin-btn admin-btn--small admin-btn--danger">
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 日常记录管理组件
const DiaryManager = ({ posts, onUpdate }) => {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({})

  const handleAdd = () => {
    const newPost = {
      id: `diary-${Date.now()}`,
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).replace('日', '号'),
      title: '',
      content: [''],
      gallery: [''],
    }
    setEditingId(newPost.id)
    setFormData(newPost)
  }

  const handleEdit = (post) => {
    setEditingId(post.id)
    setFormData({ ...post })
  }

  const handleSave = async () => {
    if (editingId) {
      // 验证必填字段
      if (!formData.title || !formData.title.trim()) {
        alert('请输入标题')
        return
      }
      if (!formData.date || !formData.date.trim()) {
        alert('请输入日期')
        return
      }
      
      const postToSave = {
        ...formData,
        id: editingId,
        title: formData.title.trim(),
        date: formData.date.trim(),
        content: Array.isArray(formData.content) ? formData.content.filter(c => c && c.trim()) : (formData.content ? [formData.content] : ['']),
        gallery: Array.isArray(formData.gallery) ? formData.gallery.filter(g => g && g.trim()) : (formData.gallery ? [formData.gallery] : []),
      }
      
      const existingIndex = posts.findIndex((p) => p.id === editingId)
      let updated
      
      if (existingIndex >= 0) {
        updated = [...posts]
        updated[existingIndex] = postToSave
      } else {
        updated = [...posts, postToSave]
      }
      
      try {
        await onUpdate(updated.sort((a, b) => new Date(b.date) - new Date(a.date)))
        setEditingId(null)
        setFormData({})
        alert('保存成功！')
      } catch (error) {
        alert('保存失败：' + error.message)
        console.error('Save error:', error)
      }
    }
  }

  const handleDelete = (id) => {
    if (confirm('确定要删除这条记录吗？')) {
      onUpdate(posts.filter((p) => p.id !== id))
    }
  }

  const updateContent = (index, value) => {
    const newContent = [...formData.content]
    newContent[index] = value
    setFormData({ ...formData, content: newContent })
  }

  const addContentLine = () => {
    setFormData({ ...formData, content: [...formData.content, ''] })
  }

  const removeContentLine = (index) => {
    setFormData({ ...formData, content: formData.content.filter((_, i) => i !== index) })
  }

  const updateGallery = (index, value) => {
    const newGallery = [...formData.gallery]
    newGallery[index] = value
    setFormData({ ...formData, gallery: newGallery })
  }

  const addGalleryItem = () => {
    setFormData({ ...formData, gallery: [...formData.gallery, ''] })
  }

  const removeGalleryItem = (index) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) })
  }

  return (
    <div className="admin-manager">
      <div className="admin-manager__header">
        <h2>日常记录管理 ({posts.length})</h2>
        <button onClick={handleAdd} className="admin-btn admin-btn--primary">
          添加记录
        </button>
      </div>

      {editingId && (
        <div className="admin-form-card">
          <h3>编辑记录</h3>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>日期</label>
              <input
                type="text"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="2025年4月27号"
              />
            </div>
            <div className="admin-form-group">
              <label>标题</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>内容</label>
              {formData.content?.map((line, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <textarea
                    value={line}
                    onChange={(e) => updateContent(index, e.target.value)}
                    rows="2"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeContentLine(index)}
                    className="admin-btn admin-btn--small admin-btn--danger"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button type="button" onClick={addContentLine} className="admin-btn admin-btn--small">
                添加一行
              </button>
            </div>
            <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
              <label>图片URL</label>
              {formData.gallery?.map((url, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateGallery(index, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryItem(index)}
                    className="admin-btn admin-btn--small admin-btn--danger"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button type="button" onClick={addGalleryItem} className="admin-btn admin-btn--small">
                添加图片
              </button>
            </div>
          </div>
          <div className="admin-form-actions">
            <button onClick={handleSave} className="admin-btn admin-btn--primary">
              保存
            </button>
            <button onClick={() => { setEditingId(null); setFormData({}) }} className="admin-btn admin-btn--secondary">
              取消
            </button>
          </div>
        </div>
      )}

      <div className="admin-list">
        {posts
          .sort((a, b) => {
            const aKey = getYearMonthString(a.date)
            const bKey = getYearMonthString(b.date)
            return bKey.localeCompare(aKey)
          })
          .map((post) => (
            <div key={post.id} className="admin-list-item">
              <div className="admin-list-item__content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{post.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: '#6d9482', background: '#f7f3ec', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
                    {getYearMonthString(post.date)}
                  </span>
                </div>
                <p style={{ margin: '0.25rem 0', color: '#666' }}>{post.date}</p>
                <p className="admin-list-item__meta">{post.content?.join(' | ')}</p>
              </div>
              <div className="admin-list-item__actions">
                <button onClick={() => handleEdit(post)} className="admin-btn admin-btn--small">
                  编辑
                </button>
                <button onClick={() => handleDelete(post.id)} className="admin-btn admin-btn--small admin-btn--danger">
                  删除
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// 个人信息管理组件
const ProfileManager = ({ profile, socialLinks, onUpdateProfile, onUpdateSocialLinks }) => {
  const [profileForm, setProfileForm] = useState(profile)
  const [linksForm, setLinksForm] = useState(socialLinks)

  const handleProfileSave = async () => {
    await onUpdateProfile(profileForm)
    alert('个人信息已保存到本地存储')
  }

  const handleLinkSave = async () => {
    await onUpdateSocialLinks(linksForm)
    alert('社交链接已保存到本地存储')
  }

  const updateLink = (index, field, value) => {
    const updated = [...linksForm]
    updated[index] = { ...updated[index], [field]: value }
    setLinksForm(updated)
  }

  const addLink = () => {
    setLinksForm([...linksForm, { name: '', icon: '', url: '' }])
  }

  const removeLink = (index) => {
    setLinksForm(linksForm.filter((_, i) => i !== index))
  }

  return (
    <div className="admin-manager">
      <div className="admin-form-card">
        <h2>个人信息</h2>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>姓名</label>
            <input
              type="text"
              value={profileForm.name || ''}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label>座右铭</label>
            <input
              type="text"
              value={profileForm.motto || ''}
              onChange={(e) => setProfileForm({ ...profileForm, motto: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label>简介</label>
            <textarea
              value={profileForm.tagline || ''}
              onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              rows="3"
            />
          </div>
        </div>
        <div className="admin-form-actions">
          <button onClick={handleProfileSave} className="admin-btn admin-btn--primary">
            保存个人信息
          </button>
        </div>
      </div>

      <div className="admin-form-card" style={{ marginTop: '2rem' }}>
        <div className="admin-manager__header">
          <h2>社交链接</h2>
          <button onClick={addLink} className="admin-btn admin-btn--primary">
            添加链接
          </button>
        </div>
        {linksForm.map((link, index) => (
          <div key={index} className="admin-form-grid" style={{ marginBottom: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
            <div className="admin-form-group">
              <label>名称</label>
              <input
                type="text"
                value={link.name || ''}
                onChange={(e) => updateLink(index, 'name', e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label>图标（emoji）</label>
              <input
                type="text"
                value={link.icon || ''}
                onChange={(e) => updateLink(index, 'icon', e.target.value)}
                placeholder="💬"
              />
            </div>
            <div className="admin-form-group">
              <label>链接</label>
              <input
                type="text"
                value={link.url || ''}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
              />
            </div>
            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={() => removeLink(index)} className="admin-btn admin-btn--danger">
                删除
              </button>
            </div>
          </div>
        ))}
        <div className="admin-form-actions">
          <button onClick={handleLinkSave} className="admin-btn admin-btn--primary">
            保存社交链接
          </button>
        </div>
      </div>
    </div>
  )
}

// 设置管理组件
const SettingsManager = ({ introNotes, aboutMilestones, peaceNotes, tools, onUpdateIntroNotes, onUpdateAboutMilestones, onUpdatePeaceNotes, onUpdateTools }) => {
  const [introForm, setIntroForm] = useState(introNotes)
  const [milestonesForm, setMilestonesForm] = useState(aboutMilestones)
  const [peaceForm, setPeaceForm] = useState(peaceNotes)
  const [toolsForm, setToolsForm] = useState(tools)

  const updateArrayItem = (array, index, value, setter) => {
    const updated = [...array]
    updated[index] = value
    setter(updated)
  }

  const addArrayItem = (array, setter, defaultValue) => {
    setter([...array, defaultValue])
  }

  const removeArrayItem = (array, index, setter) => {
    setter(array.filter((_, i) => i !== index))
  }

  return (
    <div className="admin-manager">
      <div className="admin-form-card">
        <h2>介绍列表</h2>
        <div className="settings-list-container">
          {introForm.map((note, index) => (
            <div key={index} className="settings-list-item">
              <input
                type="text"
                value={note}
                onChange={(e) => updateArrayItem(introForm, index, e.target.value, setIntroForm)}
                className="settings-list-input"
                placeholder="输入介绍内容..."
              />
              <button 
                onClick={() => removeArrayItem(introForm, index, setIntroForm)} 
                className="settings-list-delete"
                aria-label="删除"
                title="删除"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="settings-actions">
          <button onClick={() => addArrayItem(introForm, setIntroForm, '')} className="admin-btn admin-btn--secondary">
            添加
          </button>
          <button onClick={async () => { await onUpdateIntroNotes(introForm); alert('已保存到本地存储') }} className="admin-btn admin-btn--primary">
            保存
          </button>
        </div>
      </div>

      <div className="admin-form-card" style={{ marginTop: '2rem' }}>
        <h2>关于我 - 里程碑</h2>
        <div className="settings-list-container">
          {milestonesForm.map((milestone, index) => (
            <div key={index} className="settings-list-item">
              <input
                type="text"
                value={milestone}
                onChange={(e) => updateArrayItem(milestonesForm, index, e.target.value, setMilestonesForm)}
                className="settings-list-input"
                placeholder="输入里程碑内容..."
              />
              <button 
                onClick={() => removeArrayItem(milestonesForm, index, setMilestonesForm)} 
                className="settings-list-delete"
                aria-label="删除"
                title="删除"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="settings-actions">
          <button onClick={() => addArrayItem(milestonesForm, setMilestonesForm, '')} className="admin-btn admin-btn--secondary">
            添加
          </button>
          <button onClick={async () => { await onUpdateAboutMilestones(milestonesForm); alert('已保存到本地存储') }} className="admin-btn admin-btn--primary">
            保存
          </button>
        </div>
      </div>

      <div className="admin-form-card" style={{ marginTop: '2rem' }}>
        <h2>平平无奇 - 笔记</h2>
        {peaceForm.map((note, index) => (
          <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
            <div className="admin-form-group">
              <label>标题</label>
              <input
                type="text"
                value={note.title || ''}
                onChange={(e) => {
                  const updated = [...peaceForm]
                  updated[index] = { ...updated[index], title: e.target.value }
                  setPeaceForm(updated)
                }}
              />
            </div>
            <div className="admin-form-group">
              <label>内容</label>
              <textarea
                value={note.content || ''}
                onChange={(e) => {
                  const updated = [...peaceForm]
                  updated[index] = { ...updated[index], content: e.target.value }
                  setPeaceForm(updated)
                }}
                rows="3"
              />
            </div>
            <button onClick={() => removeArrayItem(peaceForm, index, setPeaceForm)} className="admin-btn admin-btn--small admin-btn--danger">
              删除
            </button>
          </div>
        ))}
        <button onClick={() => addArrayItem(peaceForm, setPeaceForm, { title: '', content: '' })} className="admin-btn admin-btn--small">
          添加
        </button>
        <div className="admin-form-actions" style={{ marginTop: '1rem' }}>
          <button onClick={async () => { await onUpdatePeaceNotes(peaceForm); alert('已保存到本地存储') }} className="admin-btn admin-btn--primary">
            保存
          </button>
        </div>
      </div>

      <div className="admin-form-card" style={{ marginTop: '2rem' }}>
        <h2>工具列表</h2>
        {toolsForm.map((tool, index) => (
          <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '8px' }}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label>名称</label>
                <input
                  type="text"
                  value={tool.name || ''}
                  onChange={(e) => {
                    const updated = [...toolsForm]
                    updated[index] = { ...updated[index], name: e.target.value }
                    setToolsForm(updated)
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label>描述</label>
                <input
                  type="text"
                  value={tool.description || ''}
                  onChange={(e) => {
                    const updated = [...toolsForm]
                    updated[index] = { ...updated[index], description: e.target.value }
                    setToolsForm(updated)
                  }}
                />
              </div>
              <div className="admin-form-group">
                <label>链接</label>
                <input
                  type="text"
                  value={tool.link || ''}
                  onChange={(e) => {
                    const updated = [...toolsForm]
                    updated[index] = { ...updated[index], link: e.target.value }
                    setToolsForm(updated)
                  }}
                />
              </div>
              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={() => removeArrayItem(toolsForm, index, setToolsForm)} className="admin-btn admin-btn--danger">
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => addArrayItem(toolsForm, setToolsForm, { name: '', description: '', link: '' })} className="admin-btn admin-btn--small">
          添加
        </button>
        <div className="admin-form-actions" style={{ marginTop: '1rem' }}>
          <button onClick={async () => { await onUpdateTools(toolsForm); alert('已保存到本地存储') }} className="admin-btn admin-btn--primary">
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

