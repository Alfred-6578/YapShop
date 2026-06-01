/** Compact relative-time formatter: "now", "5m ago", "2h ago", "1d ago", "2w ago". */
export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return 'now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

/**
 * Returns a compact duration string from a starting ISO timestamp to now
 * (or to the optional endIso). "12m", "1h", "2d", "<1m" for very recent.
 * Unlike formatRelative, no trailing " ago".
 */
export function formatDuration(fromIso: string, endIso?: string): string {
  const end = endIso ? new Date(endIso).getTime() : Date.now()
  const start = new Date(fromIso).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return ''
  const delta = Math.max(0, end - start)
  if (delta < 60_000) return '<1m'
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)}m`
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)}h`
  return `${Math.floor(delta / 86_400_000)}d`
}
