"use client"
import { useState } from "react"
import {
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineLockClosed,
  HiOutlinePaperAirplane,
} from "react-icons/hi2"
import { LiaHeadsetSolid } from "react-icons/lia"

type Props = {
  locked: boolean
  lockReason?: string
  onSend: (content: string) => void
  isSending?: boolean
  sendError?: Error | null
  /** When present and the input is locked, surface a Take over button inline
   *  so operators don't have to scroll back up to the handoff card. */
  onTakeOver?: () => void
  isTakingOver?: boolean
}

const ReplyInput = ({
  locked,
  lockReason,
  onSend,
  isSending = false,
  sendError,
  onTakeOver,
  isTakingOver = false,
}: Props) => {
  const [content, setContent] = useState("")

  const handleSend = () => {
    const trimmed = content.trim()
    if (!trimmed || locked || isSending) return
    onSend(trimmed)
    setContent("")
  }

  if (locked) {
    return (
      <div className="bg-card border border-border rounded-card px-4 py-3 flex items-center gap-2 text-[11.5px] text-fg-subtle">
        <HiOutlineLockClosed size={14} className="shrink-0" />
        <span className="flex-1 truncate">{lockReason ?? "Reply locked."}</span>
        {onTakeOver && (
          <button
            type="button"
            onClick={onTakeOver}
            disabled={isTakingOver}
            className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-[6px] bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1"
          >
            {isTakingOver ? (
              <>
                <HiOutlineArrowPath size={11} className="animate-spin" />
                Taking over…
              </>
            ) : (
              <>
                <LiaHeadsetSolid size={11} />
                Take over
              </>
            )}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {sendError && (
        <div className="text-[11px] text-[#F09595] flex items-center gap-1.5 px-1">
          <HiOutlineExclamationTriangle size={12} className="shrink-0" />
          <span className="truncate">
            {sendError.message || "Couldn't send. Try again."}
          </span>
        </div>
      )}
      <div className="bg-card border border-border rounded-card flex items-end gap-2 px-3 py-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Type a reply…"
          rows={1}
          disabled={isSending}
          className="flex-1 bg-transparent text-[12.5px] text-fg outline-none resize-none disabled:opacity-50 min-h-[24px] max-h-[120px] py-1"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || isSending}
          className="text-[12px] px-3 py-1.5 rounded-[7px] bg-accent text-accent-fg font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-accent-hover flex items-center gap-1.5"
        >
          {isSending ? (
            <>
              <HiOutlineArrowPath size={12} className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <HiOutlinePaperAirplane size={12} />
              Send
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ReplyInput
