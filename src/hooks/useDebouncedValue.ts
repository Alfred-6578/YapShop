"use client"
import { useEffect, useState } from "react"

/**
 * Returns a value that lags behind the input by `delay` ms. Updates to the
 * input within the delay window get coalesced — only the last value sticks.
 * Use for query keys driven by user input you don't want to hit on every
 * keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}
