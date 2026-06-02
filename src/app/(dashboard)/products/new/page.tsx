"use client"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import ProductForm from "@/components/products/ProductForm"
import { createProduct } from "@/lib/api/products"

const NewProductPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      router.push("/products")
    },
  })

  return (
    <ProductForm
      mode="create"
      onSubmit={(values) =>
        mutation.mutate({
          name: values.name,
          price: values.price,
          description: values.description || null,
          sku: values.sku || null,
          category_id: values.category_id || null,
          is_active: values.is_active,
          is_live: values.is_live,
          tags: values.tags,
          files: values.media
            .map((m) => m.file)
            .filter((f): f is File => Boolean(f)),
        })
      }
      onCancel={() => router.push("/products")}
      isSubmitting={mutation.isPending}
      submitError={mutation.error}
    />
  )
}

export default NewProductPage
