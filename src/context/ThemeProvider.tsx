"use client"
import React, { createContext, useCallback, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const applied = document.documentElement.getAttribute('data-theme')
    setThemeState(applied === 'light' ? 'light' : 'dark')
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    const root = document.documentElement
    if (next === 'light') root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
