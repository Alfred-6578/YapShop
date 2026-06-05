"use client"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HiOutlineLockClosed } from "react-icons/hi2"

import ProductForm from "@/components/products/ProductForm"
import { createProduct } from "@/lib/api/products"
import { getCurrentStaff } from "@/lib/api/staff"
import { canCreateProduct } from "@/lib/products/permissions"

const NewProductPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      router.push("/products")
    },
  })

  if (!meQuery.isLoading && !canCreateProduct(meQuery.data ?? null)) {
    return (
      <div className="p-8 flex flex-col items-center gap-3 max-w-md mx-auto">
        <HiOutlineLockClosed size={24} className="text-[#F0A92B]" />
        <div className="text-[13px] text-fg text-center">
          You don&apos;t have permission to create products.
        </div>
        <div className="text-[11.5px] text-fg-subtle text-center">
          Ask an admin or owner to add a new product.
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

  return (
    <ProductForm
      mode="create"
      onSubmit={(values) => {
        // Debug log — full form state + per-media is_live being sent on
        // create. Mirrors the edit page logs so create vs. update are easy
        // to compare. Remove once the round-trip is verified.
        // eslint-disable-next-line no-console
        console.log("[products/new] submitting values:", values)
        // eslint-disable-next-line no-console
        console.log(
          "[products/new] submit media is_live:",
          values.media.map((m) => ({
            kind: m.file ? "upload" : "keep",
            url: m.url,
            is_live: m.is_live,
          })),
        )
        mutation.mutate({
          name: values.name,
          price: values.price,
          description: values.description || null,
          sku: values.sku || null,
          category_id: values.category_id || null,
          is_active: values.is_active,
          tags: values.tags,
          // New creates only have new uploads — kept-existing items are
          // impossible here. Each slot's is_live travels with its file.
          media: values.media
            .filter((m) => m.file)
            .map((m) => ({ file: m.file!, is_live: m.is_live })),
        })
      }}
      onCancel={() => router.push("/products")}
      isSubmitting={mutation.isPending}
      submitError={mutation.error}
    />
  )
}

export default NewProductPage
