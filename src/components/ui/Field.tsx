import React from 'react'

type Props = {
  label: string
  required?: boolean
  error?: boolean
  hint?: React.ReactNode
  children: React.ReactNode
  className?: string
}

const Field = ({ label, required, error, hint, children, className = '' }: Props) => {
  const labelTone = error ? 'text-[#F09595]' : 'text-fg-muted'
  const starTone = error ? 'text-[#F09595]' : 'text-[#F0A92B]'
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className={`text-[10.5px] flex items-center gap-1 ${labelTone}`}>
        {label}
        {required && <span className={`${starTone} text-[11px]`}>*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[10.5px] text-fg-subtle leading-snug">{hint}</p>
      )}
    </div>
  )
}

export default Field
