'use client'

import { useRouter, useParams } from 'next/navigation'
import StaffForm from '@/components/staff/StaffForm'
import {
  MOCK_STAFF,
  getCurrentUser,
  canDelete,
  canChangePassword,
} from '@/lib/staff/mockData'

const EditStaffPage = () => {
  const router = useRouter()
  const { staffId } = useParams<{ staffId: string }>()
  const currentUser = getCurrentUser()
  const target = MOCK_STAFF.find((s) => s.id === staffId)

  if (!target) {
    return <div className="p-4 text-fg-muted text-[12px]">Staff member not found.</div>
  }

  return (
    <StaffForm
      mode="edit"
      currentUser={currentUser}
      initialValues={target}
      onSubmit={(values) => {
        console.log('update staff', target.id, values)
        router.push('/staff')
      }}
      onCancel={() => router.push('/staff')}
      onDelete={
        canDelete(currentUser, target)
          ? () => {
              console.log('delete staff', target.id)
              router.push('/staff')
            }
          : undefined
      }
      onChangePassword={
        canChangePassword(currentUser, target)
          ? (current, next) => console.log('change password', target.id, { current, next })
          : undefined
      }
    />
  )
}

export default EditStaffPage
