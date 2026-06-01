import { useEffect, useRef } from 'react'

export function useClickOutside<T extends HTMLElement>(
  enabled: boolean,
  onOutside: () => void,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!enabled) return
    const handler = (e: MouseEvent | TouchEvent) => {
      const el = ref.current
      if (el && !el.contains(e.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [enabled, onOutside])

  return ref
}
