import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { getTools } from '../services/dataService'

const ToolsPage = () => {
  const [tools, setTools] = useState(getTools())

  useEffect(() => {
    const interval = setInterval(() => {
      setTools(getTools())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page">
      <PageHero title="工具" subtitle="那些让我保持灵感的好物" />
      <div className="tools-grid">
        {tools.map((tool, index) => (
          <article key={index} className="tool-card">
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <a href={tool.link} target="_blank" rel="noreferrer">
              查看
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ToolsPage

