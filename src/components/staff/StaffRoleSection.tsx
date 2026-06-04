import Link from "next/link"
import { HiChevronRight } from "react-icons/hi2"
import type { StaffResponse } from "@/lib/api/types"
import { getStaffInitials } from "@/lib/staff/utils"

interface StaffRoleSectionProps {
  role: "owner" | "admin" | "support"
  title: string
  description: string
  members: StaffResponse[]
  currentUser: StaffResponse | null
}

export function StaffRoleSection({
  role,
  title,
  description,
  members,
  currentUser,
}: StaffRoleSectionProps) {
  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-baseline justify-between">
        <div>
          <h2 className="text-[13px] font-medium text-fg">{title}</h2>
          <p className="text-[10.5px] text-fg-subtle mt-0.5">{description}</p>
        </div>
        <span className="text-[10.5px] text-fg-subtle">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>

      {members.length === 0 ? (
        <div className="px-4 py-8 text-center text-[11.5px] text-fg-subtle italic">
          No {title.toLowerCase()} yet.
        </div>
      ) : (
        members.map((member) => (
          <StaffRow
            key={member.id}
            member={member}
            currentUser={currentUser}
            highlightOwner={role === "owner"}
          />
        ))
      )}
    </div>
  )
}

function StaffRow({
  member,
  currentUser,
  highlightOwner,
}: {
  member: StaffResponse
  currentUser: StaffResponse | null
  highlightOwner: boolean
}) {
  const isMe = currentUser?.id === member.id
  const isInactive = !member.is_active
  const initials = getStaffInitials(member)

  return (
    <Link
      href={`/staff/${member.id}/edit`}
      className={`flex items-center gap-3 px-3.5 py-3 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] ${
        isInactive ? "opacity-60" : ""
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full bg-[#5C3B7E] text-white flex items-center justify-center text-[11px] font-medium ${
          highlightOwner
            ? "ring-2 ring-[#F0A92B] ring-offset-2 ring-offset-card"
            : ""
        }`}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[12.5px] text-fg font-medium truncate">
            {member.name}
          </span>
          {isMe && (
            <span className="text-[9.5px] px-1.5 py-0 rounded-[4px] bg-accent/15 text-[#6FD9A0]">
              you
            </span>
          )}
          {isInactive && (
            <span className="text-[9.5px] px-1.5 py-0 rounded-[4px] bg-white/[0.05] text-fg-subtle">
              inactive
            </span>
          )}
        </div>
        <div className="text-[10.5px] text-fg-subtle truncate mt-0.5">
          {member.email}
        </div>
      </div>

      <HiChevronRight size={14} className="text-fg-subtle shrink-0" />
    </Link>
  )
}
