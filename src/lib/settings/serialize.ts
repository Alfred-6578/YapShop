export type SettingType = "text" | "textarea" | "boolean" | "number" | "select"

export function parseValue(
  raw: string | undefined,
  type: SettingType,
): unknown {
  if (raw === undefined || raw === null) return undefined
  switch (type) {
    case "boolean":
      return raw === "true"
    case "number": {
      const n = Number(raw)
      return Number.isFinite(n) ? n : undefined
    }
    case "text":
    case "textarea":
    case "select":
      return raw
  }
}

export function serializeValue(value: unknown, type: SettingType): string {
  switch (type) {
    case "boolean":
      return value ? "true" : "false"
    case "number":
      return String(value ?? "")
    case "text":
    case "textarea":
    case "select":
      return String(value ?? "")
  }
}
