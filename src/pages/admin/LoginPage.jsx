import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import './Admin.css'

const LoginPage = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (login(password)) {
      navigate('/admin')
    } else {
      setError('密码错误，请重试')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>后台管理</h1>
        <p className="admin-login__hint">默认密码：admin123</p>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              autoFocus
            />
          </div>
          {error && <div className="admin-error">{error}</div>}
          <button type="submit" className="admin-btn admin-btn--primary">
            登录
          </button>
        </form>
        <div className="admin-login__footer">
          <a href="/">返回首页</a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

