"use client"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HiOutlineCloud } from "react-icons/hi2"

import PageHeader from "@/components/products/PageHeader"
import HandoffsHero from "@/components/handoffs/HandoffsHero"
import HandoffsStats from "@/components/handoffs/HandoffsStats"
import HandoffsTabs, {
  type HandoffTab,
} from "@/components/handoffs/HandoffsTabs"
import HandoffsList, {
  type PendingMutation,
} from "@/components/handoffs/HandoffsList"
import {
  assignHandoff,
  cancelHandoff,
  claimNextHandoff,
  listHandoffs,
  resolveHandoff,
} from "@/lib/api/handoffs"
import { listStaff } from "@/lib/api/staff"
import { listConversations } from "@/lib/api/conversations"
import { listCustomers } from "@/lib/api/customers"
import type { CustomerResponse } from "@/lib/api/types"

const HandoffsPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<HandoffTab>("pending")

  const handoffsQuery = useQuery({
    queryKey: ["handoffs", "list"],
    queryFn: listHandoffs,
    staleTime: 15_000,
    // Refetches now ride on the realtime `new_handoff` / `handoff_claimed`
    // events from RealtimeProvider — no more polling timer.
  })

  const staffQuery = useQuery({
    queryKey: ["staff", "list"],
    queryFn: listStaff,
    staleTime: 5 * 60_000,
  })

  // Handoff list doesn't include customer info on the nested `conversation`.
  // Fetch conversations + customers and build a conversation_id → customer
  // lookup so each row can render the right name and WhatsApp number.
  const conversationsQuery = useQuery({
    queryKey: ["conversations", "list"],
    queryFn: listConversations,
    staleTime: 30_000,
  })

  const customersQuery = useQuery({
    queryKey: ["customers", "list", { limit: 100 }],
    queryFn: () => listCustomers({ skip: 0, limit: 100 }),
    staleTime: 30_000,
  })

  const handoffs = handoffsQuery.data ?? []
  const staff = staffQuery.data ?? []

  const customerByConversationId = useMemo(() => {
    const map = new Map<string, CustomerResponse>()
    const conversations = conversationsQuery.data ?? []
    const customers = customersQuery.data ?? []
    const customerById = new Map(customers.map((c) => [c.id, c]))
    for (const conv of conversations) {
      const cust = customerById.get(conv.customer_id)
      if (cust) map.set(conv.id, cust)
    }
    return map
  }, [conversationsQuery.data, customersQuery.data])

  const claimMutation = useMutation({
    mutationFn: claimNextHandoff,
    onSuccess: (claimed) => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
      if (claimed.conversation_id) {
        router.push(`/conversations/${claimed.conversation_id}`)
      }
    },
  })

  const resolveMutation = useMutation({
    mutationFn: (id: string) => resolveHandoff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelHandoff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
    },
  })

  const assignMutation = useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      assignHandoff(id, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
    },
  })

  // Which handoff (if any) currently has a mutation in flight. Drives the
  // per-row spinner state and disables every other row's action buttons so
  // operators can't pile up overlapping requests.
  const pendingMutation: PendingMutation =
    resolveMutation.isPending && resolveMutation.variables
      ? { id: resolveMutation.variables, kind: "resolve" }
      : cancelMutation.isPending && cancelMutation.variables
        ? { id: cancelMutation.variables, kind: "cancel" }
        : assignMutation.isPending && assignMutation.variables
          ? { id: assignMutation.variables.id, kind: "assign" }
          : null

  const counts = useMemo(
    () => ({
      pending: handoffs.filter((h) => h.status === "pending").length,
      active: handoffs.filter((h) => h.status === "active").length,
      resolved: handoffs.filter(
        (h) => h.status === "resolved" || h.status === "cancelled",
      ).length,
    }),
    [handoffs],
  )

  const visible = useMemo(() => {
    if (tab === "pending") {
      return [...handoffs]
        .filter((h) => h.status === "pending")
        // Oldest first — surface what's been waiting longest
        .sort((a, b) =>
          (a.requested_at ?? a.created_at).localeCompare(
            b.requested_at ?? b.created_at,
          ),
        )
    }
    if (tab === "active") {
      return [...handoffs]
        .filter((h) => h.status === "active")
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    }
    return [...handoffs]
      .filter((h) => h.status === "resolved" || h.status === "cancelled")
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  }, [handoffs, tab])

  return (
    <div className="p-4 flex flex-col gap-3.5">
      <PageHeader
        title="Handoffs"
        subtitle="Customer conversations needing your team"
      />

      {handoffsQuery.isLoading ? (
        <LoadingState />
      ) : handoffsQuery.isError ? (
        <ErrorState onRetry={() => handoffsQuery.refetch()} />
      ) : (
        <>
          <HandoffsHero
            pendingCount={counts.pending}
            isClaiming={claimMutation.isPending}
            claimError={claimMutation.error}
            onClaimNext={() => claimMutation.mutate()}
          />

          <HandoffsStats handoffs={handoffs} />

          <HandoffsTabs tab={tab} onTabChange={setTab} counts={counts} />

          <HandoffsList
            handoffs={visible}
            staff={staff}
            customerByConversationId={customerByConversationId}
            pendingMutation={pendingMutation}
            onResolve={(id) => resolveMutation.mutate(id)}
            onCancel={(id) => {
              if (
                window.confirm(
                  "Cancel this handoff? The customer goes back to AI without resolution.",
                )
              ) {
                cancelMutation.mutate(id)
              }
            }}
            onAssign={(id, staffId) => assignMutation.mutate({ id, staffId })}
            onOpenConversation={(convId) =>
              router.push(`/conversations/${convId}`)
            }
            emptyState={
              <div className="py-12 text-center text-[12px] text-fg-subtle">
                {tab === "pending" &&
                  "No pending handoffs. The AI is handling everything."}
                {tab === "active" && "No active handoffs right now."}
                {tab === "resolved" && "No resolved handoffs in view."}
              </div>
            }
          />
        </>
      )}
    </div>
  )
}

const LoadingState = () => (
  <div className="bg-card border border-border rounded-card overflow-hidden">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 px-3.5 py-3 border-b border-white/4 last:border-b-0"
      >
        <div className="w-10 h-10 rounded-full bg-white/4 animate-pulse" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
          <div className="h-2.5 w-48 bg-white/3 rounded animate-pulse" />
        </div>
        <div className="h-6 w-20 bg-white/4 rounded animate-pulse" />
      </div>
    ))}
  </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
    <HiOutlineCloud size={28} className="text-[#F09595]" />
    <div className="text-[12.5px] text-fg">Couldn&apos;t load handoffs.</div>
    <button
      type="button"
      onClick={onRetry}
      className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
    >
      Try again
    </button>
  </div>
)

export default HandoffsPage
