"use client"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { HiOutlineArrowPath, HiOutlineExclamationTriangle } from "react-icons/hi2"

import ConfirmDialog from "@/components/ui/ConfirmDialog"
import ProductActionBar from "@/components/products/ProductActionBar"
import ProductHero from "@/components/products/ProductHero"
import ProductMediaGallery from "@/components/products/ProductMediaGallery"
import ProductDetailsCard from "@/components/products/ProductDetailsCard"
import ProductOrganizationCard from "@/components/products/ProductOrganizationCard"
import ProductVariantsCard from "@/components/products/ProductVariantsCard"
import ProductVisibilityCard from "@/components/products/ProductVisibilityCard"
import ProductMetaCard from "@/components/products/ProductMetaCard"
import { deleteProduct, getProduct } from "@/lib/api/products"
import { getCurrentStaff } from "@/lib/api/staff"

const ProductDetailPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { productId } = useParams<{ productId: string }>()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

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
    enabled: !!productId && !deleteMutation.isSuccess,
  })

  // Debug log — inspect media + per-item is_live. Remove once the wire
  // shape is verified.
  if (productQuery.data) {
    // eslint-disable-next-line no-console
    console.log("[products/detail] media:", productQuery.data.media)
    // eslint-disable-next-line no-console
    console.log(
      "[products/detail] is_live values:",
      productQuery.data.media.map((m) => m.is_live),
    )
  }

  const meQuery = useQuery({
    queryKey: ["staff", "me"],
    queryFn: getCurrentStaff,
    staleTime: 10 * 60_000,
    retry: false,
  })

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

  const product = productQuery.data

  return (
    <>
      <ProductActionBar
        product={product}
        currentUser={meQuery.data ?? null}
        onDelete={() => setConfirmingDelete(true)}
        isDeleting={deleteMutation.isPending}
      />

      <div className="p-4 flex flex-col gap-3">
        <ProductHero product={product} />

        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 items-start">
          <div className="flex flex-col gap-3 min-w-0">
            <ProductMediaGallery product={product} />
            <ProductDetailsCard product={product} />
            <ProductVariantsCard
              productId={product.id}
              currentUser={meQuery.data ?? null}
            />
            <ProductOrganizationCard product={product} />
          </div>
          <div className="flex flex-col gap-3 min-w-0">
            <ProductVisibilityCard product={product} />
            <ProductMetaCard product={product} />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        destructive
        title={`Delete ${product.name}?`}
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

export default ProductDetailPage
