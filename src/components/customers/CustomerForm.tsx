"use client"
import Link from "next/link"
import { useState } from "react"
import {
  HiOutlineExclamationTriangle,
  HiOutlineTrash,
} from "react-icons/hi2"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import Field from "@/components/ui/Field"
import TagsInput from "@/components/ui/TagsInput"
import { getDisplayName } from "@/lib/customers/utils"
import { canDeleteCustomer } from "@/lib/customers/permissions"
import type { CustomerResponse, StaffResponse } from "@/lib/api/types"

export type CustomerFormValues = {
  name: string
  display_name?: string
  whatsapp_number: string
  email?: string | null
  notes: string
  tags: string[]
}

type Props = {
  customer: CustomerResponse
  /** Drives the "Delete customer" button visibility (admin/owner only). */
  currentUser: StaffResponse | null
  onSubmit: (values: CustomerFormValues) => void
  onCancel: () => void
  onDelete: () => void
  isSubmitting?: boolean
  submitError?: unknown
}

const CustomerForm = ({
  customer,
  currentUser,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  submitError,
}: Props) => {
  const showDelete = canDeleteCustomer(currentUser)
  const md = customer.extra_metadata ?? {}
  const initialNotes = typeof md.notes === "string" ? md.notes : ""
  const initialTags = Array.isArray(md.tags)
    ? (md.tags as unknown[]).filter((t): t is string => typeof t === "string")
    : []

  const [name, setName] = useState(customer.name ?? "")
  const [displayName, setDisplayName] = useState(customer.display_name ?? "")
  const [whatsapp, setWhatsapp] = useState(customer.whatsapp_number)
  const [email, setEmail] = useState(customer.email ?? "")
  const [notes, setNotes] = useState(initialNotes)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [errors, setErrors] = useState<{ name?: boolean; whatsapp?: boolean }>(
    {},
  )

  const handleSubmit = () => {
    const next = {
      name: !name.trim(),
      whatsapp: !whatsapp.trim(),
    } as { name?: boolean; whatsapp?: boolean }
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

  const errorMessage =
    submitError instanceof Error
      ? submitError.message
      : submitError
        ? "Couldn't save changes."
        : null

  return (
    <>
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
          <Link
            href={`/customers/${customer.id}`}
            className="text-fg-muted hover:text-fg transition-colors"
          >
            {getDisplayName(customer)}
          </Link>
          <span className="text-fg-subtle mx-1.5">/</span>
          <span className="text-fg font-medium">Edit</span>
        </nav>
        <Button onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 p-4 max-w-[640px] mx-auto">
        {errorMessage && (
          <div className="flex items-start gap-2 bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[8px] px-3 py-2 text-[11.5px] text-[#F09595]">
            <HiOutlineExclamationTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Card>
          <CardHeader title="Profile" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field label="Display name">
              <Input
                value={displayName}
                onChange={setDisplayName}
                placeholder="Emperor"
              />
            </Field>
            <Field label="Full name" required error={errors.name}>
              <Input value={name} onChange={setName} placeholder="Emperor Eze" />
            </Field>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="WhatsApp number" required error={errors.whatsapp}>
                <Input
                  value={whatsapp}
                  onChange={setWhatsapp}
                  placeholder="+234 ..."
                />
              </Field>
              <Field label="Email">
                <Input
                  value={email}
                  onChange={setEmail}
                  placeholder="Not provided"
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Notes & metadata" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field label="Notes">
              <Textarea
                value={notes}
                onChange={setNotes}
                rows={4}
                placeholder="Add context, preferences, anything useful for your team…"
              />
            </Field>
            <Field label="Tags">
              <TagsInput value={tags} onChange={setTags} placeholder="Add tag…" />
            </Field>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-t border-border bg-bg">
        {showDelete ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
            className="text-[#F09595] text-[12.5px] inline-flex items-center gap-1.5 cursor-pointer hover:text-[#F0B5B5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiOutlineTrash size={13} />
            Delete customer
          </button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <Button onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </>
  )
}

export default CustomerForm
