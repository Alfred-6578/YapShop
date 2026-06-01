import React from 'react'
import { FaWhatsapp } from 'react-icons/fa6'

import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'

type Props = {
  name: string
  whatsapp: string
}

const stripPhone = (s: string) => s.replace(/[+\s-]/g, '')

const OrderCustomerCard = ({ name, whatsapp }: Props) => {
  return (
    <Card>
      <CardHeader title="Customer" />
      <div className="mt-2 flex flex-col text-[11.5px]">
        <span className="text-[12.5px] text-fg font-medium">{name}</span>
        <span className="font-mono text-[10.5px] text-fg-muted mt-0.5">{whatsapp}</span>
        <a
          href={`https://wa.me/${stripPhone(whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1.5 bg-[#1A2B22] text-[#6FD9A0] border border-[rgba(21,194,106,0.3)] rounded-[7px] px-2.5 py-1.5 text-[11.5px] w-fit hover:bg-[#1f3329]"
        >
          <FaWhatsapp size={13} />
          Message on WhatsApp
        </a>
      </div>
    </Card>
  )
}

export default OrderCustomerCard
