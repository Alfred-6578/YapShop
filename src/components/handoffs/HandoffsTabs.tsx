"use client"
import SegmentedControl from "@/components/ui/SegmentedControl"

export type HandoffTab = "pending" | "active" | "resolved"

type Props = {
  tab: HandoffTab
  onTabChange: (v: HandoffTab) => void
  counts: { pending: number; active: number; resolved: number }
}

const HandoffsTabs = ({ tab, onTabChange, counts }: Props) => {
  const isSelected = (v: HandoffTab) => v === tab

  const countBadge = (count: number, selected: boolean) => (
    <span
      className={`text-[9.5px] px-1.5 py-0 rounded-[4px] ml-1.5 ${
        selected
          ? "bg-[rgba(240,169,43,0.22)] text-[#F0C36B]"
          : "bg-white/10 text-fg-muted"
      }`}
    >
      {count}
    </span>
  )

  const options: { value: HandoffTab; label: React.ReactNode }[] = [
    {
      value: "pending",
      label: <>Pending {countBadge(counts.pending, isSelected("pending"))}</>,
    },
    {
      value: "active",
      label: <>Active {countBadge(counts.active, isSelected("active"))}</>,
    },
    {
      value: "resolved",
      label: <>Resolved {countBadge(counts.resolved, isSelected("resolved"))}</>,
    },
  ]

  return (
    <div className="w-fit">
      <SegmentedControl<HandoffTab>
        options={options}
        value={tab}
        onChange={onTabChange}
      />
    </div>
  )
}

export default HandoffsTabs
