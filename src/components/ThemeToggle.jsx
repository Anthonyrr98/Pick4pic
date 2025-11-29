import { useTheme } from '../hooks/useTheme'
import './ThemeToggle.css'

const ThemeToggle = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="切换主题">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}

export default ThemeToggle

