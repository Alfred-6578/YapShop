import React from 'react'

type Variant = 'primary' | 'ghost'

type Props = {
  variant?: Variant
  children: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-hover',
  ghost: 'bg-transparent border border-border text-fg hover:bg-card-hover',
}

const Button = ({
  variant = 'ghost',
  children,
  icon,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 h-8 px-3 py-2 rounded-[8px] text-[12.5px] font-medium transition-colors ${
        variants[variant]
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button
