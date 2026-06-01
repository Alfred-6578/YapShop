"use client"
import React from 'react'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import { useTheme } from '@/context/ThemeProvider'
import IconButton from './IconButton'

const ThemeToggle = () => {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <IconButton
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggle}
      icon={isDark ? <HiOutlineMoon size={18} /> : <HiOutlineSun size={18} />}
    />
  )
}

export default ThemeToggle
