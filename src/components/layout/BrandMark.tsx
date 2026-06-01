import React from 'react'
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'

type Size = 'sm' | 'md'

const sizes: Record<Size, { box: string; icon: number }> = {
  sm: { box: 'h-9 w-9', icon: 18 },
  md: { box: 'h-10 w-10', icon: 20 },
}

const BrandMark = ({ size = 'md' }: { size?: Size }) => {
  const s = sizes[size]
  return (
    <div className={`${s.box} rounded-control bg-accent text-accent-fg flex items-center justify-center shrink-0`}>
      <HiOutlineChatBubbleLeftRight size={s.icon} />
    </div>
  )
}

export default BrandMark
