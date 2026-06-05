import type { SettingDef } from "@/lib/settings/registry"
import Toggle from "@/components/ui/Toggle"

interface SettingFieldProps {
  def: SettingDef
  value: unknown
  isDirty: boolean
  /** Greys out the control and stops onChange from firing. */
  disabled?: boolean
  onChange: (value: unknown) => void
}

export function SettingField({
  def,
  value,
  isDirty,
  disabled = false,
  onChange,
}: SettingFieldProps) {
  const lockedCls = disabled ? "opacity-50 cursor-not-allowed" : ""
  // Boolean and number get the inline "label left / control right" layout.
  if (def.type === "boolean" || def.type === "number") {
    return (
      <div className={`flex items-start gap-3 ${lockedCls}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-fg-muted">{def.label}</label>
            {isDirty && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0A92B]" />
            )}
          </div>
          {def.hint && (
            <div className="text-[10px] text-fg-subtle mt-0.5 leading-snug">
              {def.hint}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-0.5">
          {def.type === "boolean" ? (
            <Toggle
              checked={Boolean(value)}
              onChange={(v) => {
                if (disabled) return
                onChange(v)
              }}
              aria-label={def.label}
            />
          ) : (
            <>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(value ?? "")}
                disabled={disabled}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, "")
                  onChange(cleaned === "" ? "" : Number(cleaned))
                }}
                className={`bg-[#1B1C21] border rounded-[8px] px-2.5 py-1.5 text-[12px] text-fg outline-none w-[80px] text-right focus:border-accent/50 disabled:cursor-not-allowed ${
                  isDirty
                    ? "border-[rgba(240,169,43,0.4)]"
                    : "border-border"
                }`}
              />
              {def.unit && (
                <span className="text-[11px] text-fg-subtle">{def.unit}</span>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // Text / textarea / select get the stacked "label above control" layout.
  return (
    <div className={`flex flex-col gap-1.5 ${lockedCls}`}>
      <div className="flex items-center gap-1.5">
        <label className="text-[11px] text-fg-muted">{def.label}</label>
        {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-[#F0A92B]" />}
      </div>

      {def.type === "text" && (
        <input
          type="text"
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-[#1B1C21] border rounded-[8px] px-3 py-1.5 text-[12px] text-fg outline-none focus:border-accent/50 disabled:cursor-not-allowed ${
            isDirty ? "border-[rgba(240,169,43,0.4)]" : "border-border"
          }`}
        />
      )}

      {def.type === "textarea" && (
        <textarea
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={`bg-[#1B1C21] border rounded-[8px] px-3 py-2 text-[12px] text-fg outline-none resize-y min-h-[64px] leading-relaxed focus:border-accent/50 disabled:cursor-not-allowed ${
            isDirty ? "border-[rgba(240,169,43,0.4)]" : "border-border"
          }`}
        />
      )}

      {def.type === "select" && (
        <select
          value={String(value ?? "")}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-[#1B1C21] border rounded-[8px] px-3 py-1.5 text-[12px] text-fg outline-none focus:border-accent/50 appearance-none bg-no-repeat bg-[right_11px_center] pr-8 cursor-pointer disabled:cursor-not-allowed ${
            isDirty ? "border-[rgba(240,169,43,0.4)]" : "border-border"
          }`}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M1 1l5 5 5-5' stroke='%23989DA3' stroke-width='1.4' stroke-linecap='round'/%3e%3c/svg%3e")`,
          }}
        >
          {def.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {def.hint && (
        <div className="text-[10px] text-fg-subtle leading-snug">
          {def.hint}
        </div>
      )}
    </div>
  )
}
