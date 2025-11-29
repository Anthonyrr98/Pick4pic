// 虚拟滚动列表组件（简化版）
import { useState, useEffect, useRef, useMemo } from 'react'

const VirtualList = ({ items, itemHeight = 100, renderItem, containerHeight = 400 }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )
    return { start, end }
  }, [scrollTop, itemHeight, containerHeight, items.length])

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      ...item,
      index: visibleRange.start + index,
    }))
  }, [items, visibleRange])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.start * itemHeight

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop)
  }

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        position: 'relative',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item) => (
            <div key={item.id || item.index} style={{ height: itemHeight }}>
              {renderItem(item, item.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualList

