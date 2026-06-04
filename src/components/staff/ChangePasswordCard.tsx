"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import {
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from "react-icons/hi2"

import { changeStaffPassword } from "@/lib/api/staff"
import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Field from "@/components/ui/Field"

interface ChangePasswordCardProps {
  staffId: string
}

export function ChangePasswordCard({ staffId }: ChangePasswordCardProps) {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: (payload: { current_password: string; new_password: string }) =>
      changeStaffPassword(staffId, payload),
    onSuccess: () => {
      setCurrent("")
      setNext("")
      setConfirm("")
      setShowCurrent(false)
      setShowNew(false)
      setSuccess(true)
      // Hide the success banner after 5 seconds — feels like a confirmation,
      // not permanent UI.
      setTimeout(() => setSuccess(false), 5000)
    },
  })

  const newPasswordValid = next.length >= 8
  const passwordsMatch = next === confirm && confirm.length > 0
  const canSubmit =
    current.length > 0 &&
    newPasswordValid &&
    passwordsMatch &&
    !mutation.isPending

  const handleSubmit = () => {
    if (!canSubmit) return
    setSuccess(false)
    mutation.mutate({
      current_password: current,
      new_password: next,
    })
  }

  return (
    <Card>
      <CardHeader title="Change password" />
      <div className="mt-3 flex flex-col gap-2.5">
        {success && (
          <div className="bg-[rgba(21,194,106,0.08)] border border-[rgba(21,194,106,0.25)] rounded-[9px] px-3 py-2 flex items-center gap-2 text-[11.5px] text-[#6FD9A0]">
            <HiOutlineCheck size={14} />
            Password updated.
          </div>
        )}

        {mutation.error && (
          <div className="bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[9px] px-3 py-2 flex items-start gap-2.5 text-[11.5px] text-[#F09595]">
            <HiOutlineExclamationTriangle
              size={14}
              className="mt-0.5 shrink-0"
            />
            <div>
              <div className="font-medium">Couldn&apos;t change password</div>
              <div className="text-[#D8B5B5] mt-0.5">
                {mutation.error.message ||
                  "Check that your current password is correct and try again."}
              </div>
            </div>
          </div>
        )}

        <Field label="Current password" required>
          <RevealableInput
            value={current}
            onChange={setCurrent}
            visible={showCurrent}
            onToggleVisibility={() => setShowCurrent((s) => !s)}
            autoComplete="current-password"
          />
        </Field>

        <Field label="New password" required hint="At least 8 characters">
          <RevealableInput
            value={next}
            onChange={setNext}
            visible={showNew}
            onToggleVisibility={() => setShowNew((s) => !s)}
            autoComplete="new-password"
          />
          {next.length > 0 && !newPasswordValid && (
            <div className="text-[10.5px] text-[#F0A92B] mt-1">
              Password should be at least 8 characters.
            </div>
          )}
        </Field>

        <Field label="Confirm new password" required>
          <Input
            type={showNew ? "text" : "password"}
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
          />
          {confirm.length > 0 && next !== confirm && (
            <div className="text-[10.5px] text-[#F0A92B] mt-1">
              Passwords don&apos;t match.
            </div>
          )}
        </Field>

        <div className="flex justify-end mt-1">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            icon={
              mutation.isPending ? (
                <HiOutlineArrowPath size={14} className="animate-spin" />
              ) : undefined
            }
          >
            {mutation.isPending ? "Updating…" : "Update password"}
          </Button>
        </div>
      </div>
    </Card>
  )
}

/**
 * A password Input with an externally-controlled show/hide button. The
 * codebase's standalone PasswordInput owns its visibility state, which means
 * it can't keep two fields' visibility in sync (we want toggling "New
 * password" to also reveal "Confirm new password"). Lifting `visible` to the
 * parent gives that linked behavior.
 */
function RevealableInput({
  value,
  onChange,
  visible,
  onToggleVisibility,
  autoComplete,
}: {
  value: string
  onChange: (v: string) => void
  visible: boolean
  onToggleVisibility: () => void
  autoComplete: string
}) {
  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="pr-10"
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-fg-subtle hover:text-fg cursor-pointer"
      >
        {visible ? <HiOutlineEyeSlash size={14} /> : <HiOutlineEye size={14} />}
      </button>
    </div>
  )
}
