"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  HiEllipsisHorizontal,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlinePhoto,
  HiPlay,
  HiPlus,
  HiTrash,
  HiXMark,
} from 'react-icons/hi2'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import Field from '@/components/ui/Field'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import TagsInput from '@/components/ui/TagsInput'
import Textarea from '@/components/ui/Textarea'
import Thumbnail from '@/components/ui/Thumbnail'
import Toast from '@/components/ui/Toast'
import Toggle from '@/components/ui/Toggle'
import { listCategories } from '@/lib/api/categories'
import type { MediaResponse, ProductResponse } from '@/lib/api/types'
import { getProductInitials, isVideoMedia } from '@/lib/products/visuals'

/** Form-internal media slot. `_key` is a stable id we generate so colors and
 *  React keys track the slot's identity (not its position in the array) —
 *  reorder operations like "set as primary" move items around and we need
 *  the visual to follow the item, not stay anchored to the slot index.
 *
 *  `file` is set for slots created by the file picker; their `url` is a
 *  `blob:` object URL for preview. Slots loaded from the server have no
 *  `file` and carry the server-side URL directly. */
type FormMediaSlot = MediaResponse & { _key: string; file?: File }

export type ProductFormState = {
  name: string
  description: string
  price: number
  sku: string
  category_id: string
  tags: string[]
  is_active: boolean
  is_live: boolean
  media: FormMediaSlot[]
}

type Props = {
  mode: 'create' | 'edit'
  initialValues?: ProductResponse
  onSubmit: (values: ProductFormState) => void
  onCancel: () => void
  onDelete?: () => void
  isSubmitting?: boolean
  submitError?: Error | null
}

function toFormState(p: ProductResponse): ProductFormState {
  return {
    name: p.name,
    description: p.description ?? '',
    price: p.price,
    sku: p.sku ?? '',
    category_id: p.category_id ?? '',
    tags: p.tags,
    is_active: p.is_active,
    is_live: p.is_live ?? false,
    media: p.media.map((m, i) => ({ ...m, _key: `srv-${i}` })),
  }
}

/** Derive a stable placeholder color from a slot's identity key, so the
 *  background follows the item across reorders. */
const slotColor = (key: string): string => {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i)) % 1000
  return PHOTO_COLORS[hash % PHOTO_COLORS.length]
}

/** Fallback swatch colors used when a media item has no usable URL — keeps
 *  the slot recognizable while file upload is still stubbed. */
const PHOTO_COLORS = ['#7C2D5E', '#1F4D7A', '#5C3B7E', '#7A4419', '#2A6E54']

const MAX_MEDIA_BYTES = 15 * 1024 * 1024 // 15 MB

const EMPTY: ProductFormState = {
  name: '',
  description: '',
  price: 0,
  sku: '',
  category_id: '',
  tags: [],
  is_active: true,
  is_live: true,
  media: [],
}

