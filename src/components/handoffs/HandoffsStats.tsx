import { HiOutlineClock, HiOutlineArrowPath, HiOutlineCheck, HiOutlineBolt } from 'react-icons/hi2'

type Props = {
  pendingCount: number
  activeCount: number
  resolvedTodayCount: number
  avgHandlingMinutes: number
  avgWaitMinutes: number
}

const HandoffsStats = ({
  pendingCount,
  activeCount,
  resolvedTodayCount,
  avgHandlingMinutes,
  avgWaitMinutes,
}: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      <div className="bg-card border border-[rgba(240,169,43,0.25)] rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider flex items-center gap-1.5">
          <HiOutlineClock size={12} style={{ color: '#F0A92B' }} />
          <span>PENDING</span>
        </div>
        <div className="text-[22px] font-medium mt-1 tnum tracking-tight text-[#F0C36B]">{pendingCount}</div>
        <div className="text-[10px] text-fg-subtle mt-0.5">customers waiting</div>
      </div>

      <div className="bg-card border border-border rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider flex items-center gap-1.5">
          <HiOutlineArrowPath size={12} style={{ color: '#15C26A' }} />
          <span>ACTIVE</span>
        </div>
        <div className="text-[22px] font-medium mt-1 tnum tracking-tight text-[#6FD9A0]">{activeCount}</div>
        <div className="text-[10px] text-fg-subtle mt-0.5">being handled</div>
      </div>

      <div className="bg-card border border-border rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider flex items-center gap-1.5">
          <HiOutlineCheck size={12} className="text-fg-muted" />
          <span>RESOLVED TODAY</span>
        </div>
        <div className="text-[22px] font-medium mt-1 tnum tracking-tight text-fg">{resolvedTodayCount}</div>
        <div className="text-[10px] text-fg-subtle mt-0.5">{`avg ${avgHandlingMinutes}m handling`}</div>
      </div>

      <div className="bg-card border border-border rounded-[11px] px-3 py-2.5">
        <div className="text-[10px] text-fg-subtle uppercase tracking-wider flex items-center gap-1.5">
          <HiOutlineBolt size={12} className="text-fg-muted" />
          <span>AVG WAIT</span>
        </div>
        <div className="text-[22px] font-medium mt-1 tnum tracking-tight text-fg">{`${avgWaitMinutes}m`}</div>
        <div className="text-[10px] text-fg-subtle mt-0.5">last 24 hours</div>
      </div>
    </div>
  )
}

export default HandoffsStats
