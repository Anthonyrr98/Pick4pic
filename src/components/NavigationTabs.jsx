import { NavLink } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { navigationTabs } from '../data/content'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'

const NavigationTabs = () => {
  const [, t] = useLanguage()

  return (
    <nav className="nav-tabs">
      <div className="nav-tabs__links">
        {navigationTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              ['nav-tab', isActive ? 'nav-tab--active' : ''].join(' ').trim()
            }
            end={tab.path === '/'}
          >
            {t(tab.labelKey || tab.label)}
          </NavLink>
        ))}
      </div>
      <div className="nav-tabs__controls">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </nav>
  )
}

export default NavigationTabs