const ProductForm = ({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
  isSubmitting = false,
  submitError = null,
}: Props) => {
  const [state, setState] = useState<ProductFormState>(() =>
    mode === 'edit' && initialValues ? toFormState(initialValues) : EMPTY,
  )
  const [errors, setErrors] = useState<{ name: boolean; price: boolean }>({
    name: false,
    price: false,
  })
  const [validationToast, setValidationToast] = useState<string | null>(null)

  // Simulated upload progress. We don't get real bytes from `fetch`, so we
  // run a decay curve that *looks* like an upload: fast at first, slowing
  // toward 95%, never reaching 100% until the mutation actually resolves.
  // Speed is scaled by the size of pending uploads — videos crawl, an image
  // edit fills almost instantly. This is purely UX feedback, not telemetry.
  const [fakeProgress, setFakeProgress] = useState<number | null>(null)

  const slotCounterRef = useRef(0)
  const nextKey = () => `new-${++slotCounterRef.current}`

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Keep the latest media in a ref so the unmount cleanup can revoke every
  // blob URL we created during the session.
  const mediaRef = useRef(state.media)
  useEffect(() => {
    mediaRef.current = state.media
  }, [state.media])

  useEffect(() => {
    return () => {
      for (const m of mediaRef.current) {
        if (m.file && m.url.startsWith('blob:')) URL.revokeObjectURL(m.url)
      }
    }
  }, [])

  useEffect(() => {
    if (!isSubmitting) {
      setFakeProgress(null)
      return
    }

    // Total bytes about to be uploaded — drives how slowly the curve climbs.
    // Text-only edits (0 bytes) still feel snappy; a 30MB video crawls to
    // ~90% over ~25 seconds, matching how the wait actually feels.
    const pendingBytes = mediaRef.current.reduce(
      (sum, m) => sum + (m.file?.size ?? 0),
      0,
    )
    const pendingMb = pendingBytes / (1024 * 1024)
    // decay factor per 100ms tick: smaller = slower fill
    const decay = 0.06 / (1 + pendingMb * 0.45)

    setFakeProgress(0.04)
    const id = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev === null) return prev
        if (prev >= 0.95) return 0.95
        return prev + (0.95 - prev) * decay
      })
    }, 100)
    return () => clearInterval(id)
  }, [isSubmitting])

  const { data: categories } = useQuery({
    queryKey: ['categories', 'list'],
    queryFn: listCategories,
    staleTime: 5 * 60_000,
  })

  const categoryOptions = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }))

  const set = <K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) => {
    setState((s) => ({ ...s, [key]: value }))
  }

  const handleAddPhoto = () => {
    fileInputRef.current?.click()
  }

  const handleFilesPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newSlots: FormMediaSlot[] = []
    const oversized: string[] = []
    for (const file of Array.from(files)) {
      if (file.size > MAX_MEDIA_BYTES) {
        oversized.push(file.name)
        continue
      }
      newSlots.push({
        url: URL.createObjectURL(file),
        type: file.type || 'image',
        _key: nextKey(),
        file,
      })
    }

    if (oversized.length > 0) {
      setValidationToast(
        `Too large (max 15MB): ${oversized.join(', ')}`,
      )
    }
    if (newSlots.length > 0) {
      setState((s) => ({ ...s, media: [...s.media, ...newSlots] }))
    }

    // Reset so picking the same file again still triggers onChange.
    e.target.value = ''
  }

  const handleRemovePhoto = (index: number) => {
    const removed = state.media[index]
    if (removed?.file && removed.url.startsWith('blob:')) {
      URL.revokeObjectURL(removed.url)
    }
    set(
      'media',
      state.media.filter((_, i) => i !== index),
    )
  }

  const handleSetPrimary = (index: number) => {
    if (index === 0 || index >= state.media.length) return
    setState((s) => {
      const next = [...s.media]
      const [item] = next.splice(index, 1)
      next.unshift(item)
      return { ...s, media: next }
    })
  }

  const handleSubmit = () => {
    const nameInvalid = !state.name.trim()
    const priceInvalid = state.price <= 0
    if (nameInvalid || priceInvalid) {
      setErrors({ name: nameInvalid, price: priceInvalid })
      const missing = [nameInvalid && 'Name', priceInvalid && 'Price'].filter(Boolean)
      setValidationToast(`Please fill in: ${missing.join(', ')}`)
      return
    }
    setErrors({ name: false, price: false })
    setValidationToast(null)
    onSubmit(state)
  }

  const breadcrumbName = mode === 'create' ? 'New product' : state.name || 'Untitled'

  const showProgress = isSubmitting && fakeProgress !== null
  const uploadPct = fakeProgress !== null ? Math.round(fakeProgress * 100) : 0

  const saveLabel = !isSubmitting
    ? mode === 'create'
      ? 'Create product'
      : 'Save changes'
    : showProgress && uploadPct < 95
      ? `Uploading ${uploadPct}%`
      : 'Saving…'

  const saveButton = (
    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
      {isSubmitting && <HiOutlineArrowPath size={13} className="animate-spin" />}
      {saveLabel}
    </Button>
  )

  const photoCount = state.media.length
  const mediaMeta = `${photoCount} item${photoCount !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col min-h-full">
      {validationToast && (
        <Toast
          message={validationToast}
          variant="warning"
          onClose={() => setValidationToast(null)}
        />
      )}

      {/* Action bar */}
      <div className="relative flex items-center gap-2.5 px-4 py-2.5 border-b border-border">
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
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        {saveButton}

        {showProgress && (
          <div className="absolute left-0 bottom-[-1px] h-[2px] w-full bg-white/[0.04] overflow-hidden">
            <div
              className={`h-full bg-accent transition-[width] duration-150 ease-out ${
                uploadPct >= 95 ? 'animate-pulse' : ''
              }`}
              style={{ width: `${Math.max(2, uploadPct)}%` }}
            />
          </div>
        )}
      </div>

      {submitError && (
        <div className="mx-4 mt-3 -mb-1 bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[9px] px-3 py-2.5 flex items-start gap-2.5 text-[11.5px] text-[#F09595]">
          <HiOutlineExclamationTriangle size={14} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="font-medium">Couldn&apos;t save</div>
            <div className="text-[#D8B5B5] mt-0.5">
              {submitError.message || 'Something went wrong. Try again.'}
            </div>
          </div>
        </div>
      )}

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
                  value={state.description}
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

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFilesPicked}
            />

            {state.media.length === 0 ? (
              <button
                type="button"
                onClick={handleAddPhoto}
                className="mt-3 w-full aspect-square border-dashed border-2 border-white/[0.18] rounded-[10px] flex flex-col items-center justify-center text-fg-muted gap-1.5 cursor-pointer hover:bg-card-hover hover:text-fg"
              >
                <HiOutlinePhoto size={36} />
                <span className="text-[13px] font-medium">Add the first photo or video</span>
                <span className="text-[10.5px] text-fg-subtle">Images and videos up to 15MB</span>
              </button>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {/* Big primary image */}
                <div className="relative w-full aspect-square md:aspect-[16/9] max-h-[380px] rounded-[10px] overflow-hidden bg-black/40">
                  {state.media[0].url ? (
                    isVideoMedia(state.media[0]) ? (
                      <video
                        src={state.media[0].url}
                        controls
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={state.media[0].url}
                        alt="Primary product photo"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-[44px] font-medium"
                      style={{ backgroundColor: slotColor(state.media[0]._key), color: 'rgba(255,255,255,0.85)' }}
                    >
                      {getProductInitials(state) || '??'}
                    </div>
                  )}

                  <span className="absolute top-2 left-2 bg-black/55 text-fg text-[10px] rounded-[4px] px-2 py-0.5 font-medium">
                    {isVideoMedia(state.media[0]) ? 'Primary · Video' : 'Primary'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(0)}
                    aria-label="Remove primary photo"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/65 text-fg flex items-center justify-center hover:bg-black/85 cursor-pointer"
                  >
                    <HiXMark size={16} />
                  </button>
                </div>

                {/* Smaller thumbnails — click to promote to primary */}
                <div className="flex flex-wrap gap-2">
                  {state.media.slice(1).map((m, i) => {
                    const realIndex = i + 1
                    const isVid = isVideoMedia(m)
                    return (
                      <div
                        key={m._key}
                        role="button"
                        tabIndex={0}
                        aria-label={isVid ? 'Set as primary video' : 'Set as primary photo'}
                        onClick={() => handleSetPrimary(realIndex)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSetPrimary(realIndex)
                          }
                        }}
                        className="cursor-pointer transition-transform hover:scale-[1.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded-[7px]"
                      >
                        {isVid && m.url ? (
                          <div className="relative h-16 w-16 rounded-[7px] overflow-hidden bg-black">
                            <video
                              src={m.url}
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                              <HiPlay size={20} className="text-white drop-shadow" />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleRemovePhoto(realIndex)
                              }}
                              aria-label="Remove"
                              className="absolute top-1 right-1 h-4 w-4 rounded-full bg-black/60 text-fg text-[10px] flex items-center justify-center leading-none cursor-pointer"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <Thumbnail
                            size={64}
                            src={m.url || undefined}
                            color={slotColor(m._key)}
                            initials={getProductInitials(state) || '??'}
                            onRemove={() => handleRemovePhoto(realIndex)}
                          />
                        )}
                      </div>
                    )
                  })}
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    aria-label="Add photo"
                    className="h-16 w-16 border-dashed border-2 border-white/[0.18] rounded-[7px] flex items-center justify-center text-fg-muted cursor-pointer hover:bg-card-hover hover:text-fg"
                  >
                    <HiPlus size={18} />
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] text-fg-subtle mt-2.5">
              The primary item is what customers see in chat. Click any smaller one to swap it in. Images and videos, up to 15MB each.
            </p>
          </Card>

          {/* Variants */}
          {/* <Card>
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
          </Card> */}
        </div>

        {/* Right column */}
        <div className="space-y-3 min-w-0">
          {/* Visibility */}
          <Card>
            <CardHeader title="Visibility" />
            <div className="mt-1">
              <ToggleRow
                title="Active"
                description="Customers can browse and place orders"
                checked={state.is_active}
                onChange={(v) => set('is_active', v)}
              />
              <ToggleRow
                title="Live media"
                description="Real vendor-shot photo or video — AI can share it as proof"
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
                  options={categoryOptions}
                  value={state.category_id}
                  onChange={(v) => set('category_id', v)}
                  placeholder={categories ? 'Choose category' : 'Loading…'}
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
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          {saveButton}
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
