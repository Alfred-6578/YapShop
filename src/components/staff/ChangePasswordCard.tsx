'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import PasswordInput from '@/components/ui/PasswordInput'
import { HiOutlineKey } from 'react-icons/hi2'

type Props = {
  onSubmit: (currentPassword: string, newPassword: string) => void
}

const ChangePasswordCard = ({ onSubmit }: Props) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match")
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError(null)
    onSubmit(currentPassword, newPassword)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <Card>
      <CardHeader title="Change password" meta={<span className="text-[11px] text-fg-muted">You can only change your own password</span>} />
      <div className="mt-3 flex flex-col gap-2.5">
        <Field label="Current password" required>
          <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
        </Field>
        <div className="grid grid-cols-2 gap-2.5">
          <Field label="New password" required>
            <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="At least 8 characters" />
          </Field>
          <Field label="Confirm new" required>
            <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-type" />
          </Field>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Button icon={<HiOutlineKey size={13} />} onClick={handleSubmit} className="text-[11.5px]">
            Update password
          </Button>
          {error && <p className="text-[11px] text-[#F09595] mt-0.5">{error}</p>}
        </div>
      </div>
    </Card>
  )
}

export default ChangePasswordCard
