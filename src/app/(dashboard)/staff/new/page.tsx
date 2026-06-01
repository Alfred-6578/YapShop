'use client'

import { useRouter } from 'next/navigation'
import StaffForm from '@/components/staff/StaffForm'
import { getCurrentUser } from '@/lib/staff/mockData'

const NewStaffPage = () => {
  const router = useRouter()
  const currentUser = getCurrentUser()

  return (
    <StaffForm
      mode="invite"
      currentUser={currentUser}
      onSubmit={(values) => {
        console.log('invite staff', values)
        router.push('/staff')
      }}
      onCancel={() => router.push('/staff')}
    />
  )
}

export default NewStaffPage
