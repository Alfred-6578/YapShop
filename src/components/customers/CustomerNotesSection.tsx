import Link from 'next/link'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import type { Customer } from '@/lib/customers/mockData'

type Props = { customer: Customer }

const CustomerNotesSection = ({ customer }: Props) => {
  const md = customer.extra_metadata || {}
  const notes = typeof md.notes === 'string' ? md.notes : ''
  const tags = Array.isArray(md.tags)
    ? (md.tags as unknown[]).filter((t): t is string => typeof t === 'string')
    : []
  const otherKeys = Object.keys(md).filter((k) => k !== 'notes' && k !== 'tags')

  const isEmpty = !notes && tags.length === 0 && otherKeys.length === 0

  return (
    <Card>
      <CardHeader
        title="Notes & metadata"
        action={
          <Link
            href={`/customers/${customer.id}/edit`}
            className="text-[11px] text-[#6FD9A0] inline-flex items-center gap-1 hover:underline"
          >
            <HiOutlinePencilSquare size={12} />
            Edit
          </Link>
        }
      />
      <div className="mt-2">
        {isEmpty ? (
          <div className="py-4 text-center text-[11.5px] text-fg-subtle italic">
            No notes yet. Click Edit to add context about this customer.
          </div>
        ) : (
          <>
            {notes && (
              <p className="text-[11.5px] text-fg-muted leading-relaxed">{notes}</p>
            )}
            {(otherKeys.length > 0 || tags.length > 0) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {otherKeys.map((k) => {
                  const v = md[k]
                  let display: string
                  if (v === null || v === undefined) display = String(v)
                  else if (
                    typeof v === 'string' ||
                    typeof v === 'number' ||
                    typeof v === 'boolean'
                  )
                    display = String(v)
                  else display = JSON.stringify(v)
                  return (
                    <span
                      key={k}
                      className="text-[10px] px-2 py-0.5 rounded-[5px] bg-[rgba(76,141,245,0.12)] text-[#8FB6F5]"
                    >
                      {k}: {display}
                    </span>
                  )
                })}
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-[5px] bg-white/[0.05] text-[#B8BDC4]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

export default CustomerNotesSection
