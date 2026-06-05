import type { ComponentType } from "react"
import {
  HiOutlineBell,
  HiOutlineBuildingStorefront,
  HiOutlineTruck,
} from "react-icons/hi2"
import { LiaRobotSolid } from "react-icons/lia"

import type { IconSlot, IconTone, SettingGroup } from "@/lib/settings/registry"
import type { StaffResponse } from "@/lib/api/types"
import { canEditSettingKey } from "@/lib/settings/permissions"
import { SettingField } from "./SettingField"

const TONE_STYLES: Record<IconTone, string> = {
  malachite: "bg-accent/12 text-[#6FD9A0]",
  blue: "bg-[rgba(76,141,245,0.12)] text-[#8FB6F5]",
  amber: "bg-[rgba(240,169,43,0.12)] text-[#F0C36B]",
  purple: "bg-[rgba(151,84,189,0.15)] text-[#C39FE0]",
}

/**
 * Map registry icon slot → react-icons component. Keeping this in the card
 * (rather than the registry) means the registry stays a JSX-free data file.
 */
const ICON_BY_SLOT: Record<IconSlot, ComponentType<{ size?: number }>> = {
  "building-store": HiOutlineBuildingStorefront,
  robot: LiaRobotSolid,
  truck: HiOutlineTruck,
  bell: HiOutlineBell,
}

interface SettingsCardProps {
  group: SettingGroup
  values: Record<string, unknown>
  dirtyKeys: string[]
  /** Drives per-field disabled state via canEditSettingKey. */
  currentUser: StaffResponse | null
  onChange: (key: string, value: unknown) => void
}

export function SettingsCard({
  group,
  values,
  dirtyKeys,
  currentUser,
  onChange,
}: SettingsCardProps) {
  const fieldDisabled = (key: string) => !canEditSettingKey(currentUser, key)
  const Icon = ICON_BY_SLOT[group.icon]

  // Special-case the store_identity card: store name (full width) on top,
  // currency + timezone side-by-side beneath. The registry's flat list
  // can't express "these two share a row" — when we add a second side-by-
  // side pair somewhere, generalize then.
  const renderFields = () => {
    if (group.id === "store_identity") {
      const [storeName, currency, timezone] = group.settings
      return (
        <>
          <SettingField
            def={storeName}
            value={values[storeName.key]}
            isDirty={dirtyKeys.includes(storeName.key)}
            disabled={fieldDisabled(storeName.key)}
            onChange={(v) => onChange(storeName.key, v)}
          />
          <div className="grid grid-cols-2 gap-2.5">
            <SettingField
              def={currency}
              value={values[currency.key]}
              isDirty={dirtyKeys.includes(currency.key)}
              disabled={fieldDisabled(currency.key)}
              onChange={(v) => onChange(currency.key, v)}
            />
            <SettingField
              def={timezone}
              value={values[timezone.key]}
              isDirty={dirtyKeys.includes(timezone.key)}
              disabled={fieldDisabled(timezone.key)}
              onChange={(v) => onChange(timezone.key, v)}
            />
          </div>
        </>
      )
    }

    return group.settings.map((def) => (
      <SettingField
        key={def.key}
        def={def}
        value={values[def.key]}
        isDirty={dirtyKeys.includes(def.key)}
        disabled={fieldDisabled(def.key)}
        onChange={(v) => onChange(def.key, v)}
      />
    ))
  }

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <div className="px-3.5 py-3 border-b border-white/[0.04] flex items-start gap-2.5">
        <div
          className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${TONE_STYLES[group.iconTone]}`}
        >
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-fg">{group.title}</div>
          <div className="text-[11px] text-fg-subtle mt-0.5 leading-snug">
            {group.description}
          </div>
        </div>
      </div>
      <div className="p-3.5 flex flex-col gap-2.5">{renderFields()}</div>
    </div>
  )
}
