'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Field from '@/components/ui/Field'
import Toggle from '@/components/ui/Toggle'
import PasswordInput from '@/components/ui/PasswordInput'
import PasswordStrength from '@/components/ui/PasswordStrength'
import RoleOptions from './RoleOptions'
import ChangePasswordCard from './ChangePasswordCard'
import type { Staff, StaffRole } from '@/lib/staff/mockData'
import {
  availableRoles,
  canEditRole,
  canToggleActive,
  canDelete,
  canChangePassword,
} from '@/lib/staff/mockData'
import {
  HiOutlineUserPlus,
  HiOutlineTrash,
  HiOutlineInformationCircle,
} from 'react-icons/hi2'

type Props = {
  mode: 'invite' | 'edit'
  currentUser: Staff
  initialValues?: Partial<Staff>
  onSubmit: (values: {
    name: string
    email: string
    phone_number?: string
    whatsapp_number?: string
    role: StaffRole
    is_active: boolean
    initial_password?: string
  }) => void
  onCancel: () => void
  onDelete?: () => void
  onChangePassword?: (current: string, next: string) => void
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let s = ""
  for (let i = 0; i < 12; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

type FormState = {
  name: string
  email: string
  phone_number: string
  whatsapp_number: string
  role: StaffRole
  is_active: boolean
  initial_password: string
}

const StaffForm = ({
  mode,
  currentUser,
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
  onChangePassword,
}: Props) => {
  const [state, setState] = useState<FormState>({
    name: initialValues?.name ?? '',
    email: initialValues?.email ?? '',
    phone_number: initialValues?.phone_number ?? '',
    whatsapp_number: initialValues?.whatsapp_number ?? '',
    role: initialValues?.role ?? 'support',
    is_active: initialValues?.is_active ?? true,
    initial_password: '',
  })

  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({})

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((prev) => ({ ...prev, [k]: v }))

  const target: Staff = {
    id: initialValues?.id ?? 'invite-tmp',
    name: state.name,
    email: state.email,
    role: state.role,
    is_active: state.is_active,
    thumbnail_color: initialValues?.thumbnail_color ?? '#3A3D44',
    initials: initialValues?.initials ?? '??',
    created_at: initialValues?.created_at ?? '',
    updated_at: initialValues?.updated_at ?? '',
    phone_number: initialValues?.phone_number,
    whatsapp_number: initialValues?.whatsapp_number,
  }

  const isEdit = mode === 'edit'
  const isSelf = isEdit && currentUser.id === target.id
  const editingOwner = isEdit && target.role === 'owner'

  const roleEditable = canEditRole(currentUser, target)
  const activeToggleEditable = canToggleActive(currentUser, target)
  const passwordChangeAllowed = isEdit && canChangePassword(currentUser, target) && onChangePassword
  const deleteAllowed = isEdit && canDelete(currentUser, target) && onDelete

  const allowedRoles: StaffRole[] = roleEditable ? availableRoles(currentUser) : []
  const showOwnerOption = editingOwner

  let ownerNote: string
  if (editingOwner) ownerNote = "You're the Owner. To transfer ownership to another staff member, contact YapShop support."
  else if (isSelf) ownerNote = "You can't change your own role."
  else if (mode === 'invite') ownerNote = "Owner role can only be set once, at account creation."
  else ownerNote = "Owner role can only be set once, at account creation."

  let statusSublabel: string
  if (editingOwner) statusSublabel = 'Owners cannot be deactivated'
  else if (isSelf) statusSublabel = 'You cannot deactivate yourself'
  else statusSublabel = 'Currently can sign in and handle work'

  const handleSubmit = () => {
    const next = { name: !state.name.trim(), email: !state.email.trim(), password: false } as { name?: boolean; email?: boolean; password?: boolean }
    if (mode === 'invite' && state.initial_password.length < 8) next.password = true
    setErrors(next)
    if (next.name || next.email || next.password) return

    onSubmit({
      name: state.name,
      email: state.email,
      phone_number: state.phone_number || undefined,
      whatsapp_number: state.whatsapp_number || undefined,
      role: state.role,
      is_active: state.is_active,
      initial_password: mode === 'invite' ? state.initial_password : undefined,
    })
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <span className="text-[12px] text-fg-muted flex-1 truncate">
          Staff / <b className="text-fg font-medium">
            {mode === 'invite' ? 'Invite staff' : state.name || 'Edit staff'}
          </b>
          {isSelf && <span className="text-fg-subtle italic ml-1">(you)</span>}
        </span>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          icon={mode === 'invite' ? <HiOutlineUserPlus size={14} /> : undefined}
        >
          {mode === 'invite' ? 'Send invite' : 'Save changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 p-4 items-start">
        <div className="flex flex-col gap-3 min-w-0">
          <Card>
            <CardHeader title="Basic info" />
            <div className="mt-3 flex flex-col gap-2.5">
              <Field label="Name" required error={errors.name}>
                <Input value={state.name} onChange={(v) => set('name', v)} placeholder="Full name" />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input value={state.email} onChange={(v) => set('email', v)} placeholder="name@example.com" />
              </Field>
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Phone number">
                  <Input value={state.phone_number} onChange={(v) => set('phone_number', v)} placeholder="+234 ..." />
                </Field>
                <Field label="WhatsApp number">
                  <Input value={state.whatsapp_number} onChange={(v) => set('whatsapp_number', v)} placeholder="+234 ..." />
                </Field>
              </div>
            </div>
          </Card>

          {mode === 'invite' && (
            <Card>
              <CardHeader title="Access" />
              <div className="mt-3 flex flex-col gap-2.5">
                <Field label="Initial password" required error={errors.password}>
                  <PasswordInput
                    value={state.initial_password}
                    onChange={(v) => set('initial_password', v)}
                    placeholder="Generate or type a starting password"
                    onRegenerate={() => set('initial_password', generatePassword())}
                  />
                  <PasswordStrength password={state.initial_password} />
                </Field>
                <div className="bg-[rgba(76,141,245,0.08)] border border-[rgba(76,141,245,0.25)] rounded-[9px] px-2.5 py-2 flex gap-2.5 text-[11px] text-[#B8C5DA] leading-snug">
                  <HiOutlineInformationCircle size={14} className="mt-0.5 shrink-0" style={{ color: '#8FB6F5' }} />
                  <span>
                    <b className="text-[#D8E2F0] font-medium">You&apos;ll need to share this manually.</b>
                    {' '}YapShop doesn&apos;t email invites yet — copy the email and password and send them to the new staff member privately.
                  </span>
                </div>
              </div>
            </Card>
          )}

          {passwordChangeAllowed && (
            <ChangePasswordCard onSubmit={onChangePassword!} />
          )}
        </div>

        <div className="flex flex-col gap-3 min-w-0">
          <Card>
            <CardHeader title="Role" />
            <div className="mt-3">
              <RoleOptions
                value={state.role}
                onChange={(r) => set('role', r)}
                allowedRoles={allowedRoles}
                showOwner={showOwnerOption}
                ownerNote={ownerNote}
              />
            </div>
          </Card>

          {isEdit && (
            <Card>
              <CardHeader title="Status" />
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[12.5px] text-fg font-medium">Active</div>
                  <div className="text-[11px] text-fg-muted">{statusSublabel}</div>
                </div>
                <div className={activeToggleEditable ? '' : 'opacity-60 pointer-events-none'}>
                  <Toggle
                    checked={state.is_active}
                    onChange={(c) => set('is_active', c)}
                    aria-label="Toggle active"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-t border-border bg-bg">
        <div>
          {deleteAllowed && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[#F09595] text-[12.5px] inline-flex items-center gap-1.5 cursor-pointer hover:text-[#F0B5B5]"
            >
              <HiOutlineTrash size={13} />
              Delete staff member
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            icon={mode === 'invite' ? <HiOutlineUserPlus size={14} /> : undefined}
          >
            {mode === 'invite' ? 'Send invite' : 'Save changes'}
          </Button>
        </div>
      </div>
    </>
  )
}

export default StaffForm
