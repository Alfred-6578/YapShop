"use client"
import React, { useState } from 'react'
import { HiEllipsisHorizontal, HiPlus, HiTrash, HiOutlinePhoto } from 'react-icons/hi2'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import TagsInput from '@/components/ui/TagsInput'
import Textarea from '@/components/ui/Textarea'
import Thumbnail from '@/components/ui/Thumbnail'
import Toggle from '@/components/ui/Toggle'
import type { Product } from '@/lib/products/mockData'

type Props = {
  mode: 'create' | 'edit'
  initialValues?: Partial<Product>
  onSubmit: (values: Product) => void
  onCancel: () => void
  onDelete?: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Footwear', label: 'Footwear' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Other', label: 'Other' },
]

const PHOTO_COLORS = ['#7C2D5E', '#1F4D7A', '#5C3B7E', '#7A4419', '#2A6E54']

const EMPTY: Product = {
  id: '',
  name: '',
  sku: '',
  price: 0,
  description: '',
  category: '',
  tags: [],
  is_active: true,
  is_live: true,
  photos: [],
  thumbnail_color: '#3A3D44',
  initials: '',
}

const computeInitials = (name: string): string => {
  const trimmed = name.trim()
  if (!trimmed) return ''
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

const ProductForm = ({ mode, initialValues, onSubmit, onCancel, onDelete }: Props) => {
  const [state, setState] = useState<Product>(() =>
    mode === 'edit' && initialValues ? { ...EMPTY, ...initialValues } : EMPTY,
  )
  const [errors, setErrors] = useState<{ name: boolean; price: boolean }>({
    name: false,
    price: false,
  })

  const set = <K extends keyof Product>(key: K, value: Product[K]) => {
    setState((s) => ({ ...s, [key]: value }))
  }

  const handleAddPhoto = () => {
    const color = PHOTO_COLORS[state.photos.length % PHOTO_COLORS.length]
    const id = `new-${state.photos.length}-${state.photos.length + 1}`
    set('photos', [...state.photos, { id, color }])
  }

  const handleRemovePhoto = (id: string) => {
    set(
      'photos',
      state.photos.filter((p) => p.id !== id),
    )
  }

  const handleSubmit = () => {
    const nameInvalid = !state.name.trim()
    const priceInvalid = state.price <= 0
    if (nameInvalid || priceInvalid) {
      setErrors({ name: nameInvalid, price: priceInvalid })
      return
    }
    setErrors({ name: false, price: false })
    const initials = computeInitials(state.name)
    onSubmit({ ...state, initials })
  }

  const breadcrumbName = mode === 'create' ? 'New product' : state.name || 'Untitled'

  const photoCount = state.photos.length
  const mediaMeta = `${photoCount} photo${photoCount !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col min-h-full">
      {/* Action bar */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border">
        <span className="text-[12px] text-fg-muted flex-1 truncate">
          Products / <b className="text-fg font-medium">{breadcrumbName}</b>
        </span>
        {mode === 'edit' && (
          <button
            type="button"
            aria-label="More actions"
            className="h-8 w-8 inline-flex items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer"
          >
            <HiEllipsisHorizontal size={16} />
          </button>
        )}
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-3 p-4">
        {/* Left column */}
        <div className="space-y-3 min-w-0">
          {/* Details */}
          <Card>
            <CardHeader title="Details" />
            <div className="mt-3 space-y-3">
              <Field label="Name" required error={errors.name}>
                <Input
                  value={state.name}
                  onChange={(v) => set('name', v)}
                  placeholder="e.g. Ankara Midi Dress"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2.5">
                <Field label="SKU">
                  <Input value={state.sku} onChange={(v) => set('sku', v)} placeholder="AMD-001" />
                </Field>
                <Field label="Price" required error={errors.price}>
                  <PriceInput value={state.price} onChange={(v) => set('price', v)} />
                </Field>
              </div>
              <Field label="Description">
                <Textarea
                  value={state.description ?? ''}
                  onChange={(v) => set('description', v)}
                  placeholder="Brief description shown in the chat."
                  rows={3}
                />
              </Field>
            </div>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader title="Media" meta={<span>{mediaMeta}</span>} />
            <div className="mt-3 flex flex-wrap gap-2">
              {state.photos.map((photo, i) => (
                <Thumbnail
                  key={photo.id}
                  size={78}
                  color={photo.color}
                  initials={computeInitials(state.name)}
                  primary={i === 0}
                  onRemove={() => handleRemovePhoto(photo.id)}
                />
              ))}
              <button
                type="button"
                onClick={handleAddPhoto}
                className="h-[78px] w-[78px] border-dashed border border-white/[0.18] rounded-[8px] flex flex-col items-center justify-center text-fg-muted text-[10.5px] gap-0.5 cursor-pointer hover:bg-card-hover hover:text-fg"
              >
                <HiOutlinePhoto size={18} />
                Add photo
              </button>
            </div>
            <p className="text-[10px] text-fg-subtle mt-2">
              First photo is the primary one customers see in chat. Drag to reorder.
            </p>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader
              title="Variants"
              meta={<span className="text-fg-subtle text-[10.5px]">v2</span>}
            />
            <div className="py-3.5 flex flex-col items-center">
              <p className="text-[11.5px] text-fg-muted mb-2.5 text-center">
                No variants — sold as a single option.
              </p>
              <Button
                variant="ghost"
                icon={<HiPlus size={12} />}
                className="text-[11.5px] px-3 py-1.5"
                onClick={() => {}}
              >
                Add variants
              </Button>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-3 min-w-0">
          {/* Visibility */}
          <Card>
            <CardHeader title="Visibility" />
            <div className="mt-1">
              <ToggleRow
                title="Active"
                description="Visible in your catalog"
                checked={state.is_active}
                onChange={(v) => set('is_active', v)}
              />
              <ToggleRow
                title="Live"
                description="Customers can place orders"
                checked={state.is_live}
                onChange={(v) => set('is_live', v)}
                topBorder
              />
            </div>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader title="Organization" />
            <div className="mt-3 space-y-3">
              <Field label="Category">
                <Select
                  options={CATEGORY_OPTIONS}
                  value={state.category ?? ''}
                  onChange={(v) => set('category', v)}
                  placeholder="Choose category"
                />
              </Field>
              <Field label="Tags">
                <TagsInput
                  value={state.tags}
                  onChange={(tags) => set('tags', tags)}
                  placeholder="Add tag…"
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-t border-border bg-bg mt-auto">
        <div>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[#F09595] text-[12.5px] flex items-center gap-1.5 cursor-pointer hover:opacity-80"
            >
              <HiTrash size={14} />
              Delete product
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ---- internal sub-components ---- */

const PriceInput = ({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) => {
  return (
    <div className="bg-bg border border-border rounded-[8px] flex overflow-hidden">
      <span className="px-2.5 py-1.5 text-fg-muted text-[12px] bg-white/[0.03] border-r border-border flex items-center">
        ₦
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value === 0 ? '' : value.toLocaleString()}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^\d]/g, '')
          onChange(digits ? Number(digits) : 0)
        }}
        placeholder="0"
        className="bg-transparent outline-none flex-1 px-2 text-[12px] text-fg tnum min-w-0"
      />
    </div>
  )
}

const ToggleRow = ({
  title,
  description,
  checked,
  onChange,
  topBorder = false,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  topBorder?: boolean
}) => (
  <div
    className={`flex items-start justify-between gap-2.5 py-2.5 ${
      topBorder ? 'border-t border-white/[0.05]' : ''
    }`}
  >
    <div className="min-w-0">
      <div className="text-[12px] text-fg">{title}</div>
      <div className="text-[10.5px] text-fg-muted mt-0.5">{description}</div>
    </div>
    <Toggle checked={checked} onChange={onChange} aria-label={title} />
  </div>
)

export default ProductForm
