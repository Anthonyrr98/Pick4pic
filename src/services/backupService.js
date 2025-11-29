// 备份提醒服务
import { saveToDB, loadFromDB } from './storageService'
import { exportAllData } from './dataService'

const STORAGE_KEY = 'blog_backup_reminder'
const DEFAULT_REMINDER_DAYS = 7 // 默认7天提醒一次

// 获取备份提醒设置
export const getBackupReminderSettings = async () => {
  try {
    const settings = await loadFromDB(STORAGE_KEY, {
      enabled: true,
      reminderDays: DEFAULT_REMINDER_DAYS,
      lastBackupDate: null,
      lastReminderDate: null,
    })
    return settings
  } catch (error) {
    console.error('Failed to load backup reminder settings:', error)
    return {
      enabled: true,
      reminderDays: DEFAULT_REMINDER_DAYS,
      lastBackupDate: null,
      lastReminderDate: null,
    }
  }
}

// 保存备份提醒设置
export const saveBackupReminderSettings = async (settings) => {
  try {
    await saveToDB(STORAGE_KEY, settings)
  } catch (error) {
    console.error('Failed to save backup reminder settings:', error)
    throw error
  }
}

// 更新最后备份日期
export const updateLastBackupDate = async () => {
  try {
    const settings = await getBackupReminderSettings()
    settings.lastBackupDate = new Date().toISOString()
    settings.lastReminderDate = null // 重置提醒日期
    await saveBackupReminderSettings(settings)
  } catch (error) {
    console.error('Failed to update last backup date:', error)
    throw error
  }
}

// 检查是否需要提醒备份
export const shouldRemindBackup = async () => {
  try {
    const settings = await getBackupReminderSettings()
    
    if (!settings.enabled) {
      return false
    }
    
    const now = new Date()
    const reminderDays = settings.reminderDays || DEFAULT_REMINDER_DAYS
    
    // 如果没有备份过，立即提醒
    if (!settings.lastBackupDate) {
      return true
    }
    
    const lastBackup = new Date(settings.lastBackupDate)
    const daysSinceBackup = Math.floor((now - lastBackup) / (1000 * 60 * 60 * 24))
    
    // 如果超过提醒天数，且今天还没提醒过
    if (daysSinceBackup >= reminderDays) {
      const lastReminder = settings.lastReminderDate 
        ? new Date(settings.lastReminderDate)
        : null
      
      // 如果今天还没提醒过，或者上次提醒不是今天
      if (!lastReminder || lastReminder.toDateString() !== now.toDateString()) {
        return true
      }
    }
    
    return false
  } catch (error) {
    console.error('Failed to check backup reminder:', error)
    return false
  }
}

// 标记已提醒
export const markReminderShown = async () => {
  try {
    const settings = await getBackupReminderSettings()
    settings.lastReminderDate = new Date().toISOString()
    await saveBackupReminderSettings(settings)
  } catch (error) {
    console.error('Failed to mark reminder shown:', error)
    throw error
  }
}

// 自动备份（导出数据）
export const autoBackup = async () => {
  try {
    const data = exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    await updateLastBackupDate()
    return true
  } catch (error) {
    console.error('Failed to auto backup:', error)
    throw error
  }
}

