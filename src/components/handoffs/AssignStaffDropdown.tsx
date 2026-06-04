"use client"
import { useState } from "react"
import { HiChevronDown } from "react-icons/hi2"

import type { StaffResponse } from "@/lib/api/types"

type Props = {
  staff: StaffResponse[]
  currentlyAssignedStaffId?: string | null
  onAssign: (staffId: string) => void
  disabled: boolean
  trigger: React.ReactNode
}

const COLORS = ["#7C2D5E", "#1F4D7A", "#5C3B7E", "#7A4419", "#2A6E54", "#3A3D44"]

const colorFor = (id: string): string => {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return COLORS[Math.abs(h) % COLORS.length]
}

const initialsFor = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "??"

const StaffAvatar = ({ staff }: { staff: StaffResponse }) => (
  <div
    className="w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-medium flex-shrink-0"
    style={{ backgroundColor: colorFor(staff.id) }}
  >
    {initialsFor(staff.name)}
  </div>
)

const AssignStaffDropdown = ({
  staff,
  currentlyAssignedStaffId,
  onAssign,
  disabled,
  trigger,
}: Props) => {
  const [open, setOpen] = useState(false)

  // Skip the inactive ones and the currently-assigned staff (no-op assign).
  const availableStaff = staff.filter((s) => {
    if (s.is_active === false) return false
    if (s.id === currentlyAssignedStaffId) return false
    return true
  })

  const handlePick = (staffId: string) => {
    setOpen(false)
    onAssign(staffId)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className="text-[12px] px-3 py-1.5 rounded-[7px] bg-card border border-border text-fg-muted hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
      >
        {trigger}
        <HiChevronDown size={12} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-[34px] z-20 bg-card border border-border rounded-[8px] shadow-lg min-w-[220px] py-1 max-h-[280px] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {availableStaff.length === 0 ? (
              <div className="px-3 py-3 text-[11.5px] text-fg-subtle italic">
                No staff available to assign.
              </div>
            ) : (
              availableStaff.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handlePick(s.id)}
                  className="w-full text-left px-3 py-2 hover:bg-white/2 flex items-center gap-2.5 cursor-pointer"
                >
                  <StaffAvatar staff={s} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-fg truncate">{s.name}</div>
                    <div className="text-[10px] text-fg-subtle capitalize">
                      {s.role}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AssignStaffDropdown
