import React from 'react'
import {
  HiOutlineArrowRight,
  HiOutlineCheck,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'
import type { Message } from '@/lib/conversations/mockData'

type Props = {
  message: Message
}

const iconFor = (hint: string | undefined): React.ReactNode => {
  switch (hint) {
    case 'arrow-right':
      return <HiOutlineArrowRight size={11} />
    case 'check':
      return <HiOutlineCheck size={11} />
    default:
      return <HiOutlineInformationCircle size={11} />
  }
}

const SystemEvent = ({ message }: Props) => {
  return (
    <div className="self-center inline-flex items-center gap-1 text-[10px] text-fg-muted bg-white/[0.04] rounded-[8px] px-2 py-1">
      {iconFor(message.icon)}
      <span>{message.body}</span>
    </div>
  )
}

export default SystemEvent
