// 本地存储服务 - 使用 IndexedDB 提供更可靠的本地存储
const DB_NAME = 'Pick4picBlog'
const DB_VERSION = 1
const STORE_NAME = 'blogData'

let db = null

// 初始化数据库
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }
  })
}

// 保存数据到 IndexedDB
export const saveToDB = async (key, data) => {
  try {
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await new Promise((resolve, reject) => {
      const request = store.put(data, key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
    
    // 同时保存到 localStorage 作为备份
    try {
      localStorage.setItem(`db_backup_${key}`, JSON.stringify(data))
    } catch (e) {
      console.warn('localStorage backup failed:', e)
    }
  } catch (error) {
    console.error('Failed to save to IndexedDB:', error)
    // 降级到 localStorage
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
      throw e
    }
  }
}

// 从 IndexedDB 读取数据
export const loadFromDB = async (key, defaultValue = null) => {
  try {
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    return await new Promise((resolve, reject) => {
      const request = store.get(key)
      request.onsuccess = () => {
        const result = request.result
        if (result !== undefined) {
          resolve(result)
        } else {
          // 尝试从 localStorage 恢复
          try {
            const backup = localStorage.getItem(`db_backup_${key}`)
            if (backup) {
              resolve(JSON.parse(backup))
            } else {
              const fallback = localStorage.getItem(key)
              resolve(fallback ? JSON.parse(fallback) : defaultValue)
            }
          } catch (e) {
            resolve(defaultValue)
          }
        }
      }
      request.onerror = () => {
        // 降级到 localStorage
        try {
          const fallback = localStorage.getItem(key)
          resolve(fallback ? JSON.parse(fallback) : defaultValue)
        } catch (e) {
          resolve(defaultValue)
        }
      }
    })
  } catch (error) {
    console.error('Failed to load from IndexedDB:', error)
    // 降级到 localStorage
    try {
      const fallback = localStorage.getItem(key)
      return fallback ? JSON.parse(fallback) : defaultValue
    } catch (e) {
      return defaultValue
    }
  }
}

// 导出所有数据到文件
export const exportToFile = async (data, filename = null) => {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `blog-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 从文件导入数据
export const importFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        resolve(data)
      } catch (error) {
        reject(new Error('文件格式错误'))
      }
    }
    reader.onerror = () => {
      reject(new Error('读取文件失败'))
    }
    reader.readAsText(file)
  })
}

// 清除所有数据
export const clearAllData = async () => {
  try {
    const database = await initDB()
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    await new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Failed to clear IndexedDB:', error)
  }
  
  // 同时清除 localStorage
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('blog_') || key.startsWith('db_backup_')) {
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.error('Failed to clear localStorage:', e)
  }
}

// 获取存储使用情况
export const getStorageInfo = async () => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        usagePercent: ((estimate.usage / estimate.quota) * 100).toFixed(2),
      }
    }
  } catch (e) {
    console.error('Failed to get storage info:', e)
  }
  return null
}

