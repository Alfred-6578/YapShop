'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Field from '@/components/ui/Field'
import TagsInput from '@/components/ui/TagsInput'
import { HiOutlineTrash } from 'react-icons/hi2'
import { getDisplayName, type Customer } from '@/lib/customers/mockData'

type Props = {
  customer: Customer
  onSubmit: (values: {
    name: string
    display_name?: string
    whatsapp_number: string
    email?: string | null
    notes: string
    tags: string[]
  }) => void
  onCancel: () => void
  onDelete: () => void
}

const CustomerForm = ({ customer, onSubmit, onCancel, onDelete }: Props) => {
  const initialNotes = typeof customer.extra_metadata?.notes === 'string' ? (customer.extra_metadata.notes as string) : ''
  const initialTags = Array.isArray(customer.extra_metadata?.tags) ? (customer.extra_metadata.tags as unknown[]).filter((t): t is string => typeof t === 'string') : []

  const [name, setName] = useState(customer.name)
  const [displayName, setDisplayName] = useState(customer.display_name ?? '')
  const [whatsapp, setWhatsapp] = useState(customer.whatsapp_number)
  const [email, setEmail] = useState(customer.email ?? '')
  const [notes, setNotes] = useState(initialNotes)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [errors, setErrors] = useState<{ name?: boolean; whatsapp?: boolean }>({})

  const handleSubmit = () => {
    const next = { name: !name.trim(), whatsapp: !whatsapp.trim() } as { name?: boolean; whatsapp?: boolean }
    setErrors(next)
    if (next.name || next.whatsapp) return
    onSubmit({
      name,
      display_name: displayName || undefined,
      whatsapp_number: whatsapp,
      email: email || null,
      notes,
      tags,
    })
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <span className="text-[12px] text-fg-muted flex-1 truncate">
          Customers / <b className="text-fg font-medium">{getDisplayName(customer)}</b> / Edit
        </span>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
      </div>

      <div className="flex flex-col gap-3 p-4 max-w-[640px] mx-auto">
        <Card>
          <CardHeader title="Profile" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field label="Display name">
              <Input value={displayName} onChange={setDisplayName} placeholder="Emperor" />
            </Field>
            <Field label="Full name" required error={errors.name}>
              <Input value={name} onChange={setName} placeholder="Emperor Eze" />
            </Field>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="WhatsApp number" required error={errors.whatsapp}>
                <Input value={whatsapp} onChange={setWhatsapp} placeholder="+234 ..." />
              </Field>
              <Field label="Email">
                <Input value={email} onChange={setEmail} placeholder="Not provided" />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notes & metadata" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field label="Notes">
              <Textarea value={notes} onChange={setNotes} rows={4} placeholder="Add context, preferences, anything useful for your team…" />
            </Field>
            <Field label="Tags">
              <TagsInput value={tags} onChange={setTags} placeholder="Add tag…" />
            </Field>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-t border-border bg-bg">
        <button
          type="button"
          onClick={onDelete}
          className="text-[#F09595] text-[12.5px] inline-flex items-center gap-1.5 cursor-pointer hover:text-[#F0B5B5]"
        >
          <HiOutlineTrash size={13} />
          Delete customer
        </button>
        <div className="flex items-center gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
        </div>
      </div>
    </>
  )
}

export default CustomerForm
