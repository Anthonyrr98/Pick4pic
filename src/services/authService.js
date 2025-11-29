// 简单的身份验证服务
const AUTH_KEY = 'blog_admin_auth'
const DEFAULT_PASSWORD = 'admin123' // 默认密码，首次使用时设置

// 检查是否已登录
export const isAuthenticated = () => {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

// 登录
export const login = (password) => {
  const savedPassword = localStorage.getItem('blog_admin_password') || DEFAULT_PASSWORD
  
  if (password === savedPassword) {
    localStorage.setItem(AUTH_KEY, 'true')
    return true
  }
  return false
}

// 登出
export const logout = () => {
  localStorage.removeItem(AUTH_KEY)
}

// 设置新密码
export const setPassword = (newPassword) => {
  localStorage.setItem('blog_admin_password', newPassword)
}

// 获取当前密码（用于显示，实际应该加密）
export const getPassword = () => {
  return localStorage.getItem('blog_admin_password') || DEFAULT_PASSWORD
}

