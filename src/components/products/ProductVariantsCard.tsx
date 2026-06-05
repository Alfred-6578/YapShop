"use client"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2"

import Card from "@/components/ui/Card"
import CardHeader from "@/components/ui/CardHeader"
import Button from "@/components/ui/Button"
import Field from "@/components/ui/Field"
import Input from "@/components/ui/Input"
import Toggle from "@/components/ui/Toggle"
import {
  createVariant,
  deleteVariant,
  listVariantsByProduct,
  updateVariant,
  type VariantWritePayload,
} from "@/lib/api/variants"
import type { ProductVariantResponse, StaffResponse } from "@/lib/api/types"
import { canEditProduct } from "@/lib/products/permissions"

type Props = {
  productId: string
  /** Used to gate the editor + per-row actions. Variants share the product's
   *  edit permission — same admin+ requirement as `canEditProduct`. */
  currentUser: StaffResponse | null
}

const ProductVariantsCard = ({ productId, currentUser }: Props) => {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null) // existing variant id under edit
  const [creating, setCreating] = useState(false) // new (unsaved) row open?

  const canManage = canEditProduct(currentUser)

  const variantsQuery = useQuery({
    queryKey: ["variants", "by-product", productId],
    queryFn: () => listVariantsByProduct(productId),
    staleTime: 30_000,
    enabled: !!productId,
  })

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: ["variants", "by-product", productId],
    })
    // List page might also be showing variant-derived stock counts — keep
    // it fresh too. Cheap; the query may not even be mounted.
    queryClient.invalidateQueries({ queryKey: ["variants"] })
  }

  const createMutation = useMutation({
    mutationFn: createVariant,
    onSuccess: () => {
      setCreating(false)
      invalidateAll()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VariantWritePayload }) =>
      updateVariant(id, payload),
    onSuccess: () => {
      setEditingId(null)
      invalidateAll()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteVariant(id),
    onSuccess: () => invalidateAll(),
  })

  const variants = variantsQuery.data ?? []

  return (
    <Card>
      <CardHeader
        title="Variants"
        meta={
          <span className="text-[11px] text-fg-muted tnum">
            {variants.length === 0
              ? "Sold as a single option"
              : `${variants.length} variant${variants.length === 1 ? "" : "s"}`}
          </span>
        }
      />

      {variantsQuery.isLoading ? (
        <div className="mt-3 flex items-center gap-2 text-[11.5px] text-fg-muted py-6 justify-center">
          <HiOutlineArrowPath size={13} className="animate-spin" />
          Loading variants…
        </div>
      ) : variantsQuery.isError ? (
        <div className="mt-3 flex flex-col items-center gap-2 py-6 text-[11.5px] text-[#F09595]">
          <HiOutlineExclamationTriangle size={16} />
          <span>Couldn&apos;t load variants.</span>
          <button
            type="button"
            onClick={() => variantsQuery.refetch()}
            className="text-[11px] px-2.5 py-1 rounded-[6px] border border-border text-fg hover:bg-card-hover cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : variants.length === 0 && !creating ? (
        <div className="mt-3 flex flex-col items-center py-6 gap-2">
          <p className="text-[11.5px] text-fg-muted text-center">
            No variants — sold as a single option.
          </p>
          {canManage && (
            <Button
              variant="ghost"
              icon={<HiOutlinePlus size={12} />}
              onClick={() => setCreating(true)}
              className="text-[11.5px] px-3 py-1.5"
            >
              Add variant
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {variants.map((v) =>
            editingId === v.id ? (
              <VariantEditor
                key={v.id}
                productId={productId}
                initial={v}
                isSubmitting={updateMutation.isPending}
                submitError={updateMutation.error}
                onCancel={() => setEditingId(null)}
                onSubmit={(payload) =>
                  updateMutation.mutate({ id: v.id, payload })
                }
              />
            ) : (
              <VariantRow
                key={v.id}
                variant={v}
                canManage={canManage}
                isDeleting={
                  deleteMutation.isPending && deleteMutation.variables === v.id
                }
                onEdit={() => setEditingId(v.id)}
                onDelete={() => {
                  if (
                    window.confirm(
                      "Delete this variant? Active orders that reference it stay intact.",
                    )
                  ) {
                    deleteMutation.mutate(v.id)
                  }
                }}
              />
            ),
          )}

          {creating && (
            <VariantEditor
              productId={productId}
              isSubmitting={createMutation.isPending}
              submitError={createMutation.error}
              onCancel={() => setCreating(false)}
              onSubmit={(payload) => createMutation.mutate(payload)}
            />
          )}

          {canManage && !creating && (
            <div className="flex justify-start pt-1">
              <Button
                variant="ghost"
                icon={<HiOutlinePlus size={12} />}
                onClick={() => setCreating(true)}
                className="text-[11.5px] px-3 py-1.5"
              >
                Add variant
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

const formatAttrs = (attrs: Record<string, unknown>): string => {
  const entries = Object.entries(attrs)
  if (entries.length === 0) return "No attributes"
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(" · ")
}

const formatPrice = (n: number): string => {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`
  return `₦${n.toLocaleString()}`
}

const VariantRow = ({
  variant,
  canManage,
  isDeleting,
  onEdit,
  onDelete,
}: {
  variant: ProductVariantResponse
  canManage: boolean
  isDeleting: boolean
  onEdit: () => void
  onDelete: () => void
}) => {
  const lowStock = variant.inventory_quantity <= variant.low_stock_threshold
  const stockClass = !variant.is_active
    ? "text-fg-subtle"
    : lowStock
      ? "text-[#F0C36B]"
      : "text-fg"

  return (
    <div className="border border-white/[0.05] rounded-[8px] px-3 py-2.5 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-[12.5px] font-medium text-fg truncate">
            {formatAttrs(variant.attributes)}
          </div>
          {!variant.is_active && (
            <span className="text-[9.5px] px-1.5 py-0 rounded-[4px] bg-white/[0.06] text-fg-subtle">
              inactive
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5 text-[10.5px] text-fg-muted mt-0.5">
          <span className="tnum">{formatPrice(variant.product_variant_price)}</span>
          <span className="text-fg-subtle">·</span>
          <span className={`tnum ${stockClass}`}>
            {variant.inventory_quantity} in stock
            {lowStock && variant.is_active ? ` (≤ ${variant.low_stock_threshold})` : ""}
          </span>
        </div>
      </div>

      {canManage && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit variant"
            className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] border border-border text-fg-muted hover:text-fg hover:bg-card-hover cursor-pointer"
          >
            <HiOutlinePencilSquare size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            aria-label="Delete variant"
            className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] border border-border text-[#F09595] hover:bg-[rgba(226,75,74,0.06)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? (
              <HiOutlineArrowPath size={13} className="animate-spin" />
            ) : (
              <HiOutlineTrash size={13} />
            )}
          </button>
        </div>
      )}
    </div>
  )
}

interface AttrPair {
  key: string
  value: string
}

const attrsToPairs = (attrs: Record<string, unknown>): AttrPair[] =>
  Object.entries(attrs).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
  }))

const pairsToAttrs = (pairs: AttrPair[]): Record<string, unknown> => {
  const out: Record<string, unknown> = {}
  for (const p of pairs) {
    const k = p.key.trim()
    if (!k) continue
    out[k] = p.value
  }
  return out
}

const VariantEditor = ({
  productId,
  initial,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: {
  productId: string
  initial?: ProductVariantResponse
  isSubmitting: boolean
  submitError: Error | null
  onCancel: () => void
  onSubmit: (payload: VariantWritePayload) => void
}) => {
  const [pairs, setPairs] = useState<AttrPair[]>(() =>
    initial
      ? attrsToPairs(initial.attributes).length > 0
        ? attrsToPairs(initial.attributes)
        : [{ key: "", value: "" }]
      : [{ key: "", value: "" }],
  )
  const [price, setPrice] = useState<string>(
    initial ? String(initial.product_variant_price) : "",
  )
  const [qty, setQty] = useState<string>(
    initial ? String(initial.inventory_quantity) : "0",
  )
  const [threshold, setThreshold] = useState<string>(
    initial ? String(initial.low_stock_threshold) : "5",
  )
  const [isActive, setIsActive] = useState<boolean>(
    initial ? initial.is_active : true,
  )

  const updatePair = (i: number, patch: Partial<AttrPair>) => {
    setPairs((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)))
  }

  const handleSubmit = () => {
    if (isSubmitting) return
    const priceNum = Number(price)
    if (!Number.isFinite(priceNum) || priceNum < 0) return
    const qtyNum = Math.max(0, Math.floor(Number(qty) || 0))
    const thresholdNum = Math.max(0, Math.floor(Number(threshold) || 0))
    onSubmit({
      product_id: productId,
      attributes: pairsToAttrs(pairs),
      product_variant_price: priceNum,
      inventory_quantity: qtyNum,
      low_stock_threshold: thresholdNum,
      is_active: isActive,
    })
  }

  return (
    <div className="border border-border-strong rounded-[8px] p-3 bg-bg/40 flex flex-col gap-3">
      <div className="text-[11px] text-fg-muted font-medium uppercase tracking-wide">
        {initial ? "Edit variant" : "New variant"}
      </div>

      {/* Attributes */}
      <Field label="Attributes" hint="e.g. size: M, color: Red. Add a row per attribute.">
        <div className="flex flex-col gap-2">
          {pairs.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  value={p.key}
                  onChange={(v) => updatePair(i, { key: v })}
                  placeholder="Key (e.g. size)"
                />
              </div>
              <div className="flex-1">
                <Input
                  value={p.value}
                  onChange={(v) => updatePair(i, { value: v })}
                  placeholder="Value (e.g. M)"
                />
              </div>
              <button
                type="button"
                onClick={() => setPairs((prev) => prev.filter((_, idx) => idx !== i))}
                aria-label="Remove attribute"
                className="shrink-0 h-8 w-8 inline-flex items-center justify-center rounded-[6px] text-fg-subtle hover:text-fg hover:bg-card-hover cursor-pointer"
              >
                <HiOutlineXMark size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPairs((prev) => [...prev, { key: "", value: "" }])}
            className="self-start text-[11px] text-fg-muted hover:text-fg inline-flex items-center gap-1 cursor-pointer"
          >
            <HiOutlinePlus size={11} />
            Add attribute
          </button>
        </div>
      </Field>

      {/* Price + quantity */}
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Price (₦)" required>
          <Input
            type="text"
            value={price}
            onChange={(v) => setPrice(v.replace(/[^0-9.]/g, ""))}
            placeholder="0"
          />
        </Field>
        <Field label="In stock" required>
          <Input
            type="text"
            value={qty}
            onChange={(v) => setQty(v.replace(/[^0-9]/g, ""))}
            placeholder="0"
          />
        </Field>
      </div>

      {/* Threshold + active */}
      <div className="grid grid-cols-2 gap-2.5 items-end">
        <Field
          label="Low stock alert"
          hint="Notify when stock falls below this"
        >
          <Input
            type="text"
            value={threshold}
            onChange={(v) => setThreshold(v.replace(/[^0-9]/g, ""))}
            placeholder="5"
          />
        </Field>
        <div className="flex items-center justify-between gap-3 h-9">
          <div className="text-[11.5px] text-fg">Active</div>
          <Toggle
            checked={isActive}
            onChange={setIsActive}
            aria-label="Active"
          />
        </div>
      </div>

      {submitError && (
        <div className="bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[8px] px-2.5 py-1.5 text-[10.5px] text-[#F09595] flex items-start gap-1.5">
          <HiOutlineExclamationTriangle size={12} className="mt-0.5 shrink-0" />
          <span>{submitError.message || "Couldn't save variant."}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && (
            <HiOutlineArrowPath size={13} className="animate-spin" />
          )}
          {isSubmitting ? "Saving…" : initial ? "Save changes" : "Add variant"}
        </Button>
      </div>
    </div>
  )
}

export default ProductVariantsCard
