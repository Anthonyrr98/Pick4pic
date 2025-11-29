import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import TimelineDetail from './TimelineDetail'

const Timeline = ({ entries }) => {
  const [selectedEntry, setSelectedEntry] = useState(null)

  return (
    <>
      <div className="timeline">
        {entries.map((entry, index) => (
          <TimelineItem
            key={`${entry.year}-${entry.title}`}
            entry={entry}
            index={index}
            onClick={() => setSelectedEntry(entry)}
          />
        ))}
      </div>
      {selectedEntry && (
        <TimelineDetail entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </>
  )
}

const TimelineItem = ({ entry, index, onClick }) => {
  const [ref, isVisible] = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px',
    once: true,
  })

  return (
    <article
      ref={ref}
      className={`timeline-item ${isVisible ? 'timeline-item--visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <span className="timeline-item__year">{entry.year}</span>
      <img src={entry.image} alt={entry.title} loading="lazy" />
      <div>
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
      </div>
      <div className="timeline-item__hover-indicator">点击查看详情 →</div>
    </article>
  )
}

export default Timeline

