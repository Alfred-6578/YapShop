"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineMagnifyingGlassMinus,
  HiOutlineTrash,
} from "react-icons/hi2"

import {
  getStaff,
  getCurrentStaff,
  updateStaff,
  deleteStaff,
  type StaffRole,
} from "@/lib/api/staff"
import {
  canChangePassword,
  canEditProfile,
  canEditRole,
  canToggleActive,
  canDelete,
  availableRoles,
} from "@/lib/staff/utils"
import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Field from "@/components/ui/Field"
import { ChangePasswordCard } from "@/components/staff/ChangePasswordCard"

const ROLE_LABELS: Record<string, string> = {
  support: "Support",
  admin: "Admin",
  owner: "Owner",
}

const EditStaffPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { staffId } = useParams<{ staffId: string }>()

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
  })

  const targetQuery = useQuery({
    queryKey: ["staff", "detail", staffId],
    queryFn: () => getStaff(staffId),
    staleTime: 30_000,
    enabled: !!staffId,
  })

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [role, setRole] = useState<StaffRole>("support")
  const [isActive, setIsActive] = useState(true)

  // Hydrate form when the loaded staff id changes. Keying on `id` (not the
  // whole `data` object) means typing in the form doesn't snap back to
  // server values on every refetch.
  const loadedId = targetQuery.data?.id
  useEffect(() => {
    const t = targetQuery.data
    if (t) {
      setName(t.name)
      setEmail(t.email)
      setPhoneNumber(t.phone_number ?? "")
      setWhatsappNumber(t.whatsapp_number ?? "")
      setRole(t.role)
      setIsActive(t.is_active)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedId])

  const updateMutation = useMutation({
    mutationFn: (values: Parameters<typeof updateStaff>[1]) =>
      updateStaff(staffId, values),
    onSuccess: (updated) => {
      queryClient.setQueryData(["staff", "detail", staffId], updated)
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] })
      router.push("/staff")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteStaff(staffId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["staff", "detail", staffId] })
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] })
      router.push("/staff")
    },
  })

  if (targetQuery.isLoading) {
    return (
      <div className="p-4">
        <div className="bg-card border border-border rounded-card px-4 py-12 flex items-center justify-center gap-2 text-[12px] text-fg-muted">
          <HiOutlineArrowPath size={14} className="animate-spin" />
          Loading staff member…
        </div>
      </div>
    )
  }

  if (targetQuery.isError || !targetQuery.data) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineMagnifyingGlassMinus size={24} className="text-[#F09595]" />
        <div className="text-[13px] text-fg text-center">
          Couldn&apos;t load this staff member.
        </div>
        <button
          onClick={() => router.push("/staff")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Back to staff
        </button>
      </div>
    )
  }

  const me = meQuery.data ?? null
  const target = targetQuery.data
  const isSelf = me?.id === target.id

  const profileEditable = canEditProfile(me, target)
  const roleEditable = canEditRole(me, target)
  const activeEditable = canToggleActive(me, target)
  const deletable = canDelete(me, target)

  // Role dropdown options: what the current user can assign, PLUS the
  // target's current role (so the dropdown can render it even when it's not
  // assignable — `disabled` prevents the user from changing it).
  const rolesAllowed = availableRoles(me)
  const roleOptions = rolesAllowed.includes(target.role)
    ? rolesAllowed
    : [...rolesAllowed, target.role]

  const isMutating = updateMutation.isPending || deleteMutation.isPending
  const mutationError = updateMutation.error ?? deleteMutation.error
  // Save is meaningful only if at least one section is editable. An admin
  // looking at another admin sees a read-only form — disabling Save avoids
  // firing a doomed mutation the backend would 403.
  const canSave = profileEditable || roleEditable || activeEditable
  const isValid =
    canSave && name.trim().length > 0 && email.trim().length > 0

  const handleSubmit = () => {
    if (!isValid || isMutating) return
    updateMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phone_number: phoneNumber.trim() || null,
      whatsapp_number: whatsappNumber.trim() || null,
      role,
      is_active: isActive,
    })
  }

  const handleDelete = () => {
    if (isMutating) return
    if (
      window.confirm(
        `Remove ${target.name} from the team? This can't be undone.`,
      )
    ) {
      deleteMutation.mutate()
    }
  }

  return (
    <>
      {/* Action bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <div className="text-[12px] text-fg-subtle flex-1 truncate">
          Staff /{" "}
          <span className="text-fg font-medium">{target.name}</span>
          {isSelf && (
            <span className="ml-1.5 text-[9.5px] px-1.5 py-0 rounded-[4px] bg-accent/15 text-[#6FD9A0]">
              you
            </span>
          )}
        </div>
        <button
          onClick={() => router.push("/staff")}
          disabled={isMutating}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isValid || isMutating}
          icon={
            updateMutation.isPending ? (
              <HiOutlineArrowPath size={14} className="animate-spin" />
            ) : undefined
          }
        >
          {updateMutation.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      {/* Form body */}
      <div className="p-4 flex flex-col gap-3 max-w-[640px] mx-auto">
        {mutationError && (
          <div className="bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[9px] px-3 py-2.5 flex items-start gap-2.5 text-[11.5px] text-[#F09595]">
            <HiOutlineExclamationTriangle
              size={14}
              className="mt-0.5 shrink-0"
            />
            <div>
              <div className="font-medium">Couldn&apos;t save</div>
              <div className="text-[#D8B5B5] mt-0.5">
                {mutationError.message || "Something went wrong."}
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader title="Profile" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field
              label="Full name"
              required
              hint={
                !profileEditable
                  ? "You don't have permission to edit this profile."
                  : undefined
              }
            >
              <Input
                value={name}
                onChange={setName}
                disabled={!profileEditable}
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="off"
                disabled={!profileEditable}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Contact" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field label="Phone number">
              <Input
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="Not provided"
                disabled={!profileEditable}
              />
            </Field>
            <Field label="WhatsApp number">
              <Input
                value={whatsappNumber}
                onChange={setWhatsappNumber}
                placeholder="Not provided"
                disabled={!profileEditable}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Role & access" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field
              label="Role"
              hint={
                !roleEditable
                  ? isSelf
                    ? "You can't change your own role."
                    : "You don't have permission to change this role."
                  : undefined
              }
            >
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                disabled={!roleEditable}
                className="bg-card border border-border rounded-[8px] px-3 py-2 text-[12.5px] text-fg outline-none focus:border-fg-muted w-full disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r] ?? r}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Active"
              hint={
                !activeEditable
                  ? isSelf
                    ? "You can't deactivate yourself."
                    : "You don't have permission to change this."
                  : isActive
                    ? "This member can access the dashboard."
                    : "Deactivated members keep their data but can't log in."
              }
            >
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={!activeEditable}
                  className="w-4 h-4 accent-[#15C26A] disabled:opacity-50"
                />
                <span className="text-[12px] text-fg">
                  {isActive ? "Active" : "Inactive"}
                </span>
              </label>
            </Field>
          </div>
        </Card>

        {canChangePassword(me, target) && (
          <ChangePasswordCard staffId={staffId} />
        )}

        {deletable && (
          <div className="flex justify-start mt-2">
            <button
              onClick={handleDelete}
              disabled={isMutating}
              className="text-[12px] px-3 py-1.5 rounded-[7px] border border-[rgba(226,75,74,0.3)] text-[#F09595] hover:bg-[rgba(226,75,74,0.05)] disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {deleteMutation.isPending ? (
                <>
                  <HiOutlineArrowPath size={13} className="animate-spin" />
                  Removing…
                </>
              ) : (
                <>
                  <HiOutlineTrash size={13} />
                  Remove from team
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default EditStaffPage
