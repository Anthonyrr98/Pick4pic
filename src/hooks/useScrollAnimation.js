import { useEffect, useRef, useState } from 'react'

// 自定义 Hook：检测元素是否进入视口，用于滚动动画
export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // 可选：一旦显示就不再观察，提升性能
          if (options.once !== false) {
            observer.unobserve(element)
          }
        } else if (!options.once) {
          setIsVisible(false)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px 0px -50px 0px',
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [options.threshold, options.rootMargin, options.once])

  return [elementRef, isVisible]
}

