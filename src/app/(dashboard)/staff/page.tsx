"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { HiOutlineUserPlus, HiOutlineExclamationCircle } from "react-icons/hi2"

import type { StaffResponse } from "@/lib/api/types"
import { listStaff, getCurrentStaff } from "@/lib/api/staff"
import { canInviteStaff } from "@/lib/staff/utils"
import Button from "@/components/ui/Button"
import PageHeader from "@/components/products/PageHeader"
import { StaffRoleSection } from "@/components/staff/StaffRoleSection"

const StaffPage = () => {
  const staffQuery = useQuery({
    queryKey: ["staff", "list"],
    queryFn: listStaff,
    staleTime: 5 * 60_000,
  })

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
  })

  const staff = staffQuery.data ?? []
  const me = meQuery.data ?? null

  const byRole = useMemo(() => {
    const owner: StaffResponse[] = []
    const admin: StaffResponse[] = []
    const support: StaffResponse[] = []

    for (const s of staff) {
      if (s.role === "owner") owner.push(s)
      else if (s.role === "admin") admin.push(s)
      else if (s.role === "support") support.push(s)
    }

    const sort = (a: StaffResponse, b: StaffResponse) => {
      if (a.is_active !== b.is_active) return a.is_active ? -1 : 1
      return a.name.localeCompare(b.name)
    }
    owner.sort(sort)
    admin.sort(sort)
    support.sort(sort)

    return { owner, admin, support }
  }, [staff])

  return (
    <div className="p-4 flex flex-col gap-3.5">
      <PageHeader
        title="Staff"
        subtitle={
          staffQuery.isLoading
            ? "Loading…"
            : `${staff.length} team member${staff.length === 1 ? "" : "s"}`
        }
        action={
          canInviteStaff(me) ? (
            <Button
              variant="primary"
              href="/staff/new"
              icon={<HiOutlineUserPlus size={14} />}
            >
              Invite staff
            </Button>
          ) : null
        }
      />

      {staffQuery.isLoading ? (
        <LoadingState />
      ) : staffQuery.isError ? (
        <ErrorState onRetry={() => staffQuery.refetch()} />
      ) : (
        <div className="flex flex-col gap-3">
          {byRole.owner.length > 0 && (
            <StaffRoleSection
              role="owner"
              title="Owners"
              description="Full access to everything"
              members={byRole.owner}
              currentUser={me}
            />
          )}
          {byRole.admin.length > 0 && (
            <StaffRoleSection
              role="admin"
              title="Admins"
              description="Manage products, orders, and support staff"
              members={byRole.admin}
              currentUser={me}
            />
          )}
          <StaffRoleSection
            role="support"
            title="Support"
            description="Handle customer conversations and handoffs"
            members={byRole.support}
            currentUser={me}
          />
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-card overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <div className="h-3 w-24 bg-white/[0.05] rounded animate-pulse" />
          </div>
          {Array.from({ length: 2 }).map((_, j) => (
            <div
              key={j}
              className="flex items-center gap-3 px-3.5 py-3 border-b border-white/[0.04] last:border-b-0"
            >
              <div className="w-9 h-9 rounded-full bg-white/[0.04] animate-pulse" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3 w-32 bg-white/[0.05] rounded animate-pulse" />
                <div className="h-2.5 w-44 bg-white/[0.03] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
      <HiOutlineExclamationCircle size={24} className="text-[#F09595]" />
      <div className="text-[12.5px] text-fg">Couldn&apos;t load staff.</div>
      <button
        onClick={onRetry}
        className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
      >
        Try again
      </button>
    </div>
  )
}

export default StaffPage
