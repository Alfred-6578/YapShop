"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from "react-icons/hi2"

import ConfirmDialog from "@/components/ui/ConfirmDialog"
import CustomerForm, {
  type CustomerFormValues,
} from "@/components/customers/CustomerForm"
import { getDisplayName } from "@/lib/customers/utils"
import {
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from "@/lib/api/customers"
import { getCurrentStaff } from "@/lib/api/staff"

const EditCustomerPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { customerId } = useParams<{ customerId: string }>()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["customers", "detail", customerId] })
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] })
      router.push("/customers")
    },
  })

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })

  const customerQuery = useQuery({
    queryKey: ["customers", "detail", customerId],
    queryFn: () => getCustomer(customerId),
    staleTime: 30_000,
    // Skip refetch once deleted — removeQueries clears cache, but this hook
    // stays mounted until router.push unmounts the page. Without this gate
    // React Query immediately re-runs getCustomer on the deleted id and 404s.
    enabled: !!customerId && !deleteMutation.isSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      updateCustomer(customerId, {
        name: values.name,
        whatsapp_number: values.whatsapp_number,
        display_name: values.display_name,
        email: values.email || null,
        // Merge form values into existing metadata so structured keys the
        // form doesn't surface (preferred_payment, pickup_preferred, etc.)
        // survive the update.
        extra_metadata: {
          ...(customerQuery.data?.extra_metadata ?? {}),
          notes: values.notes,
          tags: values.tags,
        },
      }),
    onSuccess: (customer) => {
      queryClient.setQueryData(["customers", "detail", customerId], customer)
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] })
      router.push(`/customers/${customerId}`)
    },
  })

  if (customerQuery.isLoading) {
    return (
      <div className="p-4">
        <div className="bg-card border border-border rounded-card px-4 py-12 flex items-center justify-center gap-2 text-[12px] text-fg-muted">
          <HiOutlineArrowPath size={14} className="animate-spin" />
          Loading customer…
        </div>
      </div>
    )
  }

  if (customerQuery.isError || !customerQuery.data) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineExclamationTriangle size={28} className="text-[#F09595]" />
        <div className="text-[13px] text-fg text-center">
          Couldn&apos;t load this customer.
        </div>
        <button
          type="button"
          onClick={() => router.push("/customers")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Back to customers
        </button>
      </div>
    )
  }

  return (
    <>
      <CustomerForm
        customer={customerQuery.data}
        currentUser={meQuery.data ?? null}
        onSubmit={(values) => updateMutation.mutate(values)}
        onCancel={() => router.push(`/customers/${customerId}`)}
        onDelete={() => setConfirmingDelete(true)}
        isSubmitting={updateMutation.isPending || deleteMutation.isPending}
        submitError={updateMutation.error ?? deleteMutation.error}
      />

      <ConfirmDialog
        open={confirmingDelete}
        destructive
        title={`Delete ${getDisplayName(customerQuery.data)}?`}
        message="This removes the customer record. Their orders and conversations stay intact. This can't be undone."
        confirmLabel="Delete customer"
        cancelLabel="Keep it"
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  )
}

export default EditCustomerPage
