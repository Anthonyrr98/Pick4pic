import './App.css'
import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import NavigationTabs from './components/NavigationTabs'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import DailyLifePage from './pages/DailyLifePage'
import AboutPage from './pages/AboutPage'
import PeacePage from './pages/PeacePage'
import ToolsPage from './pages/ToolsPage'
import RSSPage from './pages/RSSPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/admin/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <LanguageProvider>
      <Routes>
      <Route
        path="/*"
        element={
          <div className="app">
            <div className="app-shell">
              <NavigationTabs />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/articles" element={<ArticlesPage />} />
                  <Route path="/life" element={<DailyLifePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/peace" element={<PeacePage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/rss" element={<RSSPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <ScrollToTop />
            </div>
          </div>
        }
      />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      </Routes>
    </LanguageProvider>
  )
}

export default App
