import { useLanguage } from '../contexts/LanguageContext'
import './LanguageToggle.css'

const LanguageToggle = () => {
  const [language, , toggleLanguage] = useLanguage()

  const handleClick = () => {
    toggleLanguage()
    // 强制重新渲染
    window.dispatchEvent(new Event('languagechange'))
  }

  return (
    <button className="language-toggle" onClick={handleClick} aria-label="切换语言">
      {language === 'zh' ? 'EN' : '中'}
    </button>
  )
}

export default LanguageToggle

