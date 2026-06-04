"use client"
import {
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
  HiOutlineHandRaised,
} from "react-icons/hi2"

type Props = {
  pendingCount: number
  isClaiming: boolean
  claimError: Error | null
  onClaimNext: () => void
}

const HandoffsHero = ({
  pendingCount,
  isClaiming,
  claimError,
  onClaimNext,
}: Props) => {
  const idle = pendingCount === 0
  const subtitle = idle
    ? "AI is handling every conversation right now."
    : `${pendingCount} ${pendingCount === 1 ? "customer" : "customers"} waiting on a human.`

  return (
    <div
      className={`flex flex-col vsm:flex-row vsm:items-center gap-3 px-3.5 py-3 rounded-card border ${
        idle
          ? "bg-card border-border"
          : "bg-[rgba(240,169,43,0.06)] border-[rgba(240,169,43,0.25)]"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`h-9 w-9 shrink-0 rounded-full inline-flex items-center justify-center ${
            idle ? "bg-white/5 text-fg-muted" : "bg-[rgba(240,169,43,0.18)] text-[#F0C36B]"
          }`}
        >
          <HiOutlineHandRaised size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium text-fg">
            {idle ? "No customers waiting" : "Customers waiting on a human"}
          </div>
          <div className="text-[11.5px] text-fg-muted truncate">{subtitle}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 vsm:shrink-0">
        {claimError && (
          <span className="text-[11px] text-[#F09595] inline-flex items-center gap-1 max-w-[200px] truncate">
            <HiOutlineExclamationTriangle size={12} className="shrink-0" />
            <span className="truncate">{claimError.message || "Couldn't claim"}</span>
          </span>
        )}
        <button
          type="button"
          onClick={onClaimNext}
          disabled={isClaiming || idle}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-3 rounded-[8px] text-[12.5px] font-medium bg-accent text-accent-fg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isClaiming ? (
            <>
              <HiOutlineArrowPath size={13} className="animate-spin" />
              Claiming…
            </>
          ) : (
            <>
              <HiOutlineHandRaised size={13} />
              Claim next
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default HandoffsHero
