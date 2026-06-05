"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineLockClosed,
} from "react-icons/hi2"

import ConfirmDialog from "@/components/ui/ConfirmDialog"
import ProductForm from "@/components/products/ProductForm"
import { deleteProduct, getProduct, updateProduct } from "@/lib/api/products"
import { getCurrentStaff } from "@/lib/api/staff"
import { canDeleteProduct, canEditProduct } from "@/lib/products/permissions"

const EditProductPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { productId } = useParams<{ productId: string }>()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const updateMutation = useMutation({
    mutationFn: (values: Parameters<typeof updateProduct>[1]) =>
      updateProduct(productId, values),
    onSuccess: (product) => {
      queryClient.setQueryData(["products", "detail", productId], product)
      queryClient.invalidateQueries({ queryKey: ["products", "list"] })
      queryClient.invalidateQueries({ queryKey: ["products", "search"] })
      router.push("/products")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(productId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["products", "detail", productId] })
      queryClient.invalidateQueries({ queryKey: ["products", "list"] })
      queryClient.invalidateQueries({ queryKey: ["products", "search"] })
      router.push("/products")
    },
  })

  const productQuery = useQuery({
    queryKey: ["products", "detail", productId],
    queryFn: () => getProduct(productId),
    staleTime: 30_000,
    // Skip refetch once the product has been deleted — removeQueries clears the
    // cache, but this hook is still mounted until router.push unmounts the page,
    // and without this gate React Query would immediately re-run getProduct on
    // the deleted id and 404.
    enabled: !!productId && !deleteMutation.isSuccess,
  })

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })

  const me = meQuery.data ?? null
  const canEdit = canEditProduct(me)
  const canDelete = canDeleteProduct(me)

  if (!meQuery.isLoading && !canEdit) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineLockClosed size={24} className="text-[#F0A92B]" />
        <div className="text-[13px] text-fg text-center">
          You don&apos;t have permission to edit products.
        </div>
        <div className="text-[11.5px] text-fg-subtle text-center">
          Ask an admin or owner to make changes.
        </div>
        <button
          onClick={() => router.push("/products")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Back to products
        </button>
      </div>
    )
  }

  if (productQuery.isLoading) {
    return (
      <div className="p-4">
        <div className="bg-card border border-border rounded-card px-4 py-12 flex items-center justify-center gap-2 text-[12px] text-fg-muted">
          <HiOutlineArrowPath size={14} className="animate-spin" />
          Loading product…
        </div>
      </div>
    )
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineExclamationTriangle size={28} className="text-[#F09595]" />
        <div className="text-[13px] text-fg text-center">Couldn&apos;t load this product.</div>
        <div className="text-[11.5px] text-fg-subtle text-center">
          It may have been deleted, or the connection failed.
        </div>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
        >
          Back to products
        </button>
      </div>
    )
  }

  return (
    <>
      <ProductForm
        mode="edit"
        initialValues={productQuery.data}
        currentUser={me}
        onSubmit={(values) =>
          updateMutation.mutate({
            name: values.name,
            price: values.price,
            description: values.description || null,
            sku: values.sku || null,
            category_id: values.category_id || null,
            is_active: values.is_active,
            tags: values.tags,
            // Each slot either carries a fresh File (new upload) or just a
            // URL (existing item to keep). The API layer splits these into
            // `media_{i}` form parts and a `keep_media` JSON list — see
            // buildProductFormData in lib/api/products.ts.
            media: values.media.map((m) =>
              m.file
                ? { file: m.file, is_live: m.is_live }
                : { url: m.url, is_live: m.is_live },
            ),
          })
        }
        onCancel={() => router.push("/products")}
        onDelete={canDelete ? () => setConfirmingDelete(true) : undefined}
        isSubmitting={updateMutation.isPending || deleteMutation.isPending}
        submitError={updateMutation.error ?? deleteMutation.error}
      />

      <ConfirmDialog
        open={confirmingDelete}
        destructive
        title={`Delete ${productQuery.data.name}?`}
        message="This removes the product from your catalog. Existing orders that reference it stay intact. This can't be undone."
        confirmLabel="Delete product"
        cancelLabel="Keep it"
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  )
}

export default EditProductPage
