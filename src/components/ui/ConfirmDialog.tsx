"use client"
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from 'react-icons/hi2'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  /** Disables the buttons and shows a spinner on confirm — use while the
   *  underlying mutation is running so users can't double-trigger. */
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  isPending = false,
  onConfirm,
  onCancel,
}: Props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Escape to dismiss (unless mid-mutation).
  useEffect(() => {
    if (!open || isPending) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, isPending, onCancel])

  if (!mounted || !open) return null

  const confirmClasses = destructive
    ? 'bg-[#E24B4A] text-white hover:bg-[#C53D3C]'
    : 'bg-accent text-accent-fg hover:bg-accent-hover'

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div
        aria-hidden
        onClick={isPending ? undefined : onCancel}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[380px] bg-card border border-border-strong rounded-card p-4 shadow-xl">
        <div className="flex items-start gap-3">
          {destructive && (
            <div className="shrink-0 h-9 w-9 rounded-full bg-[rgba(226,75,74,0.12)] flex items-center justify-center text-[#F09595]">
              <HiOutlineExclamationTriangle size={18} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="confirm-title" className="text-[14px] font-medium text-fg">
              {title}
            </h2>
            <p className="text-[12px] text-fg-muted mt-1 leading-snug">{message}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="text-[12.5px] px-3 py-1.5 rounded-[8px] border border-border text-fg hover:bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`text-[12.5px] font-medium px-3 py-1.5 rounded-[8px] inline-flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${confirmClasses}`}
          >
            {isPending && <HiOutlineArrowPath size={13} className="animate-spin" />}
            {isPending ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConfirmDialog
