"use client"
import { FaWhatsapp } from "react-icons/fa6"
import { HiOutlineCalendar, HiOutlineEnvelope } from "react-icons/hi2"
import { LiaRobotSolid } from "react-icons/lia"

import Card from "@/components/ui/Card"
import { formatRelative } from "@/lib/utils/format"
import { getDisplayName } from "@/lib/customers/utils"
import { getCustomerColor, getCustomerInitials } from "@/lib/customers/visuals"
import type { ConversationResponse, CustomerResponse } from "@/lib/api/types"

type Props = {
  conversation: ConversationResponse
  customer: CustomerResponse | null
  isCustomerLoading: boolean
}

const ConversationHeader = ({
  conversation,
  customer,
  isCustomerLoading,
}: Props) => {
  const isEnded = conversation.status === "ended"

  return (
    <Card padded={false} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {customer ? (
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center text-[15px] font-medium shrink-0"
            style={{
              backgroundColor: getCustomerColor(customer),
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {getCustomerInitials(customer)}
          </div>
        ) : (
          <div className="h-12 w-12 rounded-full bg-white/5 animate-pulse shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          {customer ? (
            <>
              <h1 className="text-[16px] font-medium tracking-tight truncate">
                {getDisplayName(customer)}
              </h1>
              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-fg-muted mt-1">
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <FaWhatsapp size={11} className="text-fg-subtle shrink-0" />
                  <span className="font-mono">{customer.whatsapp_number}</span>
                </span>
                {customer.email && (
                  <span className="inline-flex items-center gap-1 whitespace-nowrap min-w-0">
                    <HiOutlineEnvelope size={11} className="text-fg-subtle shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </span>
                )}
              </div>
            </>
          ) : isCustomerLoading ? (
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-40 bg-white/5 rounded animate-pulse" />
              <div className="h-2.5 w-32 bg-white/3 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <h1 className="text-[15px] font-medium tracking-tight text-fg-muted">
                Customer info unavailable
              </h1>
              <p className="text-[11px] text-fg-subtle mt-0.5">
                The customer record couldn&apos;t be loaded.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap md:shrink-0">
        <span
          className={`text-[10.5px] px-2 py-1 rounded-[6px] inline-flex items-center gap-1.5 ${
            isEnded
              ? "bg-[rgba(107,112,121,0.16)] text-[#989DA3]"
              : "bg-[rgba(21,194,106,0.12)] text-[#6FD9A0]"
          }`}
        >
          {isEnded ? "Ended" : "Active"}
        </span>
        {conversation.ai_enabled && !isEnded && (
          <span className="text-[10.5px] px-2 py-1 rounded-[6px] bg-[rgba(76,141,245,0.12)] text-[#8FB6F5] inline-flex items-center gap-1.5">
            <LiaRobotSolid size={11} />
            AI enabled
          </span>
        )}
        <span className="text-[10.5px] text-fg-subtle inline-flex items-center gap-1 whitespace-nowrap">
          <HiOutlineCalendar size={11} />
          Started {formatRelative(conversation.started_at)}
        </span>
      </div>
    </Card>
  )
}

export default ConversationHeader
