"use client"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from "react-icons/hi2"

import ConversationActionBar from "@/components/conversations/ConversationActionBar"
import ConversationHeader from "@/components/conversations/ConversationHeader"
import ConversationHandoffCard from "@/components/conversations/ConversationHandoffCard"
import ConversationMessagesList from "@/components/conversations/ConversationMessagesList"
import ReplyInput from "@/components/conversations/ReplyInput"
import {
  assignHandoffToStaff,
  getConversation,
  resumeAi,
  startHandoff,
} from "@/lib/api/conversations"
import { getCustomer } from "@/lib/api/customers"
import {
  getMessagesForConversation,
  sendStaffMessage,
} from "@/lib/api/messages"
import { getCurrentStaff, listStaff } from "@/lib/api/staff"

const ConversationDetailPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { conversationId } = useParams<{ conversationId: string }>()

  const conversationQuery = useQuery({
    queryKey: ["conversations", "detail", conversationId],
    queryFn: () => getConversation(conversationId),
    staleTime: 15_000,
    enabled: !!conversationId,
  })

  // Dependent query — only fires once we know the customer_id from the
  // conversation. The non-null assertion is safe because `enabled` gates it.
  const customerQuery = useQuery({
    queryKey: ["customers", "detail", conversationQuery.data?.customer_id],
    queryFn: () => getCustomer(conversationQuery.data!.customer_id),
    staleTime: 60_000,
    enabled: !!conversationQuery.data?.customer_id,
  })

  const staffQuery = useQuery({
    queryKey: ["staff", "list"],
    queryFn: listStaff,
    staleTime: 5 * 60_000,
  })

  // Short staleTime — chat is the most time-sensitive surface in the app, so
  // navigating back to a conversation refetches almost immediately. Step 6
  // layers polling on top of this.
  const messagesQuery = useQuery({
    queryKey: ["messages", "conversation", conversationId],
    queryFn: () => getMessagesForConversation(conversationId),
    staleTime: 5_000,
    enabled: !!conversationId,
  })

  // Current user — long staleTime since the logged-in operator rarely
  // changes within a session.
  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })

  // No optimistic append — the backend broadcasts `new_message` over the
  // WebSocket on success, and lib/realtime/eventHandlers.ts invalidates the
  // thread cache, which causes the message to land in EVERY open tab at the
  // same moment (this tab included). One source of truth for "is the message
  // there yet": the WS event.
  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      sendStaffMessage(conversationId, {
        text: content,
        staff_id: meQuery.data?.id,
      }),
  })

  const takeOverMutation = useMutation({
    mutationFn: async () => {
      // If no handoff exists yet, start one first; then (re)assign to me.
      const current = conversationQuery.data
      if (current && (current.handoff_status ?? "none") === "none") {
        await startHandoff(conversationId, { reason: "Staff intervention" })
      }
      return assignHandoffToStaff(conversationId, meQuery.data!.id)
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["conversations", "detail", conversationId],
        updated,
      )
      queryClient.invalidateQueries({ queryKey: ["conversations", "filter"] })
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
    },
  })

  const resolveMutation = useMutation({
    mutationFn: () => resumeAi(conversationId),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["conversations", "detail", conversationId],
        updated,
      )
      queryClient.invalidateQueries({ queryKey: ["conversations", "filter"] })
      queryClient.invalidateQueries({ queryKey: ["handoffs"] })
    },
  })

  if (conversationQuery.isLoading) {
    return (
      <div className="p-4">
        <div className="bg-card border border-border rounded-card px-4 py-12 flex items-center justify-center gap-2 text-[12px] text-fg-muted">
          <HiOutlineArrowPath size={14} className="animate-spin" />
          Loading conversation…
        </div>
      </div>
    )
  }

  if (conversationQuery.isError || !conversationQuery.data) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineExclamationTriangle size={28} className="text-[#F09595]" />
        <div className="text-[13px] text-fg text-center">
          Couldn&apos;t load this conversation.
        </div>
        <div className="text-[11.5px] text-fg-subtle text-center">
          It may have been deleted, or the connection failed.
        </div>
        <button
          type="button"
          onClick={() => router.push("/conversations")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Back to conversations
        </button>
      </div>
    )
  }

  const conversation = conversationQuery.data
  const customer = customerQuery.data ?? null
  const assignedStaff = conversation.assigned_staff_id
    ? (staffQuery.data?.find((s) => s.id === conversation.assigned_staff_id) ??
      null)
    : null

  // Lock rule: only the currently-assigned staff can reply. If handoff isn't
  // active (AI handling) or someone else is assigned, the input renders as a
  // lock pill explaining why.
  const currentStaff = meQuery.data ?? null
  const isHandoffActive = conversation.handoff_status === "active"
  const isAssignedToMe =
    !!currentStaff && currentStaff.id === conversation.assigned_staff_id
  const canReply = isHandoffActive && isAssignedToMe

  let lockReason: string | undefined
  if (!canReply) {
    if (!isHandoffActive) {
      lockReason = "AI is handling this conversation. Take over to reply."
    } else if (!isAssignedToMe) {
      const handlerName = assignedStaff?.name ?? "another staff member"
      lockReason = `Assigned to ${handlerName}. Take over to reply.`
    }
  }

  return (
    <>
      <ConversationActionBar conversation={conversation} customer={customer} />
      <div className="p-4 flex flex-col gap-3">
        <ConversationHeader
          conversation={conversation}
          customer={customer}
          isCustomerLoading={customerQuery.isLoading}
        />
        <ConversationHandoffCard
          conversation={conversation}
          assignedStaff={assignedStaff}
          currentStaff={currentStaff}
          onTakeOver={() => takeOverMutation.mutate()}
          onResolve={() => resolveMutation.mutate()}
          isTakingOver={takeOverMutation.isPending}
          isResolving={resolveMutation.isPending}
          mutationError={takeOverMutation.error ?? resolveMutation.error}
        />
        <ConversationMessagesList
          messages={messagesQuery.data ?? []}
          isLoading={messagesQuery.isLoading}
          isError={messagesQuery.isError}
          onRetry={() => messagesQuery.refetch()}
          staff={staffQuery.data ?? []}
          customer={customer}
        />
        <ReplyInput
          locked={!canReply || !currentStaff}
          lockReason={lockReason}
          onSend={(content) => sendMutation.mutate(content)}
          isSending={sendMutation.isPending}
          sendError={sendMutation.error}
          onTakeOver={
            !isAssignedToMe && currentStaff
              ? () => takeOverMutation.mutate()
              : undefined
          }
          isTakingOver={takeOverMutation.isPending}
        />
      </div>
    </>
  )
}

export default ConversationDetailPage
