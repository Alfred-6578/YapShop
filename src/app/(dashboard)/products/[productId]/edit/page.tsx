"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'

import ProductForm from '@/components/products/ProductForm'
import { MOCK_PRODUCTS } from '@/lib/products/mockData'

const EditProductPage = () => {
  const router = useRouter()
  const { productId } = useParams<{ productId: string }>()
  const product = MOCK_PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="p-4 text-fg-muted text-[12px]">Product not found.</div>
    )
  }

  return (
    <ProductForm
      mode="edit"
      initialValues={product}
      onSubmit={(values) => {
        console.log('update product', values)
        router.push('/products')
      }}
      onCancel={() => router.push('/products')}
      onDelete={() => {
        console.log('delete product', product.id)
        router.push('/products')
      }}
    />
  )
}

export default EditProductPage
