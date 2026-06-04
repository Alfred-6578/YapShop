"use client"
import {
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineUser,
  HiOutlineUserPlus,
  HiOutlineXMark,
} from "react-icons/hi2"
import { LiaHeadsetSolid, LiaRobotSolid } from "react-icons/lia"

import { formatRelative } from "@/lib/utils/format"
import type { ConversationResponse, StaffResponse } from "@/lib/api/types"

type Props = {
  conversation: ConversationResponse
  assignedStaff: StaffResponse | null
  currentStaff: StaffResponse | null
  onTakeOver: () => void
  onResolve: () => void
  isTakingOver: boolean
  isResolving: boolean
  mutationError: Error | null
}

type Tone = "neutral" | "attention" | "success" | "info" | "muted"

type PrimaryAction = {
  label: string
  icon: React.ReactNode
  loading: boolean
  onClick: () => void
}

type StateConfig = {
  tone: Tone
  icon: React.ReactNode
  title: string
  subtitle: string | null
  primaryAction: PrimaryAction | null
}

const TONE_STYLES: Record<Tone, string> = {
  neutral: "bg-card border-border",
  attention: "bg-[rgba(240,169,43,0.06)] border-[rgba(240,169,43,0.25)]",
  success: "bg-[rgba(21,194,106,0.06)] border-[rgba(21,194,106,0.25)]",
  info: "bg-[rgba(76,141,245,0.06)] border-[rgba(76,141,245,0.25)]",
  muted: "bg-card border-border opacity-70",
}

const ICON_COLORS: Record<Tone, string> = {
  neutral: "text-fg-muted",
  attention: "text-[#F0C36B]",
  success: "text-[#6FD9A0]",
  info: "text-[#8FB6F5]",
  muted: "text-fg-subtle",
}

const ConversationHandoffCard = ({
  conversation,
  assignedStaff,
  currentStaff,
  onTakeOver,
  onResolve,
  isTakingOver,
  isResolving,
  mutationError,
}: Props) => {
  const isAssignedToMe =
    !!currentStaff && currentStaff.id === conversation.assigned_staff_id
  const status = conversation.handoff_status
  const isMutating = isTakingOver || isResolving

  const stateConfig: StateConfig | null = (() => {
    if (!status || status === "none") {
      return {
        tone: "neutral",
        icon: <LiaRobotSolid size={20} />,
        title: "AI is handling this conversation",
        subtitle: "Customer is talking to the AI assistant.",
        primaryAction: {
          label: "Take over",
          icon: <LiaHeadsetSolid size={13} />,
          loading: isTakingOver,
          onClick: onTakeOver,
        },
      }
    }
    if (status === "requested") {
      return {
        tone: "attention",
        icon: <HiOutlineExclamationCircle size={20} />,
        title: "Customer needs attention",
        subtitle:
          conversation.handoff_reason ?? "AI escalated this conversation.",
        primaryAction: {
          label: "Take over",
          icon: <LiaHeadsetSolid size={13} />,
          loading: isTakingOver,
          onClick: onTakeOver,
        },
      }
    }
    if (status === "active" && isAssignedToMe) {
      return {
        tone: "success",
        icon: <HiOutlineUser size={20} />,
        title: "You're handling this conversation",
        subtitle: conversation.handoff_started_at
          ? `Started ${formatRelative(conversation.handoff_started_at)}`
          : "Active now",
        primaryAction: {
          label: "Mark resolved",
          icon: <HiOutlineCheck size={13} />,
          loading: isResolving,
          onClick: onResolve,
        },
      }
    }
    if (status === "active") {
      return {
        tone: "info",
        icon: <HiOutlineUser size={20} />,
        title: `${assignedStaff?.name ?? "A staff member"} is handling this`,
        subtitle: conversation.handoff_started_at
          ? `Started ${formatRelative(conversation.handoff_started_at)}`
          : "Active now",
        primaryAction: {
          label: "Take over",
          icon: <HiOutlineUserPlus size={13} />,
          loading: isTakingOver,
          onClick: onTakeOver,
        },
      }
    }
    if (status === "resolved" || status === "cancelled") {
      const endedAt = conversation.handoff_ended_at
      let subtitle: string | null = null
      if (assignedStaff) {
        subtitle = `By ${assignedStaff.name}${
          endedAt ? ` · ${formatRelative(endedAt)}` : ""
        }`
      } else if (endedAt) {
        subtitle = formatRelative(endedAt)
      }
      return {
        tone: "muted",
        icon:
          status === "resolved" ? (
            <HiOutlineCheck size={20} />
          ) : (
            <HiOutlineXMark size={20} />
          ),
        title: status === "resolved" ? "Handoff resolved" : "Handoff cancelled",
        subtitle,
        primaryAction: null,
      }
    }
    return null
  })()

  if (!stateConfig) return null

  return (
    <div
      className={`${TONE_STYLES[stateConfig.tone]} border rounded-card p-4 flex flex-col gap-2`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`${ICON_COLORS[stateConfig.tone]} shrink-0 pt-0.5`}
        >
          {stateConfig.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-fg">
            {stateConfig.title}
          </div>
          {stateConfig.subtitle && (
            <div className="text-[11.5px] text-fg-muted mt-0.5">
              {stateConfig.subtitle}
            </div>
          )}
        </div>
        {stateConfig.primaryAction && (
          <button
            type="button"
            onClick={stateConfig.primaryAction.onClick}
            disabled={isMutating || !currentStaff}
            className="shrink-0 text-[12px] font-medium px-3 py-1.5 rounded-[7px] bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
          >
            {stateConfig.primaryAction.loading ? (
              <>
                <HiOutlineArrowPath size={13} className="animate-spin" />
                Working…
              </>
            ) : (
              <>
                {stateConfig.primaryAction.icon}
                {stateConfig.primaryAction.label}
              </>
            )}
          </button>
        )}
      </div>

      {mutationError && (
        <div className="text-[11px] text-[#F09595] flex items-center gap-1.5 ml-9">
          <HiOutlineExclamationTriangle size={12} className="shrink-0" />
          <span className="truncate">
            {mutationError.message || "Couldn't complete that action. Try again."}
          </span>
        </div>
      )}
    </div>
  )
}

export default ConversationHandoffCard
