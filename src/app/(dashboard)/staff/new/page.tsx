"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineLockClosed,
  HiOutlineUserPlus,
} from "react-icons/hi2"

import {
  createStaff,
  getCurrentStaff,
  type StaffRole,
} from "@/lib/api/staff"
import { availableRoles, canInviteStaff } from "@/lib/staff/utils"
import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Field from "@/components/ui/Field"
import PasswordInput from "@/components/ui/PasswordInput"

const ROLE_LABELS: Record<string, string> = {
  support: "Support",
  admin: "Admin",
  owner: "Owner",
}

function generatePassword(): string {
  const chars =
    "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*"
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("")
}

const NewStaffPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
  })

  const me = meQuery.data ?? null
  const rolesAllowed = availableRoles(me)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [role, setRole] = useState<StaffRole>("support")
  const [password, setPassword] = useState("")

  // Default the role to whatever the current user is actually allowed to
  // assign. Joining into a stable string so the effect only refires when the
  // allowed-set itself changes — not on every render that produces a new
  // array identity.
  const rolesKey = rolesAllowed.join("|")
  useEffect(() => {
    if (rolesAllowed.length > 0 && !rolesAllowed.includes(role)) {
      setRole(rolesAllowed[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesKey, role])

  const createMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] })
      router.push("/staff")
    },
  })

  if (meQuery.isLoading) {
    return (
      <div className="p-4">
        <div className="bg-card border border-border rounded-card px-4 py-12 flex items-center justify-center gap-2 text-[12px] text-fg-muted">
          <HiOutlineArrowPath size={14} className="animate-spin" />
          Loading…
        </div>
      </div>
    )
  }

  if (!canInviteStaff(me)) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineLockClosed size={24} className="text-[#F0A92B]" />
        <div className="text-[13px] text-fg text-center">
          You don&apos;t have permission to invite staff.
        </div>
        <div className="text-[11.5px] text-fg-subtle text-center">
          Ask an admin or owner to add a new team member.
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

  const isValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8 &&
    rolesAllowed.includes(role)

  const handleSubmit = () => {
    if (!isValid || createMutation.isPending) return
    createMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      phone_number: phoneNumber.trim() || null,
      whatsapp_number: whatsappNumber.trim() || null,
      role,
      password,
      is_active: true,
    })
  }

  return (
    <>
      {/* Action bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <div className="text-[12px] text-fg-subtle flex-1">
          Staff /{" "}
          <span className="text-fg font-medium">Invite</span>
        </div>
        <button
          onClick={() => router.push("/staff")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Cancel
        </button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!isValid || createMutation.isPending}
          icon={
            createMutation.isPending ? (
              <HiOutlineArrowPath size={14} className="animate-spin" />
            ) : (
              <HiOutlineUserPlus size={14} />
            )
          }
        >
          {createMutation.isPending ? "Inviting…" : "Send invite"}
        </Button>
      </div>

      {/* Form body */}
      <div className="p-4 flex flex-col gap-3 max-w-[640px] mx-auto">
        {createMutation.error && (
          <div className="bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[9px] px-3 py-2.5 flex items-start gap-2.5 text-[11.5px] text-[#F09595]">
            <HiOutlineExclamationTriangle
              size={14}
              className="mt-0.5 shrink-0"
            />
            <div>
              <div className="font-medium">Couldn&apos;t create staff</div>
              <div className="text-[#D8B5B5] mt-0.5">
                {createMutation.error.message ||
                  "Something went wrong. Try again."}
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader title="Profile" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field label="Full name" required>
              <Input
                value={name}
                onChange={setName}
                placeholder="Adaeze Eze"
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="adaeze@yapshop.com"
                autoComplete="off"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Contact" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field
              label="Phone number"
              hint="Personal line — not used for WhatsApp"
            >
              <Input
                value={phoneNumber}
                onChange={setPhoneNumber}
                placeholder="+234 802 …"
              />
            </Field>
            <Field
              label="WhatsApp number"
              hint="Used when this staff member talks to customers"
            >
              <Input
                value={whatsappNumber}
                onChange={setWhatsappNumber}
                placeholder="+234 803 …"
              />
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="Role & access" />
          <div className="mt-3 flex flex-col gap-2.5">
            <Field
              label="Role"
              required
              hint={
                rolesAllowed.length === 1 && rolesAllowed[0] === "support"
                  ? "Admins can only invite support staff. To invite an admin or owner, ask an owner."
                  : undefined
              }
            >
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="bg-card border border-border rounded-[8px] px-3 py-2 text-[12.5px] text-fg outline-none focus:border-fg-muted w-full cursor-pointer"
              >
                {rolesAllowed.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r] ?? r}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Initial password"
              required
              hint="Share this with the new staff member — they should change it on first login."
            >
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Set initial password"
                onRegenerate={() => setPassword(generatePassword())}
              />
              {password.length > 0 && password.length < 8 && (
                <div className="text-[10.5px] text-[#F0A92B] mt-1">
                  Password should be at least 8 characters.
                </div>
              )}
            </Field>
          </div>
        </Card>
      </div>
    </>
  )
}

export default NewStaffPage
