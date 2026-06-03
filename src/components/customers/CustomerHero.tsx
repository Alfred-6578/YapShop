import Card from "@/components/ui/Card"
import {
  HiOutlineEnvelope,
  HiOutlineCalendar,
  HiOutlineExclamationCircle,
  HiOutlineUser,
} from "react-icons/hi2"
import { FaWhatsapp } from "react-icons/fa6"
import { LiaRobotSolid } from "react-icons/lia"

import { getCustomerColor, getCustomerInitials } from "@/lib/customers/visuals"
import {
  getCustomerActivityTag,
  getDisplayName,
} from "@/lib/customers/utils"
import type { ConversationResponse, CustomerResponse } from "@/lib/api/types"

type Props = {
  customer: CustomerResponse
  conversations: ConversationResponse[]
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
const formatMonthYear = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

const CustomerHero = ({ customer, conversations }: Props) => {
  const tag = getCustomerActivityTag(conversations)
  const displayName = getDisplayName(customer)
  const showSubName =
    customer.display_name &&
    customer.name &&
    customer.display_name !== customer.name

  const base =
    "rounded-[7px] px-2.5 py-1 text-[10.5px] inline-flex items-center gap-1.5"

  let banner: React.ReactNode = null
  if (tag) {
    if (tag.kind === "attention") {
      banner = (
        <div
          className={`${base} bg-[rgba(240,169,43,0.1)] border-[0.5px] border-[rgba(240,169,43,0.25)] text-[#F0C36B]`}
        >
          <HiOutlineExclamationCircle size={12} />
          <span>Active conversation needs attention</span>
        </div>
      )
    } else if (tag.kind === "in-chat") {
      banner = (
        <div
          className={`${base} bg-[rgba(76,141,245,0.1)] border-[0.5px] border-[rgba(76,141,245,0.25)] text-[#8FB6F5]`}
        >
          <LiaRobotSolid size={12} />
          <span>AI handling active conversation</span>
        </div>
      )
    } else if (tag.kind === "handled") {
      banner = (
        <div
          className={`${base} bg-[rgba(21,194,106,0.1)] border-[0.5px] border-[rgba(21,194,106,0.25)] text-[#6FD9A0]`}
        >
          <HiOutlineUser size={12} />
          <span>{tag.label} handling conversation</span>
        </div>
      )
    }
  }

  return (
    <Card
      padded={false}
      className="p-4 flex flex-col md:flex-row md:items-center gap-3"
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <div
          className="h-14 w-14 rounded-full flex items-center justify-center text-[18px] font-medium shrink-0"
          style={{
            backgroundColor: getCustomerColor(customer),
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {getCustomerInitials(customer)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap mb-1">
            <h1 className="text-[18px] font-medium tracking-tight truncate">
              {displayName}
            </h1>
            {showSubName && (
              <span className="text-[11.5px] text-fg-muted truncate">
                — {customer.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-fg-muted">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <FaWhatsapp size={12} className="text-fg-subtle shrink-0" />
              <span className="font-mono">{customer.whatsapp_number}</span>
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap min-w-0">
              <HiOutlineEnvelope size={12} className="text-fg-subtle shrink-0" />
              {customer.email ? (
                <span className="truncate">{customer.email}</span>
              ) : (
                <span className="text-fg-subtle">No email on file</span>
              )}
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <HiOutlineCalendar size={12} className="text-fg-subtle shrink-0" />
              Customer since {formatMonthYear(customer.created_at)}
            </span>
          </div>
        </div>
      </div>

      {tag && <div className="md:shrink-0">{banner}</div>}
    </Card>
  )
}

export default CustomerHero
