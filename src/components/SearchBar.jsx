import { useState, useEffect, useRef } from 'react'
import './SearchBar.css'

const SearchBar = ({ onSearch, placeholder = '搜索文章和记录...' }) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + K 快速打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // ESC 关闭搜索
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur()
        setQuery('')
        onSearch('')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFocused, onSearch])

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className={`search-bar ${isFocused ? 'focused' : ''}`}>
      <div className="search-bar__icon">🔍</div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="search-bar__input"
      />
      {query && (
        <button onClick={handleClear} className="search-bar__clear" aria-label="清除">
          ×
        </button>
      )}
      <div className="search-bar__hint">
        <kbd>Ctrl</kbd> + <kbd>K</kbd>
      </div>
    </div>
  )
}

export default SearchBar

