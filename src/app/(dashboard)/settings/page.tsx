"use client"

import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2"

import {
  bulkUpsertSettings,
  listSettings,
  type SettingResponse,
} from "@/lib/api/settings"
import {
  REGISTRY_BY_KEY,
  SETTINGS_REGISTRY,
} from "@/lib/settings/registry"
import { parseValue, serializeValue } from "@/lib/settings/serialize"
import { SettingsCard } from "@/components/settings/SettingsCard"

const SettingsPage = () => {
  const queryClient = useQueryClient()

  const settingsQuery = useQuery({
    queryKey: ["settings", "list"],
    queryFn: listSettings,
    staleTime: 5 * 60_000,
  })

  // key → parsed value, falling back to registry default when a key doesn't
  // exist yet on the backend.
  const serverValues = useMemo(() => {
    const result: Record<string, unknown> = {}
    const byKey = new Map(
      (settingsQuery.data ?? []).map((s) => [s.key, s] as const),
    )

    for (const def of REGISTRY_BY_KEY.values()) {
      const setting = byKey.get(def.key)
      if (setting) {
        const parsed = parseValue(setting.value, def.type)
        result[def.key] = parsed !== undefined ? parsed : def.default
      } else {
        result[def.key] = def.default
      }
    }
    return result
  }, [settingsQuery.data])

  // Local form state — only re-hydrates on a new server snapshot, not on
  // every render. If a refetch lands while the operator is typing, their
  // local edits get overwritten by the fresher server values; that's the
  // right tradeoff for settings (you don't want stale local state masking a
  // remote change made by a teammate).
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (settingsQuery.data) {
      setFormValues(serverValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsQuery.data])

  const dirtyKeys = useMemo(() => {
    const dirty: string[] = []
    for (const def of REGISTRY_BY_KEY.values()) {
      const server = serverValues[def.key]
      const form = formValues[def.key]
      if (server !== form) dirty.push(def.key)
    }
    return dirty
  }, [formValues, serverValues])

  const saveMutation = useMutation({
    mutationFn: bulkUpsertSettings,
    onSuccess: (updated) => {
      // The save response IS the new server state — merge into the cache
      // directly instead of refetching. Preserves any keys that exist on
      // the backend but aren't in our registry.
      queryClient.setQueryData<SettingResponse[]>(
        ["settings", "list"],
        (prev) => {
          const next = [...(prev ?? [])]
          const indexByKey = new Map(next.map((s, i) => [s.key, i]))
          for (const u of updated) {
            const idx = indexByKey.get(u.key)
            if (idx !== undefined) next[idx] = u
            else next.push(u)
          }
          return next
        },
      )
    },
  })

  const handleChange = (key: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleDiscard = () => {
    setFormValues(serverValues)
  }

  const handleSaveAll = () => {
    if (dirtyKeys.length === 0 || saveMutation.isPending) return
    const payload = dirtyKeys.map((key) => {
      const def = REGISTRY_BY_KEY.get(key)!
      return {
        key,
        value: serializeValue(formValues[key], def.type),
      }
    })
    saveMutation.mutate(payload)
  }

  const isLoading = settingsQuery.isLoading
  const isError = settingsQuery.isError
  const isDirty = dirtyKeys.length > 0

  return (
    <>
      {/* Sticky top action bar */}
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2.5 border-b border-border bg-bg">
        <div className="text-[12px] text-fg font-medium flex-1">Settings</div>

        {isDirty && (
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#F0C36B] bg-[rgba(240,169,43,0.1)] border border-[rgba(240,169,43,0.25)] px-2.5 py-1 rounded-[7px] mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0A92B]" />
            {dirtyKeys.length} unsaved change
            {dirtyKeys.length === 1 ? "" : "s"}
          </div>
        )}

        <button
          onClick={handleDiscard}
          disabled={!isDirty || saveMutation.isPending}
          className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          Discard
        </button>
        <button
          onClick={handleSaveAll}
          disabled={!isDirty || saveMutation.isPending}
          className="text-[12px] font-medium px-3 py-1.5 rounded-[7px] bg-accent text-accent-fg inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          {saveMutation.isPending ? (
            <>
              <HiOutlineArrowPath size={13} className="animate-spin" />
              Saving…
            </>
          ) : (
            "Save all"
          )}
        </button>
      </div>

      {/* Body */}
      <div className="p-4 max-w-[640px] mx-auto w-full flex flex-col gap-3.5">
        <div className="pb-1">
          <h1 className="text-[18px] font-medium tracking-[-0.3px] text-fg">
            Store settings
          </h1>
          <p className="text-[11.5px] text-fg-subtle mt-0.5">
            Configure how YapShop behaves for your customers.
          </p>
        </div>

        {saveMutation.error && (
          <div className="bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.25)] rounded-[9px] px-3 py-2.5 flex items-start gap-2.5 text-[11.5px] text-[#F09595]">
            <HiOutlineExclamationTriangle
              size={14}
              className="mt-0.5 shrink-0"
            />
            <div>
              <div className="font-medium">Couldn&apos;t save settings</div>
              <div className="text-[#D8B5B5] mt-0.5">
                {saveMutation.error.message ||
                  "Something went wrong. Try again."}
              </div>
            </div>
          </div>
        )}

        {saveMutation.isSuccess && !isDirty && (
          <div className="bg-[rgba(21,194,106,0.08)] border border-[rgba(21,194,106,0.25)] rounded-[9px] px-3 py-2 flex items-center gap-2 text-[11.5px] text-[#6FD9A0]">
            <HiOutlineCheck size={14} />
            Settings saved.
          </div>
        )}

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => settingsQuery.refetch()} />
        ) : (
          SETTINGS_REGISTRY.map((group) => (
            <SettingsCard
              key={group.id}
              group={group}
              values={formValues}
              dirtyKeys={dirtyKeys}
              onChange={handleChange}
            />
          ))
        )}
      </div>
    </>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-card h-44 animate-pulse"
        />
      ))}
    </div>
  )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-card border border-border rounded-card px-4 py-10 flex flex-col items-center gap-3">
      <HiOutlineExclamationCircle size={24} className="text-[#F09595]" />
      <div className="text-[12.5px] text-fg">Couldn&apos;t load settings.</div>
      <button
        onClick={onRetry}
        className="text-[12px] px-3 py-1.5 rounded-[7px] border border-border text-fg hover:bg-card-hover cursor-pointer"
      >
        Try again
      </button>
    </div>
  )
}

export default SettingsPage
