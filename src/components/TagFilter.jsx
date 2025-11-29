import './TagFilter.css'

const TagFilter = ({ tags, selectedTags, onToggleTag }) => {
  if (!tags || tags.length === 0) return null

  return (
    <div className="tag-filter">
      {tags.map((tag) => (
        <button
          key={tag.name}
          className={`tag-filter__item ${selectedTags.includes(tag.name) ? 'active' : ''}`}
          onClick={() => onToggleTag(tag.name)}
        >
          {tag.name}
          <span className="tag-filter__count">({tag.count})</span>
        </button>
      ))}
    </div>
  )
}

export default TagFilter

