import {
  HiOutlineBolt,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineHandRaised,
} from "react-icons/hi2"

import {
  avgResolutionMs,
  countActive,
  countPending,
  countResolvedToday,
  formatDuration,
  getWaitBucket,
} from "@/lib/handoffs/utils"
import type { HumanHandOffResponse } from "@/lib/api/types"

type Props = { handoffs: HumanHandOffResponse[] }

type Tone = "attention" | "success" | "normal"

type Stat = {
  label: string
  value: string | number
  tone: Tone
  hint?: string
  icon: React.ReactNode
}

const toneRing: Record<Tone, string> = {
  attention: "border-[rgba(240,169,43,0.25)]",
  success: "border-border",
  normal: "border-border",
}

const toneValue: Record<Tone, string> = {
  attention: "text-[#F0C36B]",
  success: "text-[#6FD9A0]",
  normal: "text-fg",
}

const HandoffsStats = ({ handoffs }: Props) => {
  const pending = countPending(handoffs)
  const active = countActive(handoffs)
  const resolvedToday = countResolvedToday(handoffs)
  const avg = formatDuration(avgResolutionMs(handoffs))

  // Pending border escalates with the worst current wait — visual heat
  // without a separate card.
  const longestWaitBucket = handoffs
    .filter((h) => h.status === "pending")
    .map(getWaitBucket)
    .reduce<"normal" | "warning" | "urgent">((worst, b) => {
      if (b === "urgent") return "urgent"
      if (b === "warning" && worst === "normal") return "warning"
      return worst
    }, "normal")

  const pendingRing =
    pending === 0
      ? "border-border"
      : longestWaitBucket === "urgent"
        ? "border-[rgba(226,75,74,0.35)]"
        : longestWaitBucket === "warning"
          ? "border-[rgba(240,169,43,0.35)]"
          : toneRing.attention

  const stats: Stat[] = [
    {
      label: "Pending",
      value: pending,
      tone: "attention",
      hint: "customers waiting",
      icon: <HiOutlineClock size={12} style={{ color: "#F0A92B" }} />,
    },
    {
      label: "In progress",
      value: active,
      tone: "success",
      hint: "being handled",
      icon: <HiOutlineHandRaised size={12} style={{ color: "#15C26A" }} />,
    },
    {
      label: "Resolved today",
      value: resolvedToday,
      tone: "normal",
      hint: "since midnight",
      icon: <HiOutlineCheck size={12} className="text-fg-muted" />,
    },
    {
      label: "Avg resolution",
      value: avg,
      tone: "normal",
      hint: "across all resolved",
      icon: <HiOutlineBolt size={12} className="text-fg-muted" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      {stats.map((s, i) => {
        const ring = i === 0 ? pendingRing : toneRing[s.tone]
        return (
          <div
            key={s.label}
            className={`bg-card border ${ring} rounded-[11px] px-3 py-2.5`}
          >
            <div className="text-[10px] text-fg-subtle uppercase tracking-wider flex items-center gap-1.5">
              {s.icon}
              <span>{s.label}</span>
            </div>
            <div
              className={`text-[22px] font-medium mt-1 tnum tracking-tight ${toneValue[s.tone]}`}
            >
              {s.value}
            </div>
            <div className="text-[10px] text-fg-subtle mt-0.5">{s.hint}</div>
          </div>
        )
      })}
    </div>
  )
}

export default HandoffsStats
