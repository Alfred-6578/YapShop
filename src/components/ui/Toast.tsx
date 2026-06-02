"use client"
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiOutlineExclamationTriangle, HiXMark } from 'react-icons/hi2'

type Props = {
  message: string
  onClose: () => void
  /** Auto-dismiss after this many ms. Pass 0 to disable auto-dismiss. */
  duration?: number
  /** Visual variant. Defaults to 'warning' (amber). */
  variant?: 'warning' | 'error'
}

const variants: Record<NonNullable<Props['variant']>, string> = {
  warning: 'bg-[rgba(240,169,43,0.12)] border-[rgba(240,169,43,0.35)] text-[#F0C36B]',
  error: 'bg-[rgba(226,75,74,0.12)] border-[rgba(226,75,74,0.35)] text-[#F09595]',
}

const Toast = ({ message, onClose, duration = 4000, variant = 'warning' }: Props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (duration === 0) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  if (!mounted) return null

  return createPortal(
    <div
      role="alert"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-[90vw] flex items-start gap-2.5 border rounded-[10px] px-3.5 py-2.5 text-[12px] shadow-lg backdrop-blur-sm ${variants[variant]}`}
    >
      <HiOutlineExclamationTriangle size={15} className="mt-0.5 shrink-0" />
      <span className="min-w-0 leading-snug">{message}</span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="shrink-0 opacity-70 hover:opacity-100 cursor-pointer"
      >
        <HiXMark size={14} />
      </button>
    </div>,
    document.body,
  )
}

export default Toast
