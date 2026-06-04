"use client"
import {
  HiOutlineArrowPath,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineCheck,
  HiOutlineCog6Tooth,
  HiOutlineUser,
  HiOutlineUserPlus,
  HiOutlineXMark,
} from "react-icons/hi2"
import { LiaRobotSolid } from "react-icons/lia"

import AssignStaffDropdown from "./AssignStaffDropdown"
import { getWaitBucket } from "@/lib/handoffs/utils"
import { getDisplayName } from "@/lib/customers/utils"
import type {
  CustomerResponse,
  HandoffTriggerType,
  HumanHandOffResponse,
  StaffResponse,
} from "@/lib/api/types"
import type { PendingMutation } from "./HandoffsList"

type Props = {
  handoff: HumanHandOffResponse
  staff: StaffResponse[]
  /** Resolved via the page-level conversation→customer lookup. Null until the
   *  conversations + customers queries load (rows render with placeholders). */
  customer: CustomerResponse | null
  pendingMutation: PendingMutation
  onResolve: (id: string) => void
  onCancel: (id: string) => void
  onAssign: (id: string, staffId: string) => void
  onOpenConversation: (conversationId: string) => void
}

const COLORS = [
  "#7C2D5E",
  "#1F4D7A",
  "#5C3B7E",
  "#7A4419",
  "#2A6E54",
  "#3A3D44",
]

const hashColor = (seed: string): string => {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return COLORS[Math.abs(h) % COLORS.length]
}

const initialsFromName = (name?: string | null): string => {
  if (!name) return "C?"
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return "C?"
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase()
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase()
}

const formatMinutesSince = (iso: string): string => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (mins < 1) return "<1m"
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const rem = mins % 60
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`
}

const TriggerTag = ({ triggered_by }: { triggered_by: HandoffTriggerType }) => {
  const base =
    "text-[9.5px] px-1.5 py-0 rounded-[4px] inline-flex items-center gap-1"

  if (triggered_by === "ai") {
    return (
      <span className={`${base} bg-[rgba(76,141,245,0.16)] text-[#8FB6F5]`}>
        <LiaRobotSolid size={10} />
        AI
      </span>
    )
  }
  if (triggered_by === "customer") {
    return (
      <span className={`${base} bg-[rgba(245,158,76,0.16)] text-[#F5BD8F]`}>
        <HiOutlineUser size={10} />
        Customer
      </span>
    )
  }
  if (triggered_by === "staff") {
    return (
      <span className={`${base} bg-[rgba(21,194,106,0.16)] text-[#6FD9A0]`}>
        <HiOutlineUser size={10} />
        Staff
      </span>
    )
  }
  return (
    <span className={`${base} bg-white/10 text-fg-muted`}>
      <HiOutlineCog6Tooth size={10} />
      Rule
    </span>
  )
}

