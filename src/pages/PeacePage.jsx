import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import { getPeaceNotes } from '../services/dataService'

const PeacePage = () => {
  const [peaceNotes, setPeaceNotes] = useState(getPeaceNotes())

  useEffect(() => {
    const interval = setInterval(() => {
      setPeaceNotes(getPeaceNotes())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="page">
      <PageHero title="平平无奇" subtitle="安静一点，听见自己的回声" />
      <div className="peace-grid">
        {peaceNotes.map((note, index) => (
          <article key={index} className="peace-card">
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default PeacePage

