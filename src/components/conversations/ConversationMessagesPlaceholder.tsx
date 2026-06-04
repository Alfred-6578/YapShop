import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2"

const ConversationMessagesPlaceholder = () => {
  return (
    <div className="bg-card border border-border rounded-card px-4 py-12 flex flex-col items-center gap-2 text-fg-muted">
      <HiOutlineChatBubbleOvalLeft size={24} />
      <div className="text-[12px]">Messages load in step 3</div>
      <div className="text-[10.5px] text-fg-subtle">
        Wiring up{" "}
        <code className="font-mono">/messages/conversation/{"{id}"}</code>
      </div>
    </div>
  )
}

export default ConversationMessagesPlaceholder