const HandoffRow = ({
  handoff,
  staff,
  customer,
  pendingMutation,
  onResolve,
  onCancel,
  onAssign,
  onOpenConversation,
}: Props) => {
  const mode: "pending" | "active" | "resolved" =
    handoff.status === "pending"
      ? "pending"
      : handoff.status === "active"
        ? "active"
        : "resolved"

  const isResolvingThisRow =
    pendingMutation?.id === handoff.id && pendingMutation.kind === "resolve"
  const isCancellingThisRow =
    pendingMutation?.id === handoff.id && pendingMutation.kind === "cancel"
  const isAssigningThisRow =
    pendingMutation?.id === handoff.id && pendingMutation.kind === "assign"
  const anyMutationOnPage = pendingMutation !== null

  const customerName = customer ? getDisplayName(customer) : "Loading…"
  const customerWa = customer?.whatsapp_number ?? ""
  const initials = initialsFromName(customer?.name ?? customer?.display_name)
  const color = hashColor(handoff.conversation_id)

  // Prefer the nested staff summary (saves the list lookup); fall back to the
  // staff list passed in (e.g. if the server stops embedding `staff` later).
  const assignedName =
    handoff.staff?.name ??
    (handoff.assigned_staff_id
      ? (staff.find((s) => s.id === handoff.assigned_staff_id)?.name ?? null)
      : null)

  const waitBucket = getWaitBucket(handoff)
  const waitColor =
    waitBucket === "urgent"
      ? "text-[#F09595]"
      : waitBucket === "warning"
        ? "text-[#F0C36B]"
        : "text-fg-muted"

  const openButton = (
    <button
      type="button"
      onClick={() => onOpenConversation(handoff.conversation_id)}
      aria-label="Open conversation"
      className="bg-transparent border-[0.5px] border-border rounded-[7px] px-2 py-1.5 text-fg-muted hover:text-fg cursor-pointer inline-flex items-center"
    >
      <HiOutlineArrowTopRightOnSquare size={13} />
    </button>
  )

  return (
    <div className="grid grid-cols-[40px_minmax(0,1fr)_auto_auto] gap-2.5 items-center px-3.5 py-3 hover:bg-white/2 border-b border-white/4 last:border-b-0 relative">
      <div
        className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-medium"
        style={{ backgroundColor: color, color: "rgba(255,255,255,0.85)" }}
      >
        {initials}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12.5px] text-fg font-medium">{customerName}</span>
          {customerWa && (
            <span className="font-mono text-[10.5px] text-fg-subtle">
              {customerWa}
            </span>
          )}
          <TriggerTag triggered_by={handoff.triggered_by} />
        </div>
        <div className="text-[11.5px] text-fg-muted truncate max-w-[330px]">
          {handoff.reason ?? "—"}
        </div>
      </div>

      <div className="flex max-vsm:flex-col gap-1 relative">
        {mode === "pending" && (
          <div className="flex flex-col items-end">
            <span className={`text-[13px] font-medium tnum ${waitColor}`}>
              {formatMinutesSince(handoff.requested_at)}
            </span>
            <span className="text-[10px] text-fg-subtle">waiting</span>
          </div>
        )}

        {mode === "active" && (
          <div className="flex flex-col items-end">
            <span className="text-[12.5px] text-[#6FD9A0] font-medium">
              {assignedName ?? "Unassigned"}
            </span>
            {handoff.claimed_at && (
              <span className="text-[10px] text-fg-subtle">
                Since {formatMinutesSince(handoff.claimed_at)}
              </span>
            )}
          </div>
        )}

        {mode === "resolved" && (
          <div className="flex flex-col items-end">
            <span className="text-[11.5px] text-fg-muted">
              {handoff.status === "cancelled"
                ? "Cancelled"
                : assignedName
                  ? `Resolved by ${assignedName}`
                  : "Resolved"}
            </span>
            {handoff.resolved_at && (
              <span className="text-[10px] text-fg-subtle">
                {formatMinutesSince(handoff.resolved_at)} ago
              </span>
            )}
          </div>
        )}

        <div className="flex gap-1 relative">
          {openButton}

          {mode === "pending" && (
            <>
              <AssignStaffDropdown
                staff={staff}
                currentlyAssignedStaffId={handoff.assigned_staff_id}
                onAssign={(staffId) => onAssign(handoff.id, staffId)}
                disabled={anyMutationOnPage}
                trigger={
                  isAssigningThisRow ? (
                    <>
                      <HiOutlineArrowPath size={12} className="animate-spin" />
                      Assigning…
                    </>
                  ) : (
                    <>
                      <HiOutlineUserPlus size={12} />
                      Assign
                    </>
                  )
                }
              />
              <button
                type="button"
                onClick={() => onCancel(handoff.id)}
                disabled={anyMutationOnPage}
                aria-label={isCancellingThisRow ? "Cancelling…" : "Cancel handoff"}
                className="bg-transparent border-[0.5px] border-border rounded-[7px] px-2 py-1.5 text-[#F09595] hover:bg-[rgba(226,75,74,0.08)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center"
              >
                {isCancellingThisRow ? (
                  <HiOutlineArrowPath size={13} className="animate-spin" />
                ) : (
                  <HiOutlineXMark size={13} />
                )}
              </button>
            </>
          )}

          {mode === "active" && (
            <>
              <AssignStaffDropdown
                staff={staff}
                currentlyAssignedStaffId={handoff.assigned_staff_id}
                onAssign={(staffId) => onAssign(handoff.id, staffId)}
                disabled={anyMutationOnPage}
                trigger={
                  isAssigningThisRow ? (
                    <>
                      <HiOutlineArrowPath size={12} className="animate-spin" />
                      Reassigning…
                    </>
                  ) : (
                    <>
                      <HiOutlineUserPlus size={12} />
                      Reassign
                    </>
                  )
                }
              />
              <button
                type="button"
                onClick={() => onResolve(handoff.id)}
                disabled={anyMutationOnPage}
                className="bg-accent text-accent-fg font-medium text-[11.5px] px-3 py-1.5 rounded-[7px] flex items-center gap-1 hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isResolvingThisRow ? (
                  <>
                    <HiOutlineArrowPath size={12} className="animate-spin" />
                    Resolving…
                  </>
                ) : (
                  <>
                    <HiOutlineCheck size={12} />
                    Resolve
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => onCancel(handoff.id)}
                disabled={anyMutationOnPage}
                aria-label={isCancellingThisRow ? "Cancelling…" : "Cancel handoff"}
                className="bg-transparent border-[0.5px] border-border rounded-[7px] px-2 py-1.5 text-[#F09595] hover:bg-[rgba(226,75,74,0.08)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center"
              >
                {isCancellingThisRow ? (
                  <HiOutlineArrowPath size={13} className="animate-spin" />
                ) : (
                  <HiOutlineXMark size={13} />
                )}
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  )
}

export default HandoffRow
