import Card from "@/components/ui/Card"
import HandoffRow from "./HandoffRow"
import type {
  CustomerResponse,
  HumanHandOffResponse,
  StaffResponse,
} from "@/lib/api/types"

/** `assign` is included now so step 5 only adds wiring, not a type change. */
export type PendingMutation =
  | { id: string; kind: "resolve" | "cancel" | "assign" }
  | null

type Props = {
  handoffs: HumanHandOffResponse[]
  staff: StaffResponse[]
  /** Conversation-id keyed lookup so each row can render customer info that
   *  the handoff API doesn't include on its nested conversation summary. */
  customerByConversationId: Map<string, CustomerResponse>
  pendingMutation: PendingMutation
  onResolve: (id: string) => void
  onCancel: (id: string) => void
  onAssign: (id: string, staffId: string) => void
  onOpenConversation: (conversationId: string) => void
  emptyState?: React.ReactNode
}

const HandoffsList = ({
  handoffs,
  staff,
  customerByConversationId,
  pendingMutation,
  onResolve,
  onCancel,
  onAssign,
  onOpenConversation,
  emptyState,
}: Props) => {
  return (
    <Card padded={false}>
      {handoffs.length === 0
        ? emptyState ?? null
        : handoffs.map((h) => (
            <HandoffRow
              key={h.id}
              handoff={h}
              staff={staff}
              customer={customerByConversationId.get(h.conversation_id) ?? null}
              pendingMutation={pendingMutation}
              onResolve={onResolve}
              onCancel={onCancel}
              onAssign={onAssign}
              onOpenConversation={onOpenConversation}
            />
          ))}
    </Card>
  )
}

export default HandoffsList
