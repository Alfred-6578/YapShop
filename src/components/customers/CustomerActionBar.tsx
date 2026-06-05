"use client"
import Link from "next/link"
import { HiEllipsisHorizontal, HiOutlinePencilSquare } from "react-icons/hi2"
import { FaWhatsapp } from "react-icons/fa6"

import CustomerNameLabel from "@/components/customers/CustomerNameLabel"
import type { CustomerResponse } from "@/lib/api/types"

type Props = { customer: CustomerResponse }

const whatsappUrl = (number: string) =>
  `https://wa.me/${number.replace(/[+\s-]/g, "")}`

const CustomerActionBar = ({ customer }: Props) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
      <nav
        aria-label="Breadcrumb"
        className="text-[12px] flex-1 min-w-0 truncate"
      >
        <Link
          href="/customers"
          className="text-fg-muted hover:text-fg transition-colors"
        >
          Customers
        </Link>
        <span className="text-fg-subtle mx-1.5">/</span>
        <CustomerNameLabel customer={customer} className="text-fg" />
      </nav>

      <button
        type="button"
        aria-label="More actions"
        className="h-8 w-8 inline-flex shrink-0 items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer"
      >
        <HiEllipsisHorizontal size={16} />
      </button>

      <Link
        href={`/customers/${customer.id}/edit`}
        aria-label="Edit customer"
        className="h-8 shrink-0 inline-flex items-center justify-center gap-1.5 px-2 vsm:px-3 py-2 rounded-[8px] text-[12.5px] font-medium bg-transparent border border-border text-fg hover:bg-card-hover cursor-pointer"
      >
        <HiOutlinePencilSquare size={14} />
        <span className="hidden vsm:inline">Edit</span>
      </Link>

      <a
        href={whatsappUrl(customer.whatsapp_number)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message on WhatsApp"
        className="h-8 shrink-0 inline-flex items-center justify-center gap-1.5 bg-[#1A2B22] text-[#6FD9A0] border-[0.5px] border-[rgba(21,194,106,0.3)] text-[12.5px] font-medium px-2 vsm:px-3 rounded-[8px] hover:bg-[#1f3329]"
      >
        <FaWhatsapp size={13} />
        <span className="hidden md:inline">Message on WhatsApp</span>
        <span className="hidden vsm:inline md:hidden">Message</span>
      </a>
    </div>
  )
}

export default CustomerActionBar
