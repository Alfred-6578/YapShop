import React from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'

type Props = {
  text: string
  onDismiss?: () => void
}

const AttentionBanner = ({ text, onDismiss }: Props) => {
  return (
    <div className="bg-[rgba(240,169,43,0.1)] border border-[rgba(240,169,43,0.25)] rounded-[10px] px-3 py-2 flex items-center gap-2.5 text-[11.5px] text-[#F0C36B]">
      <HiOutlineExclamationCircle size={15} className="shrink-0" />
      <span className="flex-1 min-w-0">{text}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[11.5px] text-[#F0C36B] cursor-pointer underline shrink-0"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}

export default AttentionBanner
