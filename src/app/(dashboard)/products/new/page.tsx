"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

import ProductForm from '@/components/products/ProductForm'

const NewProductPage = () => {
  const router = useRouter()
  return (
    <ProductForm
      mode="create"
      onSubmit={(values) => {
        console.log('create product', values)
        router.push('/products')
      }}
      onCancel={() => router.push('/products')}
    />
  )
}

export default NewProductPage
