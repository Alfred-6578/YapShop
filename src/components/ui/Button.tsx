import React from 'react'
import Link from 'next/link'

type Variant = 'primary' | 'ghost'

type CommonProps = {
  variant?: Variant
  children: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

type ButtonProps = CommonProps & {
  href?: undefined
  onClick?: () => void
  type?: 'button' | 'submit'
}

type LinkProps = CommonProps & {
  href: string
  onClick?: undefined
  type?: undefined
}

type Props = ButtonProps | LinkProps

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-hover',
  ghost: 'bg-transparent border border-border text-fg hover:bg-card-hover',
}

const Button = (props: Props) => {
  const {
    variant = 'ghost',
    children,
    icon,
    disabled = false,
    className = '',
  } = props

  const classes = `inline-flex items-center justify-center gap-1.5 h-8 px-3 py-2 rounded-[8px] text-[12.5px] font-medium transition-colors ${
    variants[variant]
  } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'} ${className}`

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {icon}
        {children}
      </Link>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
    >
      {icon}
      {children}
    </button>
  )
}

export default Button
