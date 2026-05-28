import React, { createContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'


interface ThemeContextValue {
    theme: Theme,
    setTheme: (theme: Theme) => void,
    toggle: () => void,
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const ThemeProvider = ({
    children,
    defaultTheme = 'dark',
}:{
    children: React.ReactNode,
    defaultTheme?: Theme,
}) => {
    const [theme, setTheme] = useState<Theme>(defaultTheme)

    useEffect(()=>{
        const applied = document.documentElement.getAttribute("data-theme")
        setTheme(applied === 'light' ? 'light':'dark')
    },[])

    
  return (
   
  )
}

export default ThemeProvider
